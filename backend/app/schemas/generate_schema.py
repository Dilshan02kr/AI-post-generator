from pydantic import BaseModel, Field
from typing import Literal

class GenerateRequest(BaseModel):
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)
    style: Literal["professional", "storytelling", "viral", "technical"]

class GenerateResponse(BaseModel):
    success: bool
    post: str