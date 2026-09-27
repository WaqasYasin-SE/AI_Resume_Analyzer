from fastapi import HTTPException, Request, status

from app.core.redis import redis_client


LOGIN_RATE_LIMIT = 5
LOGIN_RATE_WINDOW = 60


def check_login_rate_limit(
    request: Request,
) -> None:

    client_ip = request.client.host

    key = f"rate_limit:login:{client_ip}"

    attempts = redis_client.incr(key)

    if attempts == 1:
        redis_client.expire(
            key,
            LOGIN_RATE_WINDOW,
        )

    if attempts > LOGIN_RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later.",
        )
RESUME_ANALYSIS_RATE_LIMIT = 5
RESUME_ANALYSIS_RATE_WINDOW = 600


def check_resume_analysis_rate_limit(
    user_id: int,
) -> None:

    key = f"rate_limit:resume_analysis:{user_id}"

    attempts = redis_client.incr(key)

    if attempts == 1:
        redis_client.expire(
            key,
            RESUME_ANALYSIS_RATE_WINDOW,
        )

    if attempts > RESUME_ANALYSIS_RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many resume analysis requests. Please try again later.",
        )