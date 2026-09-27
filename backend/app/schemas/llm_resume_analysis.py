from typing import Literal

from pydantic import BaseModel


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


class LLMResumeIssue(BaseModel):
    category: IssueCategory
    priority: IssuePriority
    title: str
    explanation: str
    recommendation: str


class LLMResumeAnalysis(BaseModel):
    score: int
    summary: str
    strengths: list[str]
    issues: list[LLMResumeIssue]
    recommendations: list[str]