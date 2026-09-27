from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.csrf import validate_csrf_token
from app.database.session import get_db
from app.models.user import User
from app.schemas.notification_schema import (
    NotificationListResponse,
    NotificationResponse,
)
from app.services.notification_service import NotificationService


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get(
    "",
    response_model=NotificationListResponse,
)
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications, unread_count = (
        NotificationService.get_user_notifications(
            db=db,
            user_id=current_user.id,
        )
    )

    return NotificationListResponse(
        notifications=notifications,
        unread_count=unread_count,
    )


@router.patch(
    "/read-all",
    status_code=status.HTTP_204_NO_CONTENT,
)
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _: None = Depends(validate_csrf_token),
):
    NotificationService.mark_all_as_read(
        db=db,
        user_id=current_user.id,
    )


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
)
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _: None = Depends(validate_csrf_token),
):
    return NotificationService.mark_as_read(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id,
    )


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    _: None = Depends(validate_csrf_token),
):
    NotificationService.delete_notification(
        db=db,
        notification_id=notification_id,
        user_id=current_user.id,
    )