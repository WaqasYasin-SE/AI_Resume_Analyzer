from datetime import datetime, timedelta, timezone

from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AuthenticationError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_refresh_token,
)
from app.models.refresh_token import RefreshToken
from app.repositories.refresh_token_repository import (
    RefreshTokenRepository,
)


class TokenService:

    @staticmethod
    def refresh_tokens(
        *,
        db: Session,
        refresh_token: str,
    ) -> dict[str, str]:

        try:
            payload = decode_token(refresh_token)

        except JWTError as exc:
            raise AuthenticationError(
                "Invalid or expired refresh token."
            ) from exc

        user_id = payload.get("sub")
        token_type = payload.get("type")

        if user_id is None or token_type != "refresh":
            raise AuthenticationError(
                "Invalid refresh token."
            )

        try:
            user_id = int(user_id)

        except (TypeError, ValueError) as exc:
            raise AuthenticationError(
                "Invalid refresh token."
            ) from exc

        token_hash = hash_refresh_token(
            refresh_token
        )

        stored_token = (
            RefreshTokenRepository.get_by_token_hash(
                db=db,
                token_hash=token_hash,
            )
        )

        if stored_token is None:
            raise AuthenticationError(
                "Refresh token not found."
            )

        if stored_token.user_id != user_id:
            raise AuthenticationError(
                "Invalid refresh token."
            )

        now = datetime.now(timezone.utc)

        if stored_token.revoked_at is not None:
            raise AuthenticationError(
                "Refresh token has already been revoked."
            )

        if stored_token.expires_at <= now:
            raise AuthenticationError(
                "Refresh token has expired."
            )

        stored_token.revoked_at = now

        access_token = create_access_token(
            {
                "sub": str(user_id),
            }
        )

        new_refresh_token = create_refresh_token(
            {
                "sub": str(user_id),
            }
        )

        new_refresh_token_record = RefreshToken(
            token_hash=hash_refresh_token(
                new_refresh_token
            ),
            user_id=user_id,
            expires_at=(
                now
                + timedelta(
                    days=settings.REFRESH_TOKEN_EXPIRE_DAYS
                )
            ),
        )

        db.add(new_refresh_token_record)

        db.commit()

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }

    @staticmethod
    def logout(
        *,
        db: Session,
        refresh_token: str,
    ) -> None:

        token_hash = hash_refresh_token(
            refresh_token
        )

        stored_token = (
            RefreshTokenRepository.get_by_token_hash(
                db=db,
                token_hash=token_hash,
            )
        )

        if stored_token is None:
            return

        if stored_token.revoked_at is None:
            stored_token.revoked_at = (
                datetime.now(timezone.utc)
            )

            db.commit()