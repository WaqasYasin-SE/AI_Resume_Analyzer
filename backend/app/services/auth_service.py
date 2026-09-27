from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import (
    AuthenticationError,
    InternalServerError,
    ValidationAppError,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories.auth_repository import AuthRepository
from app.repositories.refresh_token_repository import (
    RefreshTokenRepository,
)
from app.schemas.user import UserLogin, UserRegister


class AuthService:

    @staticmethod
    def register_user(
        *,
        user_data: UserRegister,
        db: Session,
    ) -> User:

        existing_user = AuthRepository.get_user_by_email(
            db=db,
            email=user_data.email,
        )

        if existing_user:
            raise ValidationAppError(
                "Email already registered."
            )

        try:
            user = User(
                full_name=user_data.full_name,
                email=user_data.email,
                hashed_password=hash_password(
                    user_data.password
                ),
            )

            user = AuthRepository.create_user(
                db=db,
                user=user,
            )

            db.commit()

            return user

        except Exception as exc:
            db.rollback()

            raise InternalServerError(
                "Unable to register user."
            ) from exc

    @staticmethod
    def login_user(
        *,
        user_data: UserLogin,
        db: Session,
    ) -> dict[str, str]:

        user = AuthRepository.get_user_by_email(
            db=db,
            email=user_data.email,
        )

        if user is None:
            raise AuthenticationError(
                "Invalid email or password."
            )

        if not verify_password(
            user_data.password,
            user.hashed_password,
        ):
            raise AuthenticationError(
                "Invalid email or password."
            )

        if not user.is_active:
            raise AuthenticationError(
                "Account is inactive."
            )

        try:
            access_token = create_access_token(
                {
                    "sub": str(user.id),
                }
            )

            refresh_token = create_refresh_token(
                {
                    "sub": str(user.id),
                }
            )

            refresh_token_record = RefreshToken(
                token_hash=hash_refresh_token(
                    refresh_token
                ),
                user_id=user.id,
                expires_at=(
                    datetime.now(timezone.utc)
                    + timedelta(
                        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
                    )
                ),
            )

            RefreshTokenRepository.create(
                db=db,
                refresh_token=refresh_token_record,
            )

            db.commit()

            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
            }

        except Exception as exc:
            db.rollback()

            raise InternalServerError(
                "Unable to create authentication tokens."
            ) from exc