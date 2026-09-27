from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.csrf import validate_csrf_token
from app.dependencies import get_db
from app.models.user import User
from app.schemas.analysis import ResumeAnalysisResponse
from app.schemas.resume import (
    ResumeDetailResponse,
    ResumeResponse,
)
from app.services.resume_service import ResumeService


router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"],
)


DBSession = Annotated[
    Session,
    Depends(get_db),
]

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


@router.post(
    "/upload",
    response_model=ResumeResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_resume(
    db: DBSession,
    current_user: CurrentUser,
    file: UploadFile = File(...),
    _: None = Depends(validate_csrf_token),
) -> ResumeResponse:
    return ResumeService.upload_resume(
        db=db,
        file=file,
        user_id=current_user.id,
    )


@router.get(
    "",
    response_model=list[ResumeResponse],
)
def get_resumes(
    db: DBSession,
    current_user: CurrentUser,
) -> list[ResumeResponse]:
    return ResumeService.get_user_resumes(
        db=db,
        user_id=current_user.id,
    )


@router.get(
    "/{resume_id}",
    response_model=ResumeDetailResponse,
)
def get_resume(
    resume_id: int,
    db: DBSession,
    current_user: CurrentUser,
) -> ResumeDetailResponse:
    return ResumeService.get_resume(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id,
    )


@router.get(
    "/{resume_id}/analysis",
    response_model=ResumeAnalysisResponse,
)
def get_resume_analysis(
    resume_id: int,
    db: DBSession,
    current_user: CurrentUser,
) -> ResumeAnalysisResponse:
    return ResumeService.get_resume_analysis(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id,
    )


@router.post(
    "/{resume_id}/retry",
    response_model=ResumeDetailResponse,
    status_code=status.HTTP_200_OK,
)
def retry_resume_analysis(
    resume_id: int,
    db: DBSession,
    current_user: CurrentUser,
    _: None = Depends(validate_csrf_token),
) -> ResumeDetailResponse:

    resume = ResumeService.get_resume(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id,
    )

    return ResumeService.retry_resume(
        db=db,
        resume=resume,
        user_id=current_user.id,
    )


@router.delete(
    "/{resume_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_resume(
    resume_id: int,
    db: DBSession,
    current_user: CurrentUser,
    _: None = Depends(validate_csrf_token),
) -> None:

    ResumeService.delete_resume(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id,
    )

    return None