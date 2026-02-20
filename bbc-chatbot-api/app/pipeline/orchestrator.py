"""8-step pipeline orchestrator — THE BRAIN of the chatbot."""

import asyncio
import logging
from typing import Optional

from config.settings import settings
from app.models.chat import ChatResponse, VisitorInfo
from app.models.kb import KBResult
from app.services import conversation_service, lead_service
from app.db import supabase as db
from app.pipeline.intent import detect_intent, Intent
from app.pipeline.generator import generate_response
from app.pipeline.validator import validate_response
from app.ai.templates import get_template

logger = logging.getLogger(__name__)


async def process_message(
    conversation_id: Optional[str],
    message: str,
    tunnel: str,
    visitor: VisitorInfo,
    metadata: Optional[dict] = None,
) -> ChatResponse:
    """Run the 8-step pipeline. Always returns a response — never crashes."""
    conv = None
    try:
        return await asyncio.wait_for(
            _pipeline(conversation_id, message, tunnel, visitor, metadata),
            timeout=settings.pipeline_timeout,
        )
    except asyncio.TimeoutError:
        logger.error(f"Pipeline timeout ({settings.pipeline_timeout}s)")
        cid = conversation_id or "unknown"
        fallback = get_template("ai_fallback", tunnel, visitor) or (
            "Let me connect you with a specialist right away."
        )
        return ChatResponse(
            conversation_id=cid,
            message=fallback,
            type="template_fallback",
            model_used="template",
        )
    except Exception as e:
        logger.error(f"Pipeline fatal error: {e}", exc_info=True)
        cid = conversation_id or "unknown"
        fallback = get_template("ai_fallback", tunnel, visitor) or (
            "Let me connect you with a specialist right away."
        )
        return ChatResponse(
            conversation_id=cid,
            message=fallback,
            type="template_fallback",
            model_used="template",
        )


async def _pipeline(
    conversation_id: Optional[str],
    message: str,
    tunnel: str,
    visitor: VisitorInfo,
    metadata: Optional[dict],
) -> ChatResponse:
    """Internal pipeline implementation with 8 steps."""

    # ── STEP 1: GET/CREATE CONVERSATION ───────────────────────
    conv = await conversation_service.get_or_create_conversation(
        conversation_id=conversation_id,
        tunnel=tunnel,
        visitor=visitor,
    )
    if not conv:
        raise RuntimeError("Failed to create conversation")

    cid = conv.id
    logger.info(f"[{cid}] Pipeline start | tunnel={tunnel}")

    # Save user message immediately (never lose data)
    await conversation_service.add_message(
        conversation_id=cid, role="user", content=message
    )

    # ── STEP 2: AGENT CHECK (V3 placeholder) ─────────────────
    # V1: always AI mode. V3 will check agent availability here.
    # If agents online → route to human, return agent_assigned response.

    # ── STEP 3: INTENT DETECTION ─────────────────────────────
    intent = detect_intent(message, metadata)
    logger.info(f"[{cid}] Intent: {intent.value}")

    # ── STEP 4: ENTITY EXTRACTION (V2 placeholder) ───────────
    # V2 will extract: name, email, phone, route, dates from message.
    entities: dict = {"_raw_message": message}

    # Update visitor info on lead if available
    if visitor.name or visitor.email or visitor.phone:
        visitor_entities: dict = {}
        if visitor.name:
            visitor_entities["name"] = visitor.name
        if visitor.email:
            visitor_entities["email"] = visitor.email
        if visitor.phone:
            visitor_entities["phone"] = visitor.phone
        await lead_service.update_lead_from_entities(cid, visitor_entities)

    # ── STEP 5: KB SEARCH ────────────────────────────────────
    kb_results: list[KBResult] = []
    skip_kb = intent in (Intent.GREETING, Intent.CLOSING, Intent.TALK_TO_AGENT)

    if not skip_kb:
        # V1: keyword search. V2 adds Qdrant vector search.
        keywords = [w for w in message.lower().split() if len(w) > 3][:5]
        if keywords:
            raw_results = await db.keyword_search_kb(keywords, limit=3)
            kb_results = [
                KBResult(
                    entry_id=r["id"],
                    title=r["title"],
                    content=r["content"],
                    score=1.0,
                    source="keyword",
                )
                for r in raw_results
            ]
        logger.info(f"[{cid}] KB results: {len(kb_results)}")

    # ── STEP 6: GENERATE RESPONSE ────────────────────────────
    # Get conversation history for context
    history = await db.get_recent_messages(cid, limit=5)
    lead = await lead_service.get_or_create_lead(cid)

    gen = generate_response(
        intent=intent,
        entities=entities,
        kb_results=kb_results,
        visitor=visitor,
        lead=lead,
        history=history,
        tunnel=tunnel,
    )
    logger.info(f"[{cid}] Generated via {gen.model_used} | cost=${gen.cost:.4f}")

    # ── STEP 7: VALIDATE OUTPUT ──────────────────────────────
    validated_text = validate_response(gen.text)

    # ── STEP 8: DELIVER ──────────────────────────────────────
    # Save AI response to DB
    await conversation_service.add_message(
        conversation_id=cid,
        role="ai",
        content=validated_text,
        model_used=gen.model_used,
        cost=gen.cost,
    )

    # Determine response type
    resp_type = "template" if gen.model_used == "template" else "ai"

    logger.info(f"[{cid}] Pipeline complete | type={resp_type}")

    return ChatResponse(
        conversation_id=cid,
        message=validated_text,
        type=resp_type,
        model_used=gen.model_used,
        cost=gen.cost,
        route_card=gen.route_card,
    )
