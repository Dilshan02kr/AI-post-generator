from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class GeneratedPost(Base):
    __tablename__ = "generated_posts"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    user_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    article_title: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    article_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    article_author: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    article_image: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    article_excerpt: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    generated_post: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    style: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )