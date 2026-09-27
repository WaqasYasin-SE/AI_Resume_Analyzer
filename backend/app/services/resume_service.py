
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.redis import invalidate_dashboard_cache
from app.core.exceptions import (
    InternalServerError,
    ResourceNotFoundError,
    ValidationAppError,
)
from app.models.resume import ProcessingStatus, Resume
from app.repositories.analysis_repository import AnalysisRepository
from app.repositories.resume_repository import ResumeRepository
from app.services.llm_service import LLMService
from app.services.pdf_service import PDFService
from app.services.resume_processing_service import (
    ResumeProcessingService,
)


MAX_RETRIES = 3
MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_EXTENSION = ".pdf"
ALLOWED_CONTENT_TYPE = "application/pdf"


class ResumeService:

    # =========================================================
    # UPLOAD
    # =========================================================

    @staticmethod
    def upload_resume(
        *,
        db: Session,
        file: UploadFile,
        user_id: int,
    ) -> Resume:

        if not file.filename:
            raise ValidationAppError(
                "File name is required."
            )

        original_filename = Path(file.filename).name
        extension = Path(original_filename).suffix.lower()

        if extension != ALLOWED_EXTENSION:
            raise ValidationAppError(
                "Only PDF files are allowed."
            )

        if file.content_type != ALLOWED_CONTENT_TYPE:
            raise ValidationAppError(
                "Invalid file type. Only PDF files are allowed."
            )

        file_data = file.file.read()

        if not file_data:
            raise ValidationAppError(
                "Uploaded file is empty."
            )

        if len(file_data) > MAX_FILE_SIZE:
            raise ValidationAppError(
                "File size must not exceed 5 MB."
            )

        if not file_data.startswith(b"%PDF-"):
            raise ValidationAppError(
                "Invalid PDF file."
            )

        upload_dir = Path(
            settings.UPLOAD_DIR
        ).resolve()

        try:
            upload_dir.mkdir(
                parents=True,
                exist_ok=True,
            )

        except OSError as exc:
            raise InternalServerError(
                "Unable to prepare file storage."
            ) from exc

        stored_filename = f"{uuid4().hex}.pdf"
        file_path = upload_dir / stored_filename

        try:
            file_path.write_bytes(file_data)

        except OSError as exc:
            raise InternalServerError(
                "Unable to save uploaded resume."
            ) from exc

        try:
            extracted_text = PDFService.extract_text(
                str(file_path)
            )

        except ValidationAppError:
            ResumeService._delete_file_safely(file_path)
            raise

        except Exception as exc:
            ResumeService._delete_file_safely(file_path)

            raise InternalServerError(
                "Unable to process the uploaded PDF."
            ) from exc

        if not extracted_text or not extracted_text.strip():
            ResumeService._delete_file_safely(file_path)

            raise ValidationAppError(
                "Unable to extract readable text from PDF."
            )

        extracted_text = extracted_text.strip()

        try:
            llm_service = LLMService()

            validation = llm_service.validate_resume_content(
                extracted_text
            )

        except ValidationAppError:
            ResumeService._delete_file_safely(file_path)
            raise

        except Exception as exc:
            ResumeService._delete_file_safely(file_path)

            raise InternalServerError(
                "Unable to validate the uploaded document."
            ) from exc

        if not validation.is_resume:
            ResumeService._delete_file_safely(file_path)

            raise ValidationAppError(
                "The uploaded document does not appear to be a resume."
            )

        resume = Resume(
            original_filename=original_filename,
            stored_filename=stored_filename,
            file_path=str(file_path),
            file_size=len(file_data),
            extracted_text=extracted_text,
            user_id=user_id,
            processing_status=ProcessingStatus.PENDING.value,
            processing_error=None,
            retry_count=0,
        )

        try:
            resume = ResumeRepository.create_resume(
                db=db,
                resume=resume,
            )

            db.commit()
            db.refresh(resume)

        except Exception as exc:
            db.rollback()

            ResumeService._delete_file_safely(file_path)

            raise InternalServerError(
                "Unable to save resume information."
            ) from exc

        processing_service = ResumeProcessingService()

        try:
            return processing_service.process(
                db=db,
                resume=resume,
            )

        finally:
            ResumeService._invalidate_dashboard_cache(
                user_id
            )

    # =========================================================
    # GET USER RESUMES
    # =========================================================

    @staticmethod
    def get_user_resumes(
        *,
        db: Session,
        user_id: int,
    ) -> list[Resume]:

        return ResumeRepository.get_user_resumes(
            db=db,
            user_id=user_id,
        )

    # =========================================================
    # GET SINGLE RESUME
    # =========================================================

    @staticmethod
    def get_resume(
        *,
        db: Session,
        resume_id: int,
        user_id: int,
    ) -> Resume:

        resume = ResumeRepository.get_user_resume_by_id(
            db=db,
            resume_id=resume_id,
            user_id=user_id,
        )

        if resume is None:
            raise ResourceNotFoundError(
                "Resume not found."
            )

        return resume

    # =========================================================
    # GET ANALYSIS
    # =========================================================

    @staticmethod
    def get_resume_analysis(
        *,
        db: Session,
        resume_id: int,
        user_id: int,
    ):

        resume = ResumeRepository.get_user_resume_by_id(
            db=db,
            resume_id=resume_id,
            user_id=user_id,
        )

        if resume is None:
            raise ResourceNotFoundError(
                "Resume not found."
            )

        if (
            resume.processing_status
            != ProcessingStatus.COMPLETED.value
        ):
            raise ValidationAppError(
                "Resume analysis is not available yet."
            )

        analysis = AnalysisRepository.get_by_resume_id(
            db=db,
            resume_id=resume_id,
        )

        if analysis is None:
            raise ResourceNotFoundError(
                "Resume analysis not found."
            )

        return analysis

    # =========================================================
    # DELETE
    # =========================================================

    @staticmethod
    def delete_resume(
        *,
        db: Session,
        resume_id: int,
        user_id: int,
    ) -> None:

        resume = ResumeRepository.get_user_resume_by_id(
            db=db,
            resume_id=resume_id,
            user_id=user_id,
        )

        if resume is None:
            raise ResourceNotFoundError(
                "Resume not found."
            )

        file_path = Path(resume.file_path)

        try:
            ResumeRepository.delete_resume(
                db=db,
                resume=resume,
            )

            db.commit()

        except Exception as exc:
            db.rollback()

            raise InternalServerError(
                "Unable to delete resume."
            ) from exc

        ResumeService._invalidate_dashboard_cache(
            user_id
        )

        ResumeService._delete_file_safely(
            file_path
        )

    # =========================================================
    # RETRY VALIDATION
    # =========================================================

    @staticmethod
    def validate_retry(
        *,
        resume: Resume,
        user_id: int,
    ) -> None:

        if resume.user_id != user_id:
            raise ResourceNotFoundError(
                "Resume not found."
            )

        if (
            resume.processing_status
            != ProcessingStatus.FAILED.value
        ):
            raise ValidationAppError(
                "Only failed resumes can be retried."
            )

        if resume.retry_count >= MAX_RETRIES:
            raise ValidationAppError(
                "Maximum retry attempts reached."
            )

    # =========================================================
    # PREPARE RETRY
    # =========================================================

    @staticmethod
    def prepare_retry(
        *,
        db: Session,
        resume: Resume,
    ) -> Resume:

        resume.processing_error = None

        resume.last_processed_at = (
            datetime.now(timezone.utc)
        )

        try:
            db.add(resume)
            db.commit()
            db.refresh(resume)

        except Exception:
            db.rollback()
            raise

        return resume

    # =========================================================
    # RETRY
    # =========================================================

    @staticmethod
    def retry_resume(
        *,
        db: Session,
        resume: Resume,
        user_id: int,
    ) -> Resume:

        ResumeService.validate_retry(
            resume=resume,
            user_id=user_id,
        )

        resume = ResumeService.prepare_retry(
            db=db,
            resume=resume,
        )

        processing_service = ResumeProcessingService()

        try:
            return processing_service.process(
                db=db,
                resume=resume,
            )

        finally:
            ResumeService._invalidate_dashboard_cache(
                user_id
            )

    # =========================================================
    # REDIS CACHE INVALIDATION
    # =========================================================

    @staticmethod
    def _invalidate_dashboard_cache(
        user_id: int,
    ) -> None:

        try:
            invalidate_dashboard_cache(user_id)

        except Exception:
            # Redis is only a performance layer.
            # Redis failure must never break resume operations.
            pass

    # =========================================================
    # SAFE FILE DELETE
    # =========================================================

    @staticmethod
    def _delete_file_safely(
        file_path: Path,
    ) -> None:

        try:
            if file_path.exists():
                file_path.unlink()

        except OSError:
            # File cleanup failure should not hide
            # the original application error.
            pass