from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundError
from app.models.notification import Notification
from app.repositories.application_repository import get_application_by_id
from app.repositories.notification_repository import NotificationRepository


class NotificationService:

    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notification_type: str = "email_response",
        application_id: int | None = None,
        email_message_id: str | None = None,
    ) -> Notification:
        """
        Create a notification for a user.

        If the notification is linked to an application,
        verify that the application belongs to the same user.
        """

        if application_id is not None:
            application = get_application_by_id(
                db=db,
                application_id=application_id,
                user_id=user_id,
            )

            if application is None:
                raise ResourceNotFoundError(
                    "Application not found."
                )

        notification = Notification(
            user_id=user_id,
            application_id=application_id,
            title=title,
            message=message,
            notification_type=notification_type,
            email_message_id=email_message_id,
        )

        return NotificationRepository.create(
            db=db,
            notification=notification,
        )

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int,
    ) -> tuple[list[Notification], int]:

        notifications = NotificationRepository.get_user_notifications(
            db=db,
            user_id=user_id,
        )

        unread_count = NotificationRepository.get_unread_count(
            db=db,
            user_id=user_id,
        )

        return notifications, unread_count

    @staticmethod
    def mark_as_read(
        db: Session,
        notification_id: int,
        user_id: int,
    ) -> Notification:

        notification = NotificationRepository.get_by_id(
            db=db,
            notification_id=notification_id,
            user_id=user_id,
        )

        if notification is None:
            raise ResourceNotFoundError(
                "Notification not found."
            )

        if not notification.is_read:
            return NotificationRepository.mark_as_read(
                db=db,
                notification=notification,
            )

        return notification

    @staticmethod
    def mark_all_as_read(
        db: Session,
        user_id: int,
    ) -> None:

        NotificationRepository.mark_all_as_read(
            db=db,
            user_id=user_id,
        )

    @staticmethod
    def delete_notification(
        db: Session,
        notification_id: int,
        user_id: int,
    ) -> None:

        notification = NotificationRepository.get_by_id(
            db=db,
            notification_id=notification_id,
            user_id=user_id,
        )

        if notification is None:
            raise ResourceNotFoundError(
                "Notification not found."
            )

        NotificationRepository.delete(
            db=db,
            notification=notification,
        )