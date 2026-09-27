from sqlalchemy.orm import Session

from app.core.encryption import encrypt_token
from app.core.exceptions import ResourceNotFoundError
from app.models.gmail_connection import GmailConnection
from app.repositories.gmail_connection_repository import (
    GmailConnectionRepository,
)


class GmailConnectionService:

    @staticmethod
    def save_connection(
        db: Session,
        user_id: int,
        gmail_address: str,
        refresh_token: str | None,
    ) -> GmailConnection:

        existing_connection = (
            GmailConnectionRepository.get_by_user_id(
                db=db,
                user_id=user_id,
            )
        )

        if existing_connection is None and refresh_token is None:
            raise ValueError(
                "Google did not provide a refresh token."
            )

        encrypted_refresh_token = None

        if refresh_token is not None:
            encrypted_refresh_token = encrypt_token(
                refresh_token
            )

        return GmailConnectionRepository.upsert(
            db=db,
            user_id=user_id,
            gmail_address=gmail_address,
            encrypted_refresh_token=encrypted_refresh_token,
        )

    @staticmethod
    def disconnect(
        db: Session,
        user_id: int,
    ) -> None:

        connection = GmailConnectionRepository.get_by_user_id(
            db=db,
            user_id=user_id,
        )

        if connection is None or not connection.is_active:
            raise ResourceNotFoundError(
                "Gmail account is not connected."
            )

        GmailConnectionRepository.deactivate(
            db=db,
            user_id=user_id,
        )