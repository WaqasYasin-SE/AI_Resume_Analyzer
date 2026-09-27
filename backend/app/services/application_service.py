from sqlalchemy.orm import Session

from app.models.application import Application
from app.repositories import application_repository, job_repository
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from app.core.redis import invalidate_dashboard_cache


def create_application(
    db: Session,
    user_id: int,
    data: ApplicationCreate,
) -> Application:
    """
    Create a new job application for the authenticated user.
    """

    # Verify that the job exists and belongs to the current user.
    job = job_repository.get_job_by_id(
        db=db,
        job_id=data.job_id,
        user_id=user_id,
    )

    if job is None:
        raise ValueError("Job not found")

    # Prevent duplicate applications at the service level.
    # The database UniqueConstraint should provide the final guarantee.
    existing_application = application_repository.get_application_by_job(
        db=db,
        job_id=data.job_id,
        user_id=user_id,
    )

    if existing_application is not None:
        raise ValueError("You have already applied to this job")

    application = Application(
        user_id=user_id,
        job_id=data.job_id,
        status=data.status,
        applied_at=data.applied_at,
        notes=data.notes,
    )

    # PostgreSQL is the source of truth.
    created_application = application_repository.create_application(
        db=db,
        application=application,
    )

    # Cache is only a performance layer.
    # Redis failure should not undo a successful database operation.
    _invalidate_dashboard_cache(user_id)

    return created_application


def get_application(
    db: Session,
    application_id: int,
    user_id: int,
) -> Application | None:
    """
    Get one application belonging to the authenticated user.
    """

    return application_repository.get_application_by_id(
        db=db,
        application_id=application_id,
        user_id=user_id,
    )


def get_applications(
    db: Session,
    user_id: int,
) -> list[Application]:
    """
    Get all applications belonging to the authenticated user.
    """

    return application_repository.get_user_applications(
        db=db,
        user_id=user_id,
    )


def update_application(
    db: Session,
    application_id: int,
    user_id: int,
    data: ApplicationUpdate,
) -> Application | None:
    """
    Partially update an existing application.
    """

    application = application_repository.get_application_by_id(
        db=db,
        application_id=application_id,
        user_id=user_id,
    )

    if application is None:
        return None

    # Only update fields explicitly provided by the client.
    update_data = data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(application, field, value)

    # PostgreSQL update.
    updated_application = application_repository.update_application(
        db=db,
        application=application,
    )

    # Invalidate stale dashboard cache.
    _invalidate_dashboard_cache(user_id)

    return updated_application


def delete_application(
    db: Session,
    application_id: int,
    user_id: int,
) -> bool:
    """
    Delete an application belonging to the authenticated user.
    """

    application = application_repository.get_application_by_id(
        db=db,
        application_id=application_id,
        user_id=user_id,
    )

    if application is None:
        return False

    # PostgreSQL delete.
    application_repository.delete_application(
        db=db,
        application=application,
    )

    # Remove stale dashboard cache.
    _invalidate_dashboard_cache(user_id)

    return True


def _invalidate_dashboard_cache(user_id: int) -> None:
    """
    Redis is not critical for application CRUD.

    If Redis is unavailable, the database operation should still
    succeed. The dashboard can rebuild its cache on the next request.
    """

    try:
        invalidate_dashboard_cache(user_id)
    except Exception:
        # TODO: replace with your project logger.
        pass