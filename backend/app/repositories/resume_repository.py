from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.resume import ProcessingStatus, Resume


class ResumeRepository:

    @staticmethod
    def create_resume(
        *,
        db: Session,
        resume: Resume,
    ) -> Resume:
        db.add(resume)
        db.flush()
        db.refresh(resume)

        return resume

    @staticmethod
    def get_resume_by_id(
        *,
        db: Session,
        resume_id: int,
    ) -> Resume | None:
        return db.scalar(
            select(Resume).where(
                Resume.id == resume_id,
            )
        )

    @staticmethod
    def get_user_resume_by_id(
        *,
        db: Session,
        resume_id: int,
        user_id: int,
    ) -> Resume | None:
        return db.scalar(
            select(Resume).where(
                Resume.id == resume_id,
                Resume.user_id == user_id,
            )
        )

    @staticmethod
    def get_user_resumes(
        *,
        db: Session,
        user_id: int,
    ) -> list[Resume]:
        return list(
            db.scalars(
                select(Resume)
                .where(
                    Resume.user_id == user_id,
                )
                .order_by(
                    Resume.uploaded_at.desc()
                )
            )
        )

    @staticmethod
    def delete_resume(
        *,
        db: Session,
        resume: Resume,
    ) -> None:
        db.delete(resume)
        db.flush()

    @staticmethod
    def update_processing_status(
        *,
        db: Session,
        resume: Resume,
        status: ProcessingStatus,
        error: str | None = None,
    ) -> Resume:
        resume.processing_status = status.value
        resume.processing_error = error

        db.add(resume)
        db.commit()
        db.refresh(resume)

        return resume