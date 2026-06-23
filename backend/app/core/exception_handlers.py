from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

def register_exception_handlers(app):

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": {
                    "type": "VALIDATION ERROR",
                    "message": "Invalid request body.",
                    "details": exc.errors()
                }
            },
        )