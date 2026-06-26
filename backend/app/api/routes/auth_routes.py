from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth_schema import RegisterRequest, RegisterResponse
from app.services.auth_service import register_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

@router.post("/register", response_model=RegisterResponse)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    user = register_user(
        db=db,
        request=request,
    )

    return RegisterResponse(
        success=True,
        message="Account created successfully",
        user=user,
    )