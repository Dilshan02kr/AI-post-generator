from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    auth_provider: str

    model_config = {
        "from_attributes": True
    }

class RegisterResponse(BaseModel):
    success: bool
    message: str
    user: UserResponse

