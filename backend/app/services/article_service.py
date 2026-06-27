from sqlalchemy.orm import Session

from app.models.user_model import User
from app.repositories.generated_post_repository import create_generated_post
from app.services.article_extraction_service import extract_article_from_url
from app.services.gemini_service import generate_post


def extract_article_service(url: str) -> dict:
    article = extract_article_from_url(url=url)

    return article


def generate_post_from_url_service(
    db: Session,
    current_user: User,
    url: str,
    style: str,
) -> dict:
    article = extract_article_from_url(
        url=url,
    )

    generated_post = generate_post(
        title=article["title"],
        content=article["content"],
        style=style,
    )

    saved_post = create_generated_post(
        db=db,
        user_id=current_user.id,
        article_title=article["title"],
        article_url=article["url"],
        article_author=article.get("author"),
        article_image=article.get("image"),
        article_excerpt=article.get("excerpt"),
        generated_post=generated_post,
        style=style,
    )

    return {
        "article": article,
        "post": generated_post,
        "history_id": saved_post.id,
    }