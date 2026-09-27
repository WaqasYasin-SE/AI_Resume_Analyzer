from pathlib import Path

import pymupdf

from app.core.exceptions import (
    InternalServerError,
    ValidationAppError,
)


class PDFService:

    @staticmethod
    def extract_text(
        file_path: str,
    ) -> str:

        path = Path(file_path)

        if not path.exists():
            raise InternalServerError(
                "PDF file could not be found."
            )

        try:
            with path.open("rb") as file:
                header = file.read(5)

        except OSError as exc:
            raise InternalServerError(
                "Unable to read uploaded PDF."
            ) from exc

        if header != b"%PDF-":
            raise ValidationAppError(
                "Uploaded file is not a valid PDF."
            )

        try:
            with pymupdf.open(path) as pdf:

                if pdf.page_count == 0:
                    raise ValidationAppError(
                        "PDF contains no pages."
                    )

                text_parts: list[str] = []

                for page in pdf:
                    text_parts.append(
                        page.get_text()
                    )

        except ValidationAppError:
            raise

        except (
            pymupdf.FileDataError,
            OSError,
        ) as exc:
            raise ValidationAppError(
                "The uploaded file is not a valid or readable PDF."
            ) from exc

        except Exception as exc:
            raise InternalServerError(
                "Unable to process the PDF."
            ) from exc

        text = "\n".join(
            text_parts
        ).strip()

        if not text:
            raise ValidationAppError(
                "No readable text found in PDF."
            )

        return text