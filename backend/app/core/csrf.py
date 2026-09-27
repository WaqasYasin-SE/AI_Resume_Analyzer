import secrets

from fastapi import Cookie, Header

from app.core.config import settings
from app.core.exceptions import AuthenticationError


def generate_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def validate_csrf_token(
    csrf_cookie: str | None = Cookie(
        default=None,
        alias=settings.CSRF_COOKIE_NAME,
    ),
    csrf_header: str | None = Header(
        default=None,
        alias=settings.CSRF_HEADER_NAME,
    ),
) -> None:
    if not csrf_cookie or not csrf_header:
        raise AuthenticationError(
            "CSRF token required."
        )

    if not secrets.compare_digest(
        csrf_cookie,
        csrf_header,
    ):
        raise AuthenticationError(
            "Invalid CSRF token."
        )