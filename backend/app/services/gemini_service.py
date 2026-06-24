from dotenv import load_dotenv
from google import genai
from google.genai import errors

from app.core.exceptions import AppError

load_dotenv() 

client = genai.Client()

def get_status_code(error: errors.APIError) -> int:
    try:
        return int(error.code)
    except Exception:
        return 500

def map_gemini_error(error: errors.APIError) -> AppError:
    status_code = get_status_code(error)
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

def call_gemini_with_retry(model_name: str, prompt: str):
    max_attempts = 3
    retry_delay_seconds = 2

    for attempt in range(1, max_attempts + 1):
        try:
            print(f"Trying model: {model_name}, attempt: {attempt}")

            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            return response
        
        except errors.APIError as e:
            status_code = get_status_code(e)

            print(
                f"Gemini error | model={model_name} | "
                f"attempt={attempt} | status={status_code} | message={e.message}"
            )

            if status_code in [500, 503, 504] and attempt < max_attempts:
                time.sleep(retry_delay_seconds)
                continue

            raise e

def build_linkedin_prompt(title: str, content: str, style: str) -> str:
    return f"""
You are an expert LinkedIn content writer.

Create a LinkedIn post from the article below.

Style: {style}

Requirements:
- Start with a strong hook
- Around 15 sentences
- Professional tone
- Do not copy the article directly
- Summarize the key idea
- Add useful insight
- End with an engaging question

Article title:
{title}

Article content:
{content}
"""

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
            status_code=400,
        )
    
    content = content[:8000]

    prompt = build_linkedin_prompt(
        title=title,
        content=content,
        style=style,
    )

    print("TITLE LENGTH:", len(title))
    print("CONTENT LENGTH:", len(content))
    print("PROMPT LENGTH:", len(prompt))

    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
    ]

    last_error = None

    for model_name in models_to_try:
        try:
            response = call_gemini_with_retry(
                model_name=model_name,
                prompt=prompt,
            )

            if response.text:
                print(f"Gemini success with model: {model_name}")
                return response.text.strip()
            
            print(f"Empty response from model: {model_name}")

        except errors.APIError as e:
            last_error = e
            status_code = get_status_code(e)

            if status_code in [500, 503, 504]:
                print(f"Model unavailable: {model_name}. Trying fallback...")
                continue

            raise map_gemini_error(e)
        
    if last_error:
        raise map_gemini_error(e)
    
    raise AppError(
        code="EMPTY_AI_RESPONSE",
        message="Gemini returned an empty response. Please try again.",
        status_code=502,
    )