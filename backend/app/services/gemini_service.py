from dotenv import load_dotenv
from google import genai
from google.genai import errors

from app.core.exceptions import AppError

load_dotenv() 

client = genai.Client()

def map_gemini_error(error: error.APIError) -> AppError:
    status_code = int(error.code) if error.code else 500
    gemini_message = error.message

    if status_code == 400:
        return AppError(
            code="GEMINI_BAD_REQUEST",
            message="Gemini could not process the request.",
            status_code=400,
            details=gemini_message,
        )
    
    if status_code == 403:
        return AppError(
            code="GEMINI_PERMISSION_DENIED",
            message="Gemini permission denied. Check your API key or project access.",
            status_code=403,
            details=gemini_message,
        )
    
    if status_code == 404:
        return AppError(
            code="GEMINI_MODEL_NOT_FOUND",
            message="Gemini model not found. Check the model name.",
            status_code=404,
            details=gemini_message,
        )

    if status_code == 429:
        return AppError(
            code="GEMINI_QUOTA_EXCEEDED",
            message="Gemini quota exceeded. Please wait and try again.",
            status_code=429,
            details=gemini_message,
        )
    
    if status_code in [500, 503, 504]:
        return AppError(
            code="GEMINI_SERVICE_UNAVAILABLE",
            message="Gemini service is temporarily unavailable. Please try again later.",
            status_code=503,
            details=gemini_message,
        )
    
    return AppError(
        code="GEMINI_API_ERROR",
        message="Gemini returned an unexpected error.",
        status_code=502,
        details=gemini_message,
    )


def generate_post(title: str, content: str, style: str) -> str:

    if not title.strip():
        raise AppError(
            code="TITLE_REQUIRED",
            message="Article title is required.",
            status_code=400,
        )
    
    if not content.strip():
        raise AppError(
            code="CONTENT_REQUIRED",
            message="Article Content is required.",
        )

    prompt = f"""
Create a LinkedIn post from this article.

Style: {style}

Requirements:
- Hook first line
- Around 15 sentences
- Professional tone
- End with an engaging question

Title:
{title}

Content:
{content}
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response.text:
            raise AppError(
                code="EMPTY_AI_RESPONSE",
                message="Gemini returned an empty response. Please try again.",
                status_code=502,
            )
        
        return response.text.strip()
    
    except errors.APIError as e:
        raise map_gemini_error(e)
