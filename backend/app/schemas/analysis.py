from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.resume_analysis import ResumeIssue


class ResumeAnalysisResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    resume_id: int

    score: int
    summary: str

    strengths: list[str]

    issues: list[ResumeIssue]

    recommendations: list[str]

    created_at: datetime