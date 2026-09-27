from cryptography.fernet import Fernet

from app.core.config import settings


def encrypt_token(token: str) -> str:
    fernet = Fernet(
        settings.GMAIL_TOKEN_ENCRYPTION_KEY.encode()
    )

    return fernet.encrypt(
        token.encode()
    ).decode()


def decrypt_token(encrypted_token: str) -> str:
    fernet = Fernet(
        settings.GMAIL_TOKEN_ENCRYPTION_KEY.encode()
    )

    return fernet.decrypt(
        encrypted_token.encode()
    ).decode()