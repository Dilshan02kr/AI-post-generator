from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user_model import User
from app.schemas.history_schema import (
    DeleteGeneratedPostResponse,
    GeneratedPostListResponse,
    GeneratedPostResponse,
)
from app.services.history_service import (
    delete_generated_post_service,
    get_user_generated_posts_service,
)


router = APIRouter(
    prefix="/history",
    tags=["History"],
)


@router.get("/posts", response_model=GeneratedPostListResponse)
def get_my_generated_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    posts = get_user_generated_posts_service(
        db=db,
        current_user=current_user,
    )

    return GeneratedPostListResponse(
        success=True,
        posts=[
            GeneratedPostResponse.model_validate(post)
            for post in posts
        ],
    )


@router.delete("/posts/{post_id}", response_model=DeleteGeneratedPostResponse)
def delete_my_generated_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_generated_post_service(
        db=db,
        current_user=current_user,
        post_id=post_id,
    )

    return DeleteGeneratedPostResponse(
        success=True,
        message="Generated post deleted successfully.",
    )