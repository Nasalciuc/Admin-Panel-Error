"""Pydantic models for Knowledge Base."""
from typing import Optional
from pydantic import BaseModel


class KBResult(BaseModel):
    entry_id: str
    title: str
    content: str
    score: float = 1.0
    source: str = "keyword"  # "keyword" | "vector" | "fallback"
