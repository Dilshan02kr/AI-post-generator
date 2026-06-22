from fastapi import FastAPI
from models.request_models import GenerateRequest

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Hello from AI Post Generator Backend"
    }

@app.post("/generate")
def generate(request: GenerateRequest):
    print(request.title)
    print(request.content)
    print(request.style)

    return {
        "post": "This is a generated post based on the provided title, content, and style."
    }