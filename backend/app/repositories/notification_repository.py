from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.notification import Notification


class NotificationRepository:

    @staticmethod
    def create(
        db: Session,
        notification: Notification,
    ) -> Notification:
        db.add(notification)
        db.commit()
        db.refresh(notification)

        return notification

    @staticmethod
    def get_by_id(
        db: Session,
        notification_id: int,
        user_id: int,
    ) -> Notification | None:
        return db.scalar(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
        )

    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int,
    ) -> list[Notification]:
        return list(
            db.scalars(
                select(Notification)
                .where(Notification.user_id == user_id)
                .order_by(Notification.created_at.desc())
            ).all()
        )

    @staticmethod
    def get_unread_count(
        db: Session,
        user_id: int,
    ) -> int:
        return db.scalar(
            select(func.count(Notification.id)).where(
                Notification.user_id == user_id,
                Notification.is_read.is_(False),
            )
        ) or 0

    @staticmethod
    def mark_as_read(
        db: Session,
        notification: Notification,
    ) -> Notification:
        notification.is_read = True

        db.commit()
        db.refresh(notification)

        return notification

    @staticmethod
    def mark_all_as_read(
        db: Session,
        user_id: int,
    ) -> None:
        notifications = db.scalars(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.is_read.is_(False),
            )
        ).all()

        for notification in notifications:
            notification.is_read = True

        db.commit()

    @staticmethod
    def delete(
        db: Session,
        notification: Notification,
    ) -> None:
        db.delete(notification)
        db.commit()