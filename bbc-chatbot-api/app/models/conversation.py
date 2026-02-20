"""Conversation and Message schemas."""

from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class Message(BaseModel):
    id: str
    conversation_id: str
    role: Literal["user", "ai", "agent"]
    content: str
    model_used: Optional[str] = None
    cost: float = 0.0
    created_at: datetime


class Conversation(BaseModel):
    id: str
    tunnel: Literal["sales", "support"]
    mode: Literal["waiting_for_agent", "ai", "human"]
    status: Literal["active", "closed"]
    visitor_name: Optional[str] = None
    visitor_email: Optional[str] = None
    message_count: int = 0
    ai_cost_total: float = 0.0
    created_at: datetime
    updated_at: datetime
