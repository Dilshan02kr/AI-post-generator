from fastapi import APIRouter

from app.schemas.generate_schema import GenerateRequest, GenerateResponse
from app.services.gemini_service import generate_post

router = APIRouter(
    prefix="/generate",
    tags=["Generate"]
)

@router.post("", response_model=GenerateResponse)
def generate(request: GenerateRequest):
    post = generate_post(
        title=request.title,
        content=request.content,
        style=request.style
    )

    return GenerateResponse(
        success=True,
        post=post
    )