from sqlalchemy.orm import Session

from app.models.user_model import User

def get_user_by_email(db: Session, email:str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def create_user(
        db: Session,
        full_name: str,
        email: str,
        password_hash: str,
) -> User:
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