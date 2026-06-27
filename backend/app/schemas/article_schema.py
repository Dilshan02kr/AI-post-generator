from pydantic import BaseModel, Field, HttpUrl

from app.schemas.generate_schema import PostStyle

class ExtractUrlRequest(BaseModel):
    url: HttpUrl

class ExtractedArticle(BaseModel):
    title: str
    content: str = Field(..., min_length=1)
    excerpt: str | None = None
    author: str | None = None
    image: str | None = None
    url: str

class ExtractUrlResponse(BaseModel):
    success: bool
    article: ExtractedArticle

class GenerateFromUrlRequest(BaseModel):
    url: HttpUrl
    style: PostStyle = "professional"


class GenerateFromUrlResponse(BaseModel):
    success: bool
    article: ExtractedArticle
    post: str

    