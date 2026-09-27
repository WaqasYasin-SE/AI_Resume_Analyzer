from pydantic import BaseModel


class DashboardResponse(BaseModel):
    # Resume overview
    resume_score: float | None
    total_resumes: int

    # Job overview
    total_jobs: int

    # Application overview
    total_applications: int
    applied: int
    screening: int
    interviews: int
    offers: int
    rejected: int