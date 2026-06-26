from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import hash_password, create_access_token, verify_password
from app.repositories.user_repository import create_user, get_user_by_email
from app.schemas.auth_schema import RegisterRequest, LoginRequest

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

def login_user(db: Session, request: LoginRequest):
    email = request.email.lower().strip()
    password = request.password

    user = get_user_by_email(
        db=db,
        email=email,
    )

    if not user or not user.password_hash:
        raise AppError(
            code="INVALID_LOGIN_CREDENTIALS",
            message="Invalid email or password.",
            status_code=401,
        )

    is_password_valid = verify_password(
        plain_password=password,
        password_hash=user.password_hash,
    )

    if not is_password_valid:
        raise AppError(
            code="INVALID_LOGIN_CREDENTIALS",
            message="Invalid email or password.",
            status_code=401,
        )

    access_token = create_access_token(
        subject=user.id,
        extra_data={
            "email": user.email,
        },
    )

    return user, access_token

