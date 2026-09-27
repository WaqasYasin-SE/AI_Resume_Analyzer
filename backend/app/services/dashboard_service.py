import json

from sqlalchemy.orm import Session

from app.core.redis import redis_client
from app.models.application import ApplicationStatus
from app.repositories import dashboard_repository
from app.schemas.dashboard import DashboardResponse


CACHE_TTL = 60


def get_dashboard(
    db: Session,
    user_id: int,
) -> DashboardResponse:

    # -----------------------------------------
    # 1. Check Redis cache
    # -----------------------------------------

    cache_key = f"dashboard:{user_id}"

    try:
        cached_dashboard = redis_client.get(cache_key)

        if cached_dashboard:
            try:
                return DashboardResponse(
                    **json.loads(cached_dashboard)
                )
            except (json.JSONDecodeError, TypeError, ValueError):
                # Ignore invalid/stale cache data.
                # Fresh data will be loaded from PostgreSQL.
                redis_client.delete(cache_key)

    except Exception:
        # Redis is only a performance layer.
        # If Redis is unavailable, continue with PostgreSQL.
        pass

    # -----------------------------------------
    # 2. Cache MISS
    # Get fresh data from PostgreSQL
    # -----------------------------------------

    total_resumes = dashboard_repository.get_total_resumes(
        db=db,
        user_id=user_id,
    )

    resume_score = dashboard_repository.get_resume_score(
        db=db,
        user_id=user_id,
    )

    total_jobs = dashboard_repository.get_total_jobs(
        db=db,
        user_id=user_id,
    )

    total_applications = (
        dashboard_repository.get_total_applications(
            db=db,
            user_id=user_id,
        )
    )

    applied = dashboard_repository.get_application_count_by_status(
        db=db,
        user_id=user_id,
        status=ApplicationStatus.APPLIED,
    )

    screening = dashboard_repository.get_application_count_by_status(
        db=db,
        user_id=user_id,
        status=ApplicationStatus.SCREENING,
    )

    interviews = dashboard_repository.get_application_count_by_status(
        db=db,
        user_id=user_id,
        status=ApplicationStatus.INTERVIEW,
    )

    offers = dashboard_repository.get_application_count_by_status(
        db=db,
        user_id=user_id,
        status=ApplicationStatus.OFFER,
    )

    rejected = dashboard_repository.get_application_count_by_status(
        db=db,
        user_id=user_id,
        status=ApplicationStatus.REJECTED,
    )

    # ----------------------------------------- 
    # 3. Create dashboard response
    # -----------------------------------------

    dashboard = DashboardResponse(
        resume_score=resume_score,
        total_resumes=total_resumes,
        total_jobs=total_jobs,
        total_applications=total_applications,
        applied=applied,
        screening=screening,
        interviews=interviews,
        offers=offers,
        rejected=rejected,
    )

    # -----------------------------------------
    # 4. Store dashboard in Redis
    # -----------------------------------------

    try:
        redis_client.setex(
            cache_key,
            CACHE_TTL,
            json.dumps(
                dashboard.model_dump()
            ),
        )
    except Exception:
        # Redis failure should never break the dashboard.
        pass

    return dashboard