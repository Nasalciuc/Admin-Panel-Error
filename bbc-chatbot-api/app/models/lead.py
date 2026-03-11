"""Lead schemas — aligned with DB schema V10 leads table.
Single source of truth for lead scoring: lead_service.py._calculate_score()
"""

from typing import Optional


def get_lead_tier(score: int) -> str:
    """Convert numeric score to tier label."""
    if score >= 80:
        return "gold"
    if score >= 50:
        return "silver"
    return "bronze"


def get_missing_fields(lead_dict: dict, conv_dict: Optional[dict] = None) -> list[str]:
    """Return list of fields the AI should try to collect next.
    Works with raw dicts from Supabase — NOT Pydantic models.
    """
    conv = conv_dict or {}
    missing: list[str] = []

    has_phone = bool(
        lead_dict.get("visitor_phone") or conv.get("visitor_phone")
    )
    has_route = bool(
        lead_dict.get("origin_code") and lead_dict.get("destination_code")
    )
    has_dates = bool(lead_dict.get("departure_date"))
    has_name = bool(
        lead_dict.get("visitor_name") or conv.get("visitor_name")
    )
    has_email = bool(
        lead_dict.get("visitor_email") or conv.get("visitor_email")
    )

    # Priority order: phone (highest value) → route → dates → name → email
    if not has_phone:
        missing.append("phone number")
    if not has_route:
        missing.append("route")
    if not has_dates:
        missing.append("travel dates")
    if not has_name:
        missing.append("name")
    if not has_email:
        missing.append("email")

    return missing
