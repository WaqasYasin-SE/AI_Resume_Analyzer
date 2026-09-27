
import logging

from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import settings
from app.core.exceptions import (
    AIServiceError,
    InternalServerError,
    ValidationAppError,
)
from app.schemas.llm_resume_analysis import LLMResumeAnalysis
from app.schemas.resume_analysis import ResumeAnalysis
from app.schemas.resume_content_validation import (
    ResumeContentValidation,
)


logger = logging.getLogger(__name__)


class LLMService:
    """
    Handles Gemini-powered resume operations.

    Responsibilities:

    1. Validate whether extracted document text
       actually represents a resume.

    2. Analyze valid resume content.

    Flow:

        Document text
            ↓
        validate_resume_content()
            ↓
        ResumeContentValidation
            ↓
        analyze_resume()
            ↓
        LLMResumeAnalysis
            ↓
        ResumeAnalysis
    """

    def __init__(self) -> None:
        if not settings.GEMINI_API_KEY:
            raise InternalServerError(
                "Gemini API is not configured."
            )

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        self.model = settings.GEMINI_MODEL

    def validate_resume_content(
        self,
        document_text: str,
    ) -> ResumeContentValidation:
        """
        Determine whether extracted document text
        actually represents a resume.

        This is a classification step performed
        before full resume analysis.
        """

        # -----------------------------------------
        # Validate input
        # -----------------------------------------

        if not document_text or not document_text.strip():
            raise ValidationAppError(
                "Document text cannot be empty."
            )

        document_text = document_text.strip()

        logger.info(
            "Starting resume content validation using model=%s",
            self.model,
        )

        # -----------------------------------------
        # System prompt
        # -----------------------------------------

        system_prompt = """
You are a professional document classifier.

Your task is to determine whether the provided
document is actually a professional resume or CV.

Return TRUE only when the document contains
clear evidence that it represents a person's
professional or academic resume/CV.

A resume commonly contains several of these:

- Professional summary
- Career objective
- Work experience
- Employment history
- Internships
- Education
- Degrees
- Skills
- Technical skills
- Projects
- Certifications
- Achievements
- Professional experience
- Contact information

Do NOT classify a document as a resume merely
because it contains words such as "experience",
"education", or "skills".

Consider the overall structure and purpose
of the document.

Examples of documents that are NOT resumes:

- Invoices
- Receipts
- Bills
- Purchase orders
- Bank statements
- Academic assignments
- Research papers
- Essays
- Articles
- Books
- User manuals
- Certificates by themselves
- Cover letters by themselves
- Random text documents
- Business reports

For non-resume documents, identify the most
appropriate document type when possible.

Examples:

invoice
receipt
assignment
research_paper
report
certificate
cover_letter
article
other

IMPORTANT RULES:

- Use only information contained in the document.
- Do not invent information.
- Do not classify based on filename.
- Do not classify based only on one keyword.
- Consider the complete document structure.
- Be conservative when uncertain.
- Confidence must be between 0 and 1.
- Keep the reason concise.
"""

        # -----------------------------------------
        # User prompt
        # -----------------------------------------

        user_prompt = f"""
Determine whether the following document is
actually a resume or CV.

DOCUMENT START
==============

{document_text}

DOCUMENT END
==============

Return the classification according to the
provided schema.
"""

        # -----------------------------------------
        # Gemini request
        # -----------------------------------------

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    response_json_schema=(
                        ResumeContentValidation.model_json_schema()
                    ),
                ),
            )

        except Exception as exc:
            logger.exception(
                "Gemini resume content validation failed: %s",
                exc,
            )

            raise AIServiceError(
                "Unable to validate the uploaded document."
            ) from exc

        # -----------------------------------------
        # Validate response exists
        # -----------------------------------------

        if not response.text:
            logger.error(
                "Gemini returned an empty validation response."
            )

            raise AIServiceError(
                "AI returned an empty document validation."
            )

        # -----------------------------------------
        # Parse Gemini JSON
        # -----------------------------------------

        try:
            validation = (
                ResumeContentValidation.model_validate_json(
                    response.text
                )
            )

        except ValidationError as exc:
            logger.exception(
                "Gemini returned invalid document validation data."
            )

            raise AIServiceError(
                "AI returned invalid document validation data."
            ) from exc

        # -----------------------------------------
        # Success
        # -----------------------------------------

        logger.info(
            "Resume content validation completed: "
            "is_resume=%s confidence=%.2f document_type=%s",
            validation.is_resume,
            validation.confidence,
            validation.document_type,
        )

        return validation

    def analyze_resume(
        self,
        resume_text: str,
    ) -> ResumeAnalysis:
        """
        Analyze resume text with Gemini and return
        a strictly validated ResumeAnalysis object.
        """

        # -----------------------------------------
        # Validate input
        # -----------------------------------------

        if not resume_text or not resume_text.strip():
            raise ValidationAppError(
                "Resume text cannot be empty."
            )

        resume_text = resume_text.strip()

        logger.info(
            "Starting resume analysis using model=%s",
            self.model,
        )

        # -----------------------------------------
        # System prompt
        # -----------------------------------------

        system_prompt = """
You are a professional resume auditor and career advisor.

Analyze the resume objectively and professionally.

Use ONLY information explicitly supported by the
provided resume.

Do not invent experience, skills, education,
achievements, technologies, companies, dates,
or personal information.

Your job is to identify:

- strengths
- weaknesses
- missing information
- important resume issues
- practical improvements

Evaluate these areas:

1. CONTACT INFORMATION
- Name
- Professional email
- Phone
- LinkedIn
- GitHub when relevant
- Obvious contact mistakes

2. EXPERIENCE
- Work experience
- Internships
- Responsibilities
- Achievements
- Quantifiable results
- Career relevance
- Weak descriptions

3. EDUCATION
- Degree
- Institution
- Dates
- Relevant academic information
- Missing or unclear information

4. SKILLS
- Technical skills
- Soft skills
- Career relevance
- Organization
- Presentation

5. PROJECTS
- Project descriptions
- Technologies
- Problems solved
- Results
- Missing important details

6. WRITING QUALITY
- Grammar
- Spelling
- Sentence structure
- Professional wording
- Repetition
- Clarity

7. RELEVANCE
- Irrelevant information
- Unnecessary information
- Repeated information
- Information that does not support the candidate's
  professional profile

8. FORMATTING AND STRUCTURE
- Organization
- Section completeness
- Consistency
- Readability
- Professional presentation

SCORING:

Return a score from 0 to 100.

90-100:
Excellent resume with only minor improvements needed.

80-89:
Strong resume with some improvements needed.

70-79:
Good resume with several areas needing improvement.

60-69:
Average resume with noticeable weaknesses.

40-59:
Weak resume requiring significant improvement.

0-39:
Very weak resume with major problems.

ISSUE PRIORITIES:

critical:
A problem that can seriously prevent the candidate
from being contacted or considered.

high:
A problem that significantly reduces resume effectiveness.

medium:
A meaningful improvement that is not immediately critical.

low:
A minor improvement.

IMPORTANT RULES:

- Do not invent information.
- Only report issues supported by the resume.
- Do not assume something is missing if it is simply
  presented differently.
- Do not duplicate issues.
- Do not criticize appropriate information.
- Keep explanations concise.
- Make recommendations practical and actionable.
- Prioritize important issues.
- Strengths must be based on actual resume content.
- Do not create artificial issues.
- Do not report an issue when there is no evidence.
"""

        # -----------------------------------------
        # User prompt
        # -----------------------------------------

        user_prompt = f"""
Analyze the following resume.

Provide a professional resume audit containing:

- Overall score
- Professional summary
- Strengths
- Prioritized issues
- Actionable recommendations

RESUME START
============

{resume_text}

RESUME END
============
"""

        # -----------------------------------------
        # Gemini request
        # -----------------------------------------

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    response_mime_type="application/json",
                    response_json_schema=(
                        LLMResumeAnalysis.model_json_schema()
                    ),
                ),
            )

        except Exception as exc:
            logger.exception(
                "Gemini API request failed: %s",
                exc,
            )

            raise AIServiceError(
                "Unable to analyze the resume at this time."
            ) from exc

        # -----------------------------------------
        # Validate response exists
        # -----------------------------------------

        if not response.text:
            logger.error(
                "Gemini returned an empty response."
            )

            raise AIServiceError(
                "AI returned an empty analysis."
            )

        # -----------------------------------------
        # Parse Gemini JSON
        # -----------------------------------------

        try:
            llm_analysis = (
                LLMResumeAnalysis.model_validate_json(
                    response.text
                )
            )

        except ValidationError as exc:
            logger.exception(
                "Gemini returned invalid structured data."
            )

            raise AIServiceError(
                "AI returned an invalid resume analysis."
            ) from exc

        # -----------------------------------------
        # Strict application validation
        # -----------------------------------------

        try:
            analysis = ResumeAnalysis.model_validate(
                llm_analysis.model_dump()
            )

        except ValidationError as exc:
            logger.exception(
                "Resume analysis failed application validation."
            )

            raise AIServiceError(
                "AI analysis failed application validation."
            ) from exc

        # -----------------------------------------
        # Success
        # -----------------------------------------

        logger.info(
            "Resume analysis completed successfully."
        )

        return analysis

