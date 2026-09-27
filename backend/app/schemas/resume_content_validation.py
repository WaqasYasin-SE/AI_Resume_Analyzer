from pydantic import BaseModel, Field


class ResumeContentValidation(BaseModel):
    is_resume: bool
    confidence: float = Field(ge=0.0, le=1.0)
    document_type: str
    reason: str