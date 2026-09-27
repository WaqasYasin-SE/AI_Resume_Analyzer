import secrets
from typing import Any

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from app.core.config import settings
from app.core.encryption import decrypt_token
from app.core.redis import redis_client


GMAIL_SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly"
]

OAUTH_STATE_PREFIX = "gmail_oauth_state:"
OAUTH_STATE_TTL = 600


def create_google_flow(
    state: str | None = None,
) -> Flow:
    return Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [
                    settings.GOOGLE_REDIRECT_URI
                ],
            }
        },
        scopes=GMAIL_SCOPES,
        state=state,
    )


def get_google_authorization_url(
    user_id: int,
) -> str:
    state = secrets.token_urlsafe(32)

    flow = create_google_flow(
        state=state,
    )

    flow.redirect_uri = settings.GOOGLE_REDIRECT_URI

    authorization_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )

    redis_client.hset(
        f"{OAUTH_STATE_PREFIX}{state}",
        mapping={
            "user_id": str(user_id),
            "code_verifier": flow.code_verifier,
        },
    )

    redis_client.expire(
        f"{OAUTH_STATE_PREFIX}{state}",
        OAUTH_STATE_TTL,
    )

    return authorization_url


def exchange_code_for_credentials(
    request_url: str,
    state: str,
):
    state_key = f"{OAUTH_STATE_PREFIX}{state}"

    oauth_state = redis_client.hgetall(
        state_key
    )

    if not oauth_state:
        raise ValueError(
            "Invalid or expired OAuth state."
        )

    user_id = oauth_state.get("user_id")
    code_verifier = oauth_state.get("code_verifier")

    if user_id is None or code_verifier is None:
        raise ValueError(
            "Incomplete OAuth state."
        )

    redis_client.delete(
        state_key
    )

    flow = create_google_flow(
        state=state,
    )

    flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
    flow.code_verifier = code_verifier

    flow.fetch_token(
        authorization_response=request_url,
    )

    return flow.credentials, int(user_id)


def create_gmail_credentials(
    encrypted_refresh_token: str,
) -> Credentials:
    refresh_token = decrypt_token(
        encrypted_refresh_token
    )

    return Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=GMAIL_SCOPES,
    )


def create_gmail_client(
    encrypted_refresh_token: str,
):
    credentials = create_gmail_credentials(
        encrypted_refresh_token=encrypted_refresh_token,
    )

    return build(
        "gmail",
        "v1",
        credentials=credentials,
    )


def get_gmail_profile(
    encrypted_refresh_token: str,
) -> dict[str, Any]:
    gmail = create_gmail_client(
        encrypted_refresh_token=encrypted_refresh_token,
    )

    return (
        gmail.users()
        .getProfile(userId="me")
        .execute()
    )


def get_gmail_profile_from_credentials(
    credentials: Credentials,
) -> dict[str, Any]:
    gmail = build(
        "gmail",
        "v1",
        credentials=credentials,
    )

    return (
        gmail.users()
        .getProfile(userId="me")
        .execute()
    )


def list_gmail_messages(
    encrypted_refresh_token: str,
    max_results: int = 20,
    query: str | None = None,
) -> list[dict[str, Any]]:
    if not 1 <= max_results <= 100:
        raise ValueError(
            "max_results must be between 1 and 100."
        )

    gmail = create_gmail_client(
        encrypted_refresh_token=encrypted_refresh_token,
    )

    params = {
        "userId": "me",
        "maxResults": max_results,
    }

    if query:
        params["q"] = query

    response = (
        gmail.users()
        .messages()
        .list(**params)
        .execute()
    )

    return response.get(
        "messages",
        [],
    )


def get_gmail_message(
    encrypted_refresh_token: str,
    message_id: str,
) -> dict[str, Any]:
    gmail = create_gmail_client(
        encrypted_refresh_token=encrypted_refresh_token,
    )

    return (
        gmail.users()
        .messages()
        .get(
            userId="me",
            id=message_id,
            format="full",
        )
        .execute()
    )