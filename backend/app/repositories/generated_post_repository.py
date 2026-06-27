from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.generated_post_model import GeneratedPost


def create_generated_post(
    db: Session,
    user_id: str,
    article_title: str,
    article_url: str,
    generated_post: str,
    style: str,
    article_author: str | None = None,
    article_image: str | None = None,
    article_excerpt: str | None = None,
) -> GeneratedPost:
    try:
        post = GeneratedPost(
            user_id=user_id,
            article_title=article_title,
            article_url=article_url,
            article_author=article_author,
            article_image=article_image,
            article_excerpt=article_excerpt,
            generated_post=generated_post,
            style=style,
        )

        db.add(post)
        db.commit()
        db.refresh(post)

        return post

    except SQLAlchemyError as error:
        db.rollback()

        raise AppError(
            code="GENERATED_POST_SAVE_FAILED",
            message="Failed to save generated post history.",
            status_code=500,
            details=str(error),
        )


def get_generated_posts_by_user(
    db: Session,
    user_id: str,
) -> list[GeneratedPost]:
    try:
        return (
            db.query(GeneratedPost)
            .filter(GeneratedPost.user_id == user_id)
            .order_by(GeneratedPost.created_at.desc())
            .all()
        )

    except SQLAlchemyError as error:
        raise AppError(
            code="GENERATED_POST_HISTORY_READ_FAILED",
            message="Failed to load generated post history.",
            status_code=500,
            details=str(error),
        )