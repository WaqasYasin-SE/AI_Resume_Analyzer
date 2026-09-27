import redis

from app.core.config import settings


redis_client = redis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True,
)


def get_redis():
    return redis_client


def invalidate_dashboard_cache(user_id: int) -> None:
    cache_key = f"dashboard:{user_id}"

    redis_client.delete(cache_key)