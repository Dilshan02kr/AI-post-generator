from datetime import datetime

from pydantic import BaseModel


class GeneratedPostResponse(BaseModel):
    id: str
    article_title: str
    article_url: str
    article_author: str | None = None
    article_image: str | None = None
    article_excerpt: str | None = None
    generated_post: str
    style: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class GeneratedPostListResponse(BaseModel):
    success: bool
    posts: list[GeneratedPostResponse]

class DeleteGeneratedPostResponse(BaseModel):
    success: bool
    message: str