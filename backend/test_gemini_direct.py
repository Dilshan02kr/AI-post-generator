from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()

client = genai.Client()

try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello in one short sentence."
    )

    print("SUCCESS:")
    print(response.text)

except errors.APIError as e:
    print("GEMINI API ERROR")
    print("Code:", e.code)
    print("Message:", e.message)

except Exception as e:
    print("OTHER ERROR")
    print(type(e))
    print(e)