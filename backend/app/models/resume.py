from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class ProcessingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    original_filename = Column(
        String(255),
        nullable=False,
    )

    stored_filename = Column(
        String(255),
        unique=True,
        nullable=False,
    )

    file_path = Column(
        String(500),
        nullable=False,
    )

    file_size = Column(
        Integer,
        nullable=False,
    )

    extracted_text = Column(
        Text,
        nullable=False,
    )

    processing_status = Column(
        String(20),
        nullable=False,
        default=ProcessingStatus.PENDING.value,
    )

    processing_error = Column(
        Text,
        nullable=True,
    )

    retry_count = Column(
        Integer,
        nullable=False,
        default=0,
    )

    last_processed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default="now()",
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # User relationship
    user = relationship(
        "User",
        back_populates="resumes",
    )

    # Analysis relationship
    analysis = relationship(
        "ResumeAnalysisDB",
        back_populates="resume",
        uselist=False,
        cascade="all, delete-orphan",
    )