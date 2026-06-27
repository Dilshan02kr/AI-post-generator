from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user_model import User
from app.schemas.article_schema import ExtractUrlRequest, ExtractUrlResponse
from app.services.article_extraction_service import extract_article_from_url


router = APIRouter(
    prefix="/articles",
    tags=["Articles"],
)


@router.post("/extract-url", response_model=ExtractUrlResponse)
def extract_url_article(
    request: ExtractUrlRequest,
    current_user: User = Depends(get_current_user),
):
    article = extract_article_from_url(
        url=str(request.url),
    )

    return ExtractUrlResponse(
        success=True,
        article=article,
    )