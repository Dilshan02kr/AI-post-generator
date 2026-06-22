from pydantic import BaseModel

class GenerateRequest(BaseModel):
    title: str
    content: str
    style: str

