from pydantic import BaseModel, Field, HttpUrl

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

