from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user_model import User
from app.schemas.article_schema import (
    ExtractUrlRequest,
    ExtractUrlResponse,
    GenerateFromUrlRequest,
    GenerateFromUrlResponse,
)
from app.services.article_service import (
    extract_article_service,
    generate_post_from_url_service,
)


router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


@router.post("/extract-url", response_model=ExtractUrlResponse)
def extract_url_article(
    request: ExtractUrlRequest,
    current_user: User = Depends(get_current_user),
):
    article = extract_article_service(
        url=str(request.url),
    )

    return ExtractUrlResponse(
        success=True,
        article=article,
    )


@router.post("/generate-from-url", response_model=GenerateFromUrlResponse)
def generate_post_from_url(
    request: GenerateFromUrlRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = generate_post_from_url_service(
        db=db,
        current_user=current_user,
        url=str(request.url),
        style=request.style,
    )

    return GenerateFromUrlResponse(
        success=True,
        article=result["article"],
        post=result["post"],
        history_id=result["history_id"],
    )