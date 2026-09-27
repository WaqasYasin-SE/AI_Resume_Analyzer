from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class AuthRepository:

    @staticmethod
    def get_user_by_email(
        *,
        db: Session,
        email: str,
    ) -> User | None:
        return db.scalar(
            select(User).where(
                User.email == email,
            )
        )

    @staticmethod
    def create_user(
        *,
        db: Session,
        user: User,
    ) -> User:
        db.add(user)
        db.flush()
        db.refresh(user)

        return user