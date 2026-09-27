from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    job_id: int = Field(gt=0)
    status: ApplicationStatus = ApplicationStatus.APPLIED
    applied_at: datetime | None = None
    notes: str | None = Field(
        default=None,
        max_length=5000,
    )


class ApplicationUpdate(BaseModel):
    status: ApplicationStatus | None = None
    applied_at: datetime | None = None
    notes: str | None = Field(
        default=None,
        max_length=5000,
    )


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    status: ApplicationStatus
    applied_at: datetime | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)