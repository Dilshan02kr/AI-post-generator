from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.user_model import User

def get_user_by_id(db: Session, user_id: str) -> User | None:
    try:
        return db.query(User).filter(User.id == user_id).first()

    except SQLAlchemyError as error:
        raise AppError(
            code="DATABASE_READ_ERROR",
            message="Failed to read user data from the database.",
            status_code=500,
            details=str(error),
        )

def get_user_by_email(db: Session, email:str) -> User | None:
    
    try:
        return db.query(User).filter(User.email == email).first()
    
    except SQLAlchemyError as error:
        raise AppError(
            code="DATABASE_READ_ERROR",
            message="Failed to read user data from the database.",
            status_code=500,
            details=str(error),
        )

def create_user(
        db: Session,
        full_name: str,
        email: str,
        password_hash: str,
) -> User:
    try:
        user = User(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            auth_provider="email",
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    except IntegrityError as error:
        db.rollback()

        raise AppError(
            code="EMAIL_ALREADY_REGISTERED",
            message="An account with this email already exists.",
            status_code=409,
            details=str(error),
        )

    except SQLAlchemyError as error:
        db.rollback()

        raise AppError(
            code="DATABASE_WRITE_ERROR",
            message="Failed to create user account.",
            status_code=500,
            details=str(error),
        )