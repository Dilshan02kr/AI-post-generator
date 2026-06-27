from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.generate_routes import router as generate_router
from app.api.routes.auth_routes import router as auth_router
from app.api.routes.article_routes import router as article_router
from app.api.routes.history_routes import router as history_router
from app.core.exception_handlers import register_exception_handlers


app = FastAPI(
    title="AI Post Generator API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

@app.get("/")
def health_check():
    return {
        "success": True,
        "message": "AI Post Generator backend is running"
    }

app.include_router(generate_router)
app.include_router(auth_router)
app.include_router(article_router)
app.include_router(history_router)