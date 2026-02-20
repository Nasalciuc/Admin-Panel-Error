"""Request/response schemas for the chat API endpoint."""

from pydantic import BaseModel, Field
from typing import Optional, Literal


class VisitorInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None  # None = create new conversation
    message: str = Field(..., max_length=2000)
    tunnel: Literal["sales", "support"]
    visitor: VisitorInfo = VisitorInfo()
    metadata: Optional[dict] = None  # quick_reply_intent, page_url, etc.


class RouteCard(BaseModel):
    origin: str          # "JFK"
    destination: str     # "LHR"
    airlines: str        # "BA, VS, DL"
    duration: str        # "7h 20m"
    price_range: str     # "$2,800 - $4,500"


class ChatResponse(BaseModel):
    conversation_id: str
    message: str
    type: Literal["ai", "template", "agent_assigned", "template_fallback"]
    model_used: Optional[str] = None      # "haiku", "sonnet", "template"
    cost: float = 0.0
    route_card: Optional[RouteCard] = None
    agent_name: Optional[str] = None
