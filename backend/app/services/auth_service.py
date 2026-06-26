from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import hash_password
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth_schema import RegisterRequest

def register_user(db: Session, request: RegisterRequest):
    existing_user = get_user_by_email(
        db=db,
        email=request.email,
    )

    if existing_user:
        raise AppError(
            code="EMAIL_ALREADY_REGISTERED",
            message="An account with this email already exists.",
            status_code=409,
        )
    
    hash_password = hash_password(request.password)

    user = create_user(
        db=db,
        full_name=request.full_name,
        email=request.email,
        password_hash=hash_password,
    )

    return user