from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis import ResumeAnalysisDB
from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.models.resume import Resume


def get_total_resumes(
    db: Session,
    user_id: int,
) -> int:
    statement = select(func.count(Resume.id)).where(
        Resume.user_id == user_id
    )

    return db.scalar(statement) or 0


def get_resume_score(
    db: Session,
    user_id: int,
) -> float | None:
    statement = (
        select(func.avg(ResumeAnalysisDB.score))
        .join(
            Resume,
            ResumeAnalysisDB.resume_id == Resume.id,
        )
        .where(Resume.user_id == user_id)
    )

    result = db.scalar(statement)

    return float(result) if result is not None else None


def get_total_jobs(
    db: Session,
    user_id: int,
) -> int:
    statement = select(func.count(Job.id)).where(
        Job.user_id == user_id
    )

    return db.scalar(statement) or 0


def get_total_applications(
    db: Session,
    user_id: int,
) -> int:
    statement = select(func.count(Application.id)).where(
        Application.user_id == user_id
    )

    return db.scalar(statement) or 0


def get_application_count_by_status(
    db: Session,
    user_id: int,
    status: ApplicationStatus,
) -> int:
    statement = select(func.count(Application.id)).where(
        Application.user_id == user_id,
        Application.status == status,
    )

    return db.scalar(statement) or 0


def get_application_count(
    db: Session,
    user_id: int,
) -> int:
    statement = select(
        func.count(Application.id)
    ).where(
        Application.user_id == user_id
    )

    return db.scalar(statement) or 0