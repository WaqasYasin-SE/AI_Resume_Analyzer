from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models.gmail_connection import GmailConnection


class GmailConnectionRepository:

    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: int,
    ) -> GmailConnection | None:
        return db.scalar(
            select(GmailConnection).where(
                GmailConnection.user_id == user_id
            )
        )

    @staticmethod
    def upsert(
        db: Session,
        user_id: int,
        gmail_address: str,
        encrypted_refresh_token: str | None,
    ) -> GmailConnection:

        values = {
            "user_id": user_id,
            "gmail_address": gmail_address,
            "is_active": True,
        }

        if encrypted_refresh_token is not None:
            values["refresh_token"] = encrypted_refresh_token

        statement = insert(GmailConnection).values(
            **values
        )

        update_values = {
            "gmail_address": gmail_address,
            "is_active": True,
        }

        if encrypted_refresh_token is not None:
            update_values["refresh_token"] = encrypted_refresh_token

        statement = statement.on_conflict_do_update(
            index_elements=[
                GmailConnection.user_id
            ],
            set_=update_values,
        )

        db.execute(statement)
        db.commit()

        connection = GmailConnectionRepository.get_by_user_id(
            db=db,
            user_id=user_id,
        )

        if connection is None:
            raise RuntimeError(
                "Failed to save Gmail connection."
            )

        return connection

    @staticmethod
    def deactivate(
        db: Session,
        user_id: int,
    ) -> None:

        connection = GmailConnectionRepository.get_by_user_id(
            db=db,
            user_id=user_id,
        )

        if connection is None:
            return

        connection.is_active = False
        connection.refresh_token = ""

        db.commit()