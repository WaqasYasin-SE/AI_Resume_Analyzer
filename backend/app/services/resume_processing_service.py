import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.exceptions import AIServiceError
from app.models.resume import ProcessingStatus, Resume
from app.repositories.analysis_repository import AnalysisRepository
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)


class ResumeProcessingService:
    """
    Coordinates the complete resume-processing pipeline:

    1. Mark resume as processing
    2. Read extracted resume text
    3. Send text to Gemini
    4. Save the analysis
    5. Mark resume as completed

    If anything fails:
    - Roll back the failed transaction
    - Store the error
    - Increment retry count
    - Mark the resume as failed
    """

    def __init__(self) -> None:
        self.llm_service = LLMService()

    def process(
        self,
        *,
        db: Session,
        resume: Resume,
    ) -> Resume:

        logger.info(
            "Starting resume processing: resume_id=%s",
            resume.id,
        )

        try:
            # ==================================================
            # 1. Mark resume as PROCESSING
            # ==================================================

            resume.processing_status = (
                ProcessingStatus.PROCESSING.value
            )
            resume.processing_error = None
            resume.last_processed_at = datetime.now(timezone.utc)

            db.add(resume)
            db.commit()
            db.refresh(resume)

            # ==================================================
            # 2. Validate extracted text
            # ==================================================

            if not resume.extracted_text:
                raise AIServiceError(
                    "No extracted text is available for this resume."
                )

            resume_text = resume.extracted_text.strip()

            if not resume_text:
                raise AIServiceError(
                    "Extracted resume text is empty."
                )

            logger.info(
                "Resume text loaded: resume_id=%s, characters=%s",
                resume.id,
                len(resume_text),
            )

            # ==================================================
            # 3. Analyze resume with Gemini
            # ==================================================

            analysis = self.llm_service.analyze_resume(
                resume_text
            )

            logger.info(
                "Gemini analysis received: resume_id=%s, score=%s",
                resume.id,
                analysis.score,
            )

            # ==================================================
            # 4. Convert Pydantic issues to JSON-serializable data
            # ==================================================

            issues = [
                issue.model_dump()
                for issue in analysis.issues
            ]

            # ==================================================
            # 5. Save analysis
            # ==================================================

            existing_analysis = (
                AnalysisRepository.get_by_resume_id(
                    db=db,
                    resume_id=resume.id,
                )
            )

            if existing_analysis:

                AnalysisRepository.update(
                    db=db,
                    analysis=existing_analysis,
                    score=analysis.score,
                    summary=analysis.summary,
                    strengths=analysis.strengths,
                    issues=issues,
                    recommendations=analysis.recommendations,
                )

            else:

                AnalysisRepository.create(
                    db=db,
                    resume_id=resume.id,
                    score=analysis.score,
                    summary=analysis.summary,
                    strengths=analysis.strengths,
                    issues=issues,
                    recommendations=analysis.recommendations,
                )

            # ==================================================
            # 6. Mark resume as COMPLETED
            # ==================================================

            resume.processing_status = (
                ProcessingStatus.COMPLETED.value
            )
            resume.processing_error = None
            resume.last_processed_at = datetime.now(timezone.utc)

            db.add(resume)

            db.commit()
            db.refresh(resume)

            logger.info(
                "Resume processing completed successfully: "
                "resume_id=%s, score=%s",
                resume.id,
                analysis.score,
            )

            return resume

        except Exception as exc:

            # ==================================================
            # 7. Rollback failed transaction
            # ==================================================

            db.rollback()

            logger.exception(
                "Resume processing failed: resume_id=%s",
                resume.id,
            )

            # ==================================================
            # 8. Store failure state
            # ==================================================

            try:

                resume.processing_status = (
                    ProcessingStatus.FAILED.value
                )

                resume.processing_error = str(exc)[:5000]

                resume.retry_count = (
                    resume.retry_count or 0
                ) + 1

                resume.last_processed_at = (
                    datetime.now(timezone.utc)
                )

                db.add(resume)

                db.commit()
                db.refresh(resume)

            except Exception:

                logger.exception(
                    "Failed to update resume failure state: "
                    "resume_id=%s",
                    resume.id,
                )

                db.rollback()

            # ==================================================
            # 9. Preserve application-level AI errors
            # ==================================================

            if isinstance(exc, AIServiceError):
                raise

            # ==================================================
            # 10. Convert unexpected errors
            # ==================================================

            raise AIServiceError(
                "Unable to process the resume at this time."
            ) from exc