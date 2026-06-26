from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import hash_password
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth_schema import RegisterRequest

def register_user(db: Session, request: RegisterRequest):

    full_name = request.full_name.strip()
    email = request.email.lower().strip()
    password = request.password

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
    
    try:
        password_hash = hash_password(password)

    except Exception as error:
        raise AppError(
            code="PASSWORD_HASHING_FAILED",
            message="Failed to secure the password.",
            status_code=500,
            details=str(error),
        )

    user = create_user(
        db=db,
        full_name=full_name,
        email=email,
        password_hash=password_hash,
    )

    return user