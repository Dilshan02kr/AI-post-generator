from fastapi import FastAPI
from models.request_models import GenerateRequest
from services.gemini_service import generate_post

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Hello from AI Post Generator Backend"
    }

@app.post("/generate")
def generate(request: GenerateRequest):
    
    post = generate_post(
        title=request.title,
        content=request.content,
        style=request.style
    )

    return {
        "post": post
    }