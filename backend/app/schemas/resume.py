from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.resume import ProcessingStatus


class ResumeResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    original_filename: str
    file_size: int
    processing_status: ProcessingStatus
    processing_error: str | None
    retry_count: int
    last_processed_at: datetime | None
    uploaded_at: datetime   


class ResumeDetailResponse(ResumeResponse):
    pass