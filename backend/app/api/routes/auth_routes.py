from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth_schema import RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, MeResponse, UserResponse
from app.services.auth_service import register_user, login_user
from app.api.deps import get_current_user
from app.models.user_model import User

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

@router.post("/login", response_model=LoginResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    user, access_token = login_user(
        db=db,
        request=request,
    )

    return LoginResponse(
        success=True,
        message="Login successful.",
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )

@router.get("/me", response_model=MeResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return MeResponse(
        success=True,
        user=UserResponse.model_validate(current_user),
    )

