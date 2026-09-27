from typing import Annotated

from fastapi import Cookie, Depends
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import (
    AuthenticationError,
    AuthorizationError,
)
from app.dependencies import get_db
from app.models.user import User


DBSession = Annotated[
    Session,
    Depends(get_db),
]


def get_current_user(
    db: DBSession,
    access_token: str | None = Cookie(
        default=None,
        alias="access_token",
    ),
) -> User:

    if not access_token:
        raise AuthenticationError(
            "Authentication required."
        )

    try:
        payload = jwt.decode(
            access_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

        user_id = payload.get("sub")
        token_type = payload.get("type")

        if user_id is None or token_type != "access":
            raise AuthenticationError(
                "Invalid or expired token."
            )

        try:
            user_id = int(user_id)

        except (TypeError, ValueError) as exc:
            raise AuthenticationError(
                "Invalid or expired token."
            ) from exc

    except JWTError as exc:
        raise AuthenticationError(
            "Invalid or expired token."
        ) from exc

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise AuthenticationError(
            "Invalid or expired token."
        )

    if not user.is_active:
        raise AuthorizationError(
            "Account is inactive."
        )

    return user