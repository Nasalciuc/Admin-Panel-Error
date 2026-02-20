"""Knowledge base schemas."""

from pydantic import BaseModel
from typing import Literal
from datetime import datetime


class KBEntry(BaseModel):
    id: str
    category: Literal["routes", "services", "booking", "policies", "faq"]
    title: str
    content: str       # max ~500 chars per entry
    created_at: datetime
    updated_at: datetime


class KBResult(BaseModel):
    """Returned by kb_search."""
    entry_id: str
    title: str
    content: str
    score: float = 0.0     # similarity score (0-1) or keyword relevance
    source: Literal["qdrant", "pgvector", "keyword"]
