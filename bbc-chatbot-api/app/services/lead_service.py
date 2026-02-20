"""Lead management — scoring, update, CRM sync readiness."""

import logging

from app.db import supabase as db
from app.models.lead import Lead, calculate_lead_score, get_lead_tier

logger = logging.getLogger(__name__)


async def get_or_create_lead(conversation_id: str) -> Lead | None:
    """Fetch existing lead for conversation, or create a new one."""
    row = await db.get_lead_by_conversation(conversation_id)
    if row:
        return Lead(**row)

    row = await db.create_lead(conversation_id)
    if not row:
        return None
    return Lead(**row)


async def update_lead_from_entities(
    conversation_id: str, entities: dict
) -> Lead | None:
    """Merge extracted entities into lead, recalculate score and tier."""
    lead = await get_or_create_lead(conversation_id)
    if not lead:
        return None

    # Merge only non-empty values
    update_fields: dict = {}
    for field in ["name", "email", "phone", "route", "travel_dates", "cabin_class", "notes"]:
        value = entities.get(field)
        if value:
            update_fields[field] = value

    if "passengers" in entities and entities["passengers"]:
        try:
            update_fields["passengers"] = int(entities["passengers"])
        except (ValueError, TypeError):
            pass

    if not update_fields:
        return lead

    # Apply updates, recalculate score
    updated_row = await db.update_lead(lead.id, **update_fields)
    if not updated_row:
        return lead

    updated_lead = Lead(**updated_row)
    new_score = calculate_lead_score(updated_lead)
    new_tier = get_lead_tier(new_score)

    if new_score != updated_lead.score or new_tier != updated_lead.tier:
        await db.update_lead(lead.id, score=new_score, tier=new_tier)
        updated_lead.score = new_score
        updated_lead.tier = new_tier  # type: ignore[assignment]

    return updated_lead


def should_sync_to_crm(lead: Lead) -> bool:
    """Return True if lead is gold tier (score >= 71)."""
    return lead.score >= 71
