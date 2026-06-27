import json

import httpx
import trafilatura
from bs4 import BeautifulSoup

from app.core.exceptions import AppError

def extract_meta_image(html: str) -> str | None:
    soup = BeautifulSoup(html, "html.parser")

    image = soup.find("meta", property="og:image")
    if image and image.get("content"):
        return image.get("content")
    
    twitter_image = soup.find("meta", attrs={"name": "twitter:image"})
    if twitter_image and twitter_image.get("content"):
        return twitter_image.get("content")
    
    return None

def extract_meta_excerpt(html: str) -> str | None:
    soup = BeautifulSoup(html, "html.parser")

    description = soup.find("meta", attrs={"name": "description"})
    if description and description.get("content"):
        return description.get("content")

    og_description = soup.find("meta", property="og:description")
    if og_description and og_description.get("content"):
        return og_description.get("content")

    return None

def download_html(url: str) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    try:
        with httpx.Client(
            timeout=10.0,
            follow_redirects=True,
            headers=headers,
        ) as client:
            response = client.get(url)
            response.raise_for_status()

            content_type = response.headers.get("content-type", "")

            if "text/html" not in content_type and "application/xhtml+xml" not in content_type:
                raise AppError(
                    code="URL_NOT_HTML",
                    message="The provided URL does not point to an HTML webpage.",
                    status_code=400,
                )

            return response.text 
    
    except httpx.TimeoutException:
        raise AppError(
            code="URL_FETCH_TIMEOUT",
            message="The webpage took too long to respond.",
            status_code=408,
        )

    except httpx.HTTPStatusError as error:
        raise AppError(
            code="URL_FETCH_FAILED",
            message="Failed to fetch the webpage.",
            status_code=400,
            details=f"HTTP status: {error.response.status_code}",
        )
    
    except httpx.RequestError as error:
        raise AppError(
            code="URL_REQUEST_FAILED",
            message="Could not connect to the webpage.",
            status_code=400,
            details=str(error),
        )
    
def extract_article_from_url(url: str) -> dict:
    html = download_html(url)

    try:
        extracted_json = trafilatura.extract(
            html,
            output_format="json",
            with_metadata=True,
            include_comments=False,
            include_tables=False,
        )

        if not extracted_json:
            raise AppError(
                code="ARTICLE_EXTRACTION_FAILED",
                message="Could not extract readable article content from this URL.",
                status_code=422,
            )
        
        extracted_data = json.loads(extracted_json)

        title = extracted_data.get("title") or "Untitled Article"
        content = extracted_data.get("text") or ""
        author = extracted_data.get("author")
        excerpt = extracted_data.get("description") or extract_meta_excerpt(html)
        image = extract_meta_image(html)

        content = content.strip()

        if len(content) < 50:
            raise AppError(
                code="ARTICLE_CONTENT_TOO_SHORT",
                message="Extracted article content is too short to generate a useful post.",
                status_code=422,
            )
        
        return {
            "title": title.strip(),
            "content": content,
            "excerpt": excerpt,
            "author": author,
            "image": image,
            "url": url,
        }
    
    except AppError:
        raise

    except Exception as error:
        raise AppError(
            code="ARTICLE_EXTRACTION_ERROR",
            message="Unexpected error while extracting article content.",
            status_code=500,
            details=str(error),
        )