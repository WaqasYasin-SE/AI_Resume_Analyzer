from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application import Application


def create_application(
    db: Session,
    application: Application,
) -> Application:
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application_by_id(
    db: Session,
    application_id: int,
    user_id: int,
) -> Application | None:
    statement = select(Application).where(
        Application.id == application_id,
        Application.user_id == user_id,
    )

    return db.scalar(statement)


def get_application_by_job(
    db: Session,
    job_id: int,
    user_id: int,
) -> Application | None:
    statement = select(Application).where(
        Application.job_id == job_id,
        Application.user_id == user_id,
    )

    return db.scalar(statement)


def get_user_applications(
    db: Session,
    user_id: int,
) -> list[Application]:
    statement = (
        select(Application)
        .where(Application.user_id == user_id)
        .order_by(Application.created_at.desc())
    )

    return list(db.scalars(statement).all())


def update_application(
    db: Session,
    application: Application,
) -> Application:
    db.commit()
    db.refresh(application)
    return application


def delete_application(
    db: Session,
    application: Application,
) -> None:
    db.delete(application)
    db.commit()