from datetime import datetime

from pydantic import BaseModel, ConfigDict


class JobCreate(BaseModel):
    company_name: str
    job_title: str
    description: str | None = None
    job_url: str | None = None
    location: str | None = None
    salary: str | None = None


class JobUpdate(BaseModel):
    company_name: str | None = None
    job_title: str | None = None
    description: str | None = None
    job_url: str | None = None
    location: str | None = None
    salary: str | None = None
    status: str | None = None


class JobResponse(BaseModel):
    id: int
    company_name: str
    job_title: str
    description: str | None
    job_url: str | None
    location: str | None
    salary: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)