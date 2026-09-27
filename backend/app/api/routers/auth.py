from typing import Annotated

from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    Request,
    Response,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.config import settings
from app.core.csrf import generate_csrf_token
from app.core.exceptions import AuthenticationError
from app.core.rate_limit import check_login_rate_limit
from app.dependencies import get_db
from app.models.user import User
from app.schemas.user import (
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import AuthService
from app.services.token_service import TokenService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


DBSession = Annotated[
    Session,
    Depends(get_db),
]


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
) -> None:

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )

    response.set_cookie(
        key=settings.CSRF_COOKIE_NAME,
        value=generate_csrf_token(),
        httponly=False,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )


def clear_auth_cookies(
    response: Response,
) -> None:

    response.delete_cookie(
        key="access_token",
    )

    response.delete_cookie(
        key="refresh_token",
    )

    response.delete_cookie(
        key=settings.CSRF_COOKIE_NAME,
    )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user_data: UserRegister,
    db: DBSession,
):
    return AuthService.register_user(
        user_data=user_data,
        db=db,
    )


@router.post(
    "/login",
    status_code=status.HTTP_204_NO_CONTENT,
)
def login(
    user_data: UserLogin,
    request: Request,
    response: Response,
    db: DBSession,
):
    check_login_rate_limit(request)

    tokens = AuthService.login_user(
        user_data=user_data,
        db=db,
    )

    set_auth_cookies(
        response=response,
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
    )

    return None


@router.post(
    "/token",
    status_code=status.HTTP_204_NO_CONTENT,
)
def token(
    form_data: Annotated[
        OAuth2PasswordRequestForm,
        Depends(),
    ],
    response: Response,
    db: DBSession,
):
    tokens = AuthService.login_user(
        user_data=UserLogin(
            email=form_data.username,
            password=form_data.password,
        ),
        db=db,
    )

    set_auth_cookies(
        response=response,
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
    )

    return None


@router.post(
    "/refresh",
    status_code=status.HTTP_204_NO_CONTENT,
)
def refresh(
    response: Response,
    db: DBSession,
    refresh_token: str | None = Cookie(
        default=None,
        alias="refresh_token",
    ),
):
    if not refresh_token:
        raise AuthenticationError(
            "Authentication required.",
        )

    tokens = TokenService.refresh_tokens(
        db=db,
        refresh_token=refresh_token,
    )

    set_auth_cookies(
        response=response,
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
    )

    return None


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(
    response: Response,
    db: DBSession,
    refresh_token: str | None = Cookie(
        default=None,
        alias="refresh_token",
    ),
):
    if refresh_token:
        TokenService.logout(
            db=db,
            refresh_token=refresh_token,
        )

    clear_auth_cookies(response)

    return None


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: CurrentUser,
):
    return current_user