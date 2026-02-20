"""Conversation lifecycle — create, update, close."""

import logging

from app.db import supabase as db
from app.models.chat import VisitorInfo
from app.models.conversation import Conversation

logger = logging.getLogger(__name__)


async def get_or_create_conversation(
    conversation_id: str | None,
    tunnel: str,
    visitor: VisitorInfo,
) -> Conversation | None:
    """Fetch existing conversation or create a new one."""
    if conversation_id:
        row = await db.get_conversation(conversation_id)
        if row:
            return Conversation(**row)
        logger.warning(f"Conversation {conversation_id} not found, creating new")

    row = await db.create_conversation(
        tunnel=tunnel,
        visitor_name=visitor.name,
        visitor_email=visitor.email,
    )
    if not row:
        return None
    return Conversation(**row)


async def add_message(
    conversation_id: str,
    role: str,
    content: str,
    model_used: str | None = None,
    cost: float = 0,
) -> dict | None:
    """Save message and update conversation counters."""
    msg = await db.save_message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        model_used=model_used,
        cost=cost,
    )
    if not msg:
        return None

    # Update conversation counters
    conv = await db.get_conversation(conversation_id)
    if conv:
        updates: dict = {"message_count": conv.get("message_count", 0) + 1}
        if cost > 0:
            updates["ai_cost_total"] = round(
                conv.get("ai_cost_total", 0) + cost, 6
            )
        await db.update_conversation(conversation_id, **updates)

    return msg


async def close_conversation(conversation_id: str) -> bool:
    """Set conversation status to closed."""
    result = await db.update_conversation(conversation_id, status="closed")
    return result is not None
