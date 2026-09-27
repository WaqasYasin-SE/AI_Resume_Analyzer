import logging

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.csrf import validate_csrf_token
from app.database.session import get_db
from app.models.user import User
from app.repositories.gmail_connection_repository import (
    GmailConnectionRepository,
)
from app.services.gmail_connection_service import (
    GmailConnectionService,
)
from app.services.gmail_service import (
    exchange_code_for_credentials,
    get_gmail_profile_from_credentials,
    get_google_authorization_url,
)


router = APIRouter(
    prefix="/gmail",
    tags=["Gmail"],
)

logger = logging.getLogger(__name__)


@router.get("/connect")
def connect_gmail(
    current_user: User = Depends(get_current_user),
):
    authorization_url = get_google_authorization_url(
        user_id=current_user.id,
    )

    return {
        "authorization_url": authorization_url,
    }


@router.get("/status")
def gmail_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    connection = GmailConnectionRepository.get_by_user_id(
        db=db,
        user_id=current_user.id,
    )

    if connection is None or not connection.is_active:
        return {
            "connected": False,
            "gmail_address": None,
        }

    return {
        "connected": True,
        "gmail_address": connection.gmail_address,
    }


@router.get("/callback")
def gmail_callback(
    request: Request,
    db: Session = Depends(get_db),
):
    error = request.query_params.get("error")

    if error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google authorization failed: {error}",
        )

    code = request.query_params.get("code")
    state = request.query_params.get("state")

    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code not provided.",
        )

    if not state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OAuth state not provided.",
        )

    try:
        credentials, user_id = exchange_code_for_credentials(
            request_url=str(request.url),
            state=state,
        )

        profile = get_gmail_profile_from_credentials(
            credentials,
        )

        gmail_address = profile["emailAddress"]

        GmailConnectionService.save_connection(
            db=db,
            user_id=user_id,
            gmail_address=gmail_address,
            refresh_token=credentials.refresh_token,
        )

        return RedirectResponse(
            url="http://localhost:3000/profile",
            status_code=status.HTTP_303_SEE_OTHER,
        )

    except Exception:
        logger.exception("Gmail OAuth callback failed")

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to complete Gmail authorization.",
        )


@router.delete("/disconnect")
def disconnect_gmail(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    _: None = Depends(validate_csrf_token),
):
    GmailConnectionService.disconnect(
        db=db,
        user_id=current_user.id,
    )

    return {
        "message": "Gmail account disconnected successfully."
    }