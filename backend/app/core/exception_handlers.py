import logging
import uuid

from fastapi import Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPSException

from app.core.exceptions import AppError

logger = logging.getLogger(__name__)

def build_error_response(
        code: str,
        message: str,
        details=None,
        request_id: str | None = None,
):
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "details": details,
            "request_id": request_id,
        },
    }

def register_exception_handlers(app):
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc:AppError):
        request_id = str(uuid.uuid4())

        logger.warning(
            "AppError [%s] %s %s -%s",
            request_id,
            request.method,
            request.url.path,
            exc.message,
        )

        return JSONResponse(
            status_code=exc.status_code,
            content=jsonable_encoder(
                build_error_response(
                    code=exc.code,
                    message=exc.message,
                    details=exc.details,
                    request_id=request_id
                )
            )
        )
    
    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, exc: RequestValidationError):
        request_id = str(uuid.uuid4())
        errors = exc.errors()

        first_error = errors[0] if errors else {}
        error_type = first_error.get("type")

        if error_type == "json_invalid":
            code = "INVALID_JSON"
            message = (
                "Invalid JSON format. Check double quotes, commas, and raw line breaks."
            )
        else:
            code = "VALIDATION_ERROR"
            message = "Invalid request body. Please provide valid title, content, and style."

            logger.warning(
                "ValidationError [%s] %s %s - %s",
                request_id,
                request.method,
                request.url.path,
                message,
            )

            return JSONResponse(
                status_code=422,
                content=jsonable_encoder(
                    build_error_response(
                        code=code,
                        message=message,
                        details=errors,
                        request_id=request_id,
                    )
                ),
            )
        
        @app.exception_handler(StarletteHTTPException)
        async def http_error_handler(request: Request, exc: StarletteHTTPException):
            request_id = str(uuid.uuid4())

            logger.warning(
            "HTTPException [%s] %s %s - %s",
            request_id,
            request.method,
            request.url.path,
            exc.detail,
            )

            return JSONResponse(
                status_code=exc.status_code,
                content=jsonable_encoder(
                    build_error_response(
                        code="HTTP_ERROR",
                        message=str(exc.detail),
                        request_id=request_id,
                    )
                ),
            )
        
        @app.exception_handler(Exception)
        async def unexpected_error_handler(request: Request, exc: Exception):
            request_id = str(uuid.uuid4())

            logger.exception(
                "UnexpectedError [%s] %s %s",
                request_id,
                request.method,
                request.url.path,
            )

            return JSONResponse(
                status_code=500,
                content=jsonable_encoder(
                    build_error_response(
                        code="INTERNAL_SERVER_ERROR",
                        message="Something went wrong on the server.",
                        request_id=request_id,
                    )
                ),
            )

