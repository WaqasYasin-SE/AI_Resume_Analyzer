from fastapi import APIRouter

from app.core.redis import redis_client


router = APIRouter(
    prefix="/redis",
    tags=["Redis"],
)


@router.get("/test")
def test_redis():
    redis_client.set(
        "resume_analyzer_test",
        "Redis is connected",
    )

    value = redis_client.get(
        "resume_analyzer_test"
    )

    return {
        "redis": value
    }