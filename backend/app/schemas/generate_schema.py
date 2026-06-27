from pydantic import BaseModel, Field
from typing import Literal


PostStyle = Literal["professional", "storytelling", "viral", "technical"]

class GenerateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=1000)
    content: str = Field(..., min_length=1, max_length=20000)
    style: Literal["professional", "storytelling", "viral", "technical"]

class GenerateResponse(BaseModel):
    success: bool
    post: str