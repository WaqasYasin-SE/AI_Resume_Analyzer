from upstash_redis import Redis


redis_client = Redis.from_env()


def get_redis():
    return redis_client


def invalidate_dashboard_cache(user_id: int) -> None:
    cache_key = f"dashboard:{user_id}"

    redis_client.delete(cache_key)