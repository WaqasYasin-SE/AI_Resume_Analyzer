from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.job import Job


def create_job(
    db: Session,
    job: Job,
) -> Job:
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def get_job_by_id(
    db: Session,
    job_id: int,
    user_id: int,
) -> Job | None:
    statement = select(Job).where(
        Job.id == job_id,
        Job.user_id == user_id,
    )

    return db.scalar(statement)


def get_user_jobs(
    db: Session,
    user_id: int,
) -> list[Job]:
    statement = (
        select(Job)
        .where(Job.user_id == user_id)
        .order_by(Job.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update_job(
    db: Session,
    job: Job,
) -> Job:
    db.commit()
    db.refresh(job)
    return job


def delete_job(
    db: Session,
    job: Job,
) -> None:
    db.delete(job)
    db.commit()