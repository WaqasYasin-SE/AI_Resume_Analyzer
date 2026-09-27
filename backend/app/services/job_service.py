from sqlalchemy.orm import Session

from app.core.redis import invalidate_dashboard_cache
from app.models.job import Job
from app.repositories import job_repository
from app.schemas.job import JobCreate, JobUpdate


def create_job(
    db: Session,
    user_id: int,
    data: JobCreate,
) -> Job:
    """
    Create a new job for the authenticated user.
    """

    job = Job(
        user_id=user_id,
        company_name=data.company_name,
        job_title=data.job_title,
        description=data.description,
        job_url=data.job_url,
        location=data.location,
        salary=data.salary,
    )

    # PostgreSQL is the source of truth.
    created_job = job_repository.create_job(
        db=db,
        job=job,
    )

    # Invalidate stale dashboard cache after successful database write.
    _invalidate_dashboard_cache(user_id)

    return created_job


def get_job(
    db: Session,
    job_id: int,
    user_id: int,
) -> Job | None:
    """
    Get one job belonging to the authenticated user.
    """

    return job_repository.get_job_by_id(
        db=db,
        job_id=job_id,
        user_id=user_id,
    )


def get_jobs(
    db: Session,
    user_id: int,
) -> list[Job]:
    """
    Get all jobs belonging to the authenticated user.
    """

    return job_repository.get_user_jobs(
        db=db,
        user_id=user_id,
    )


def update_job(
    db: Session,
    job_id: int,
    user_id: int,
    data: JobUpdate,
) -> Job | None:
    """
    Partially update an existing job.
    """

    job = job_repository.get_job_by_id(
        db=db,
        job_id=job_id,
        user_id=user_id,
    )

    if job is None:
        return None

    # Only update fields explicitly provided by the client.
    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(job, field, value)

    # PostgreSQL update.
    updated_job = job_repository.update_job(
        db=db,
        job=job,
    )

    # Invalidate stale dashboard cache after successful database update.
    _invalidate_dashboard_cache(user_id)

    return updated_job


def delete_job(
    db: Session,
    job_id: int,
    user_id: int,
) -> bool:
    """
    Delete a job belonging to the authenticated user.
    """

    job = job_repository.get_job_by_id(
        db=db,
        job_id=job_id,
        user_id=user_id,
    )

    if job is None:
        return False

    # PostgreSQL delete.
    job_repository.delete_job(
        db=db,
        job=job,
    )

    # Invalidate stale dashboard cache after successful database delete.
    _invalidate_dashboard_cache(user_id)

    return True


def _invalidate_dashboard_cache(user_id: int) -> None:
    """
    Safely invalidate the user's dashboard cache.

    Redis is a performance layer, not the source of truth.
    A Redis failure should not cause a successful database
    operation to appear as failed.
    """

    try:
        invalidate_dashboard_cache(user_id)
    except Exception:
        # TODO: Replace with the project's logger.
        pass