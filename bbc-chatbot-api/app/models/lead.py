"""Lead and scoring schemas."""

from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime


class Lead(BaseModel):
    id: str
    conversation_id: str
    name: Optional[str] = None          # +20 points
    email: Optional[str] = None         # +20 points
    phone: Optional[str] = None         # +25 points
    route: Optional[str] = None         # +10 points (e.g. "JFK → LHR")
    travel_dates: Optional[str] = None  # +10 points
    passengers: Optional[int] = None    # +5 points
    cabin_class: Optional[str] = None   # +5 points
    notes: Optional[str] = None
    score: int = 0                      # 0-100, computed
    tier: Literal["bronze", "silver", "gold"] = "bronze"
    created_at: datetime
    updated_at: datetime


def calculate_lead_score(lead: Lead) -> int:
    """Rule-based scoring: name(20) + email(20) + phone(25) + route(10)
    + dates(10) + passengers(5) + cabin(5) = max 95 from fields."""
    score = 0
    if lead.name:
        score += 20
    if lead.email:
        score += 20
    if lead.phone:
        score += 25
    if lead.route:
        score += 10
    if lead.travel_dates:
        score += 10
    if lead.passengers:
        score += 5
    if lead.cabin_class:
        score += 5
    return min(score, 100)


def get_lead_tier(score: int) -> str:
    if score >= 71:
        return "gold"
    if score >= 41:
        return "silver"
    return "bronze"


def get_missing_fields(lead: Lead) -> list[str]:
    """Return list of fields the AI should try to collect next."""
    missing: list[str] = []
    if not lead.phone:
        missing.append("phone number")
    if not lead.route:
        missing.append("route")
    if not lead.travel_dates:
        missing.append("travel dates")
    if not lead.name:
        missing.append("name")
    if not lead.email:
        missing.append("email")
    return missing
