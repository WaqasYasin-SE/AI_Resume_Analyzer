from typing import Literal

from pydantic import BaseModel, Field


IssueCategory = Literal[
    "contact",
    "experience",
    "education",
    "skills",
    "projects",
    "grammar",
    "spelling",
    "relevance",
    "formatting",
    "content",
]

IssuePriority = Literal[
    "critical",
    "high",
    "medium",
    "low",
]


class ResumeIssue(BaseModel):
    category: IssueCategory = Field(
        description="Category of the resume issue."
    )

    priority: IssuePriority = Field(
        description="Importance of the issue."
    )

    title: str = Field(
        min_length=1,
        max_length=150,
        description="Short, specific title of the issue."
    )

    explanation: str = Field(
        min_length=1,
        max_length=500,
        description="Evidence-based explanation of the issue."
    )

    recommendation: str = Field(
        min_length=1,
        max_length=500,
        description="Specific actionable recommendation."
    )


class ResumeAnalysis(BaseModel):
    score: int = Field(
        ge=0,
        le=100,
        description="Overall resume score from 0 to 100."
    )

    summary: str = Field(
        min_length=1,
        max_length=1000,
        description="Concise professional assessment."
    )

    strengths: list[str] = Field(
        min_length=1,
        max_length=10,
        description="Strong aspects already present in the resume."
    )

    issues: list[ResumeIssue] = Field(
        min_length=1,
        max_length=30,
        description="Prioritized resume issues."
    )

    recommendations: list[str] = Field(
        min_length=1,
        max_length=10,
        description="Top actionable recommendations."
    )