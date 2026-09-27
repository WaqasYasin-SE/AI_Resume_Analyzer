from sqlalchemy.orm import Session

from app.models.analysis import ResumeAnalysisDB
from app.repositories.analysis_repository import AnalysisRepository
from app.schemas.resume_analysis import ResumeAnalysis


class AnalysisService:

    @staticmethod
    def save_analysis(
        *,
        db: Session,
        resume_id: int,
        analysis: ResumeAnalysis,
    ) -> ResumeAnalysisDB:
        """
        Convert validated AI analysis into a database record.
        """

        analysis_record = ResumeAnalysisDB(
            resume_id=resume_id,
            score=analysis.score,
            summary=analysis.summary,
            strengths=list(analysis.strengths),
            issues=[
                issue.model_dump()
                for issue in analysis.issues
            ],
            recommendations=list(
                analysis.recommendations
            ),
        )

        return AnalysisRepository.create_analysis(
            db=db,
            analysis=analysis_record,
        )