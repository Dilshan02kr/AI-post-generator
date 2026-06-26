from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import settings
from app.core.exceptions import AppError

password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated=["auto"],
)

def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return password_context.verify(plain_password, password_hash)

def create_access_token(
    subject: str,
    extra_data: dict[str, Any] | None = None,
) -> str:
    expire_time = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": subject,
        "exp": expire_time,
    }

    if extra_data:
        payload.update(extra_data)

    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    return token

def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise AppError(
            code="TOKEN_EXPIRED",
            message="Your session has expired. Please login again.",
            status_code=401,
        )

    except jwt.InvalidTokenError:
        raise AppError(
            code="INVALID_TOKEN",
            message="Invalid authentication token.",
            status_code=401,
        )
