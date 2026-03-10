from typing import Optional
from pydantic import BaseModel, Field

class MessageRequest(BaseModel):
    text: Optional[str] = Field("", description="The message text to analyze")
    scenario: Optional[str] = Field(None, description="Optional context or scenario the message is about")
    target_emotion: Optional[str] = Field(None, description="The desired emotion for the rewritten message")
    format: Optional[str] = Field(None, description="The desired format or tone for the rewritten message")

class EmotionResponse(BaseModel):
    emotion: str

class RewriteResponse(BaseModel):
    original_message: str
    detected_emotion: str
    rewritten_message: str
