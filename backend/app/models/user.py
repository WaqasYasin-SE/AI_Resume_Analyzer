from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    resumes: Mapped[list["Resume"]] = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    jobs = relationship(
    "Job",
    back_populates="user",
    cascade="all, delete-orphan"
     )
    applications = relationship(
    "Application",
    back_populates="user",
    cascade="all, delete-orphan",
    )
    notifications: Mapped[list["Notification"]] = relationship(
    "Notification",
    back_populates="user",
    cascade="all, delete-orphan",
)
    gmail_connection: Mapped["GmailConnection | None"] = relationship(
    "GmailConnection",
    back_populates="user",
    uselist=False,
    cascade="all, delete-orphan",
)
    

    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        "RefreshToken",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    