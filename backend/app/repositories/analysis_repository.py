from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analysis import ResumeAnalysisDB


class AnalysisRepository:
    """Database operations for resume analyses."""

    @staticmethod
    def create(
        *,
        db: Session,
        resume_id: int,
        score: int,
        summary: str,
        strengths: list[str],
        issues: list,
        recommendations: list[str],
    ) -> ResumeAnalysisDB:
        analysis = ResumeAnalysisDB(
            resume_id=resume_id,
            score=score,
            summary=summary,
            strengths=strengths,
            issues=issues,
            recommendations=recommendations,
        )

        db.add(analysis)
        db.flush()
        db.refresh(analysis)

        return analysis

    @staticmethod
    def get_by_resume_id(
        *,
        db: Session,
        resume_id: int,
    ) -> ResumeAnalysisDB | None:
        return db.scalar(
            select(ResumeAnalysisDB).where(
                ResumeAnalysisDB.resume_id == resume_id,
            )
        )

    @staticmethod
    def update(
        *,
        db: Session,
        analysis: ResumeAnalysisDB,
        score: int,
        summary: str,
        strengths: list[str],
        issues: list,
        recommendations: list[str],
    ) -> ResumeAnalysisDB:

        analysis.score = score
        analysis.summary = summary
        analysis.strengths = strengths
        analysis.issues = issues
        analysis.recommendations = recommendations

        db.add(analysis)
        db.flush()
        db.refresh(analysis)

        return analysis

    @staticmethod
    def delete_analysis(
        *,
        db: Session,
        analysis: ResumeAnalysisDB,
    ) -> None:
        db.delete(analysis)
        db.flush()