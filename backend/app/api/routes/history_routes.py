from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user_model import User
from app.repositories.generated_post_repository import get_generated_posts_by_user
from app.schemas.history_schema import GeneratedPostListResponse, GeneratedPostResponse


router = APIRouter(
    prefix="/history",
    tags=["History"],
)


@router.get("/posts", response_model=GeneratedPostListResponse)
def get_my_generated_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    posts = get_generated_posts_by_user(
        db=db,
        user_id=current_user.id,
    )

    return GeneratedPostListResponse(
        success=True,
        posts=[
            GeneratedPostResponse.model_validate(post)
            for post in posts
        ],
    )