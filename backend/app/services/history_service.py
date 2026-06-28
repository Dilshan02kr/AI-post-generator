from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.models.generated_post_model import GeneratedPost
from app.models.user_model import User
from app.repositories.generated_post_repository import (
    delete_generated_post,
    get_generated_post_by_id,
    get_generated_posts_by_user,
)


def get_user_generated_posts_service(
    db: Session,
    current_user: User,
) -> list[GeneratedPost]:
    return get_generated_posts_by_user(
        db=db,
        user_id=current_user.id,
    )


def delete_generated_post_service(
    db: Session,
    current_user: User,
    post_id: str,
) -> None:
    post = get_generated_post_by_id(
        db=db,
        post_id=post_id,
    )

    if not post:
        raise AppError(
            code="GENERATED_POST_NOT_FOUND",
            message="Generated post not found.",
            status_code=404,
        )

    if post.user_id != current_user.id:
        raise AppError(
            code="GENERATED_POST_ACCESS_DENIED",
            message="You do not have permission to delete this generated post.",
            status_code=403,
        )

    delete_generated_post(
        db=db,
        post=post,
    )