from dotenv import load_dotenv
from google import genai

load_dotenv() 

client = genai.Client()

def generate_post(title: str, content: str, style: str) -> str:
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
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text.strip()
