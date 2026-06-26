from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.exceptions import AppError
from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.user_model import User
from app.repositories.user_repository import get_user_by_id


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization:
        raise AppError(
            code="AUTHORIZATION_HEADER_MISSING",
            message="Authorization header is required.",
            status_code=401,
        )

    if not authorization.startswith("Bearer "):
        raise AppError(
            code="INVALID_AUTHORIZATION_HEADER",
            message="Authorization header must start with Bearer.",
            status_code=401,
        )

    token = authorization.replace("Bearer ", "", 1)

    payload = decode_access_token(token)

    user_id = payload.get("sub")

    if not user_id:
        raise AppError(
            code="INVALID_TOKEN_PAYLOAD",
            message="Invalid token payload.",
            status_code=401,
        )

    user = get_user_by_id(
        db=db,
        user_id=user_id,
    )

    if not user:
        raise AppError(
            code="USER_NOT_FOUND",
            message="User account no longer exists.",
            status_code=401,
        )

    return user