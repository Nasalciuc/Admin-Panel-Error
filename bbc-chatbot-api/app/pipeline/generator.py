"""Response generation — decision tree: template → Haiku → Sonnet → fallback."""

import logging
from dataclasses import dataclass, field
from typing import Optional

from app.pipeline.intent import Intent
from app.models.chat import VisitorInfo, RouteCard
# Lead model removed — generator receives lead as dict from Supabase
from app.models.kb import KBResult
from app.ai.templates import get_template
from app.ai.prompts import build_conversational_prompt
from app.ai.claude import call_haiku, call_sonnet

logger = logging.getLogger(__name__)


@dataclass
class GeneratedResponse:
    text: str
    model_used: str                       # "template", "haiku", "sonnet"
    cost: float = 0.0
    route_card: Optional[RouteCard] = None


def _has_route_data(kb_results: list[KBResult]) -> Optional[KBResult]:
    """Check if any KB result is a route entry."""
    for result in kb_results:
        if "routes" in result.source or (
            any(w in result.content.lower() for w in ["nonstop", "duration", "airlines"])
            and any(c.isupper() and len(c) == 3 for c in result.title.split())
        ):
            return result
    return None


def _build_route_card_from_kb(kb_result: KBResult) -> RouteCard | None:
    """Try to extract route card data from a KB entry. Simple heuristic."""
    content = kb_result.content
    title = kb_result.title

    # Extract origin/destination from title like "NYC to London"
    parts = title.split(" to ")
    if len(parts) != 2:
        return None

    # Try to find price range
    import re
    price_match = re.search(r"\$[\d,]+\s*[-–]\s*\$[\d,]+", content)
    price_range = price_match.group(0) if price_match else "varies"

    # Try to find duration
    dur_match = re.search(r"(\d+-\d+ hours?)", content)
    duration = dur_match.group(1) if dur_match else ""

    # Try to find airlines
    air_match = re.search(r"Airlines?:\s*([^.]+)\.", content)
    airlines = air_match.group(1).strip() if air_match else ""

    # Extract airport codes from content
    codes = re.findall(r"\(([A-Z]{3}(?:/[A-Z]{3})?)\)", content)
    origin = codes[0] if codes else parts[0].strip()
    destination = codes[1] if len(codes) > 1 else parts[1].strip()

    return RouteCard(
        origin=origin,
        destination=destination,
        airlines=airlines,
        duration=duration,
        price_range=price_range,
    )


def generate_response(
    intent: Intent,
    entities: dict,
    kb_results: list[KBResult],
    visitor: VisitorInfo,
    lead: Optional[dict],
    history: list[dict],
    tunnel: str,
) -> GeneratedResponse:
    """Decision tree for response generation.

    1. GREETING → template ($0)
    2. CLOSING  → template ($0)
    3. TALK_TO_AGENT → template ($0)
    4. NEW_BOOKING / ROUTE_INFO + route KB data → route card + template ($0)
    5. Otherwise:
       a. 5+ user messages OR BOOKING_CHANGE → Sonnet ($0.015)
       b. Else → Haiku ($0.003)
       c. If AI fails → fallback template ($0)
    """
    # 1. Greeting
    if intent == Intent.GREETING:
        text = get_template("welcome", tunnel, visitor)
        if text:
            return GeneratedResponse(text=text, model_used="template")

    # 2. Closing
    if intent == Intent.CLOSING:
        text = get_template("closing", tunnel, visitor)
        if text:
            return GeneratedResponse(text=text, model_used="template")

    # 3. Talk to agent
    if intent == Intent.TALK_TO_AGENT:
        text = get_template("talk_to_agent", tunnel, visitor)
        if text:
            return GeneratedResponse(text=text, model_used="template")

    # 4. Route card (NEW_BOOKING or ROUTE_INFO with KB data)
    if intent in (Intent.NEW_BOOKING, Intent.ROUTE_INFO) and kb_results:
        route_kb = _has_route_data(kb_results)
        if route_kb:
            route_card = _build_route_card_from_kb(route_kb)
            if route_card:
                text = get_template(
                    "route_card_response",
                    tunnel,
                    visitor,
                    route=f"{route_card.origin} → {route_card.destination}",
                    price_range=route_card.price_range,
                    airlines=route_card.airlines,
                    duration=route_card.duration,
                )
                if text:
                    return GeneratedResponse(
                        text=text,
                        model_used="template",
                        route_card=route_card,
                    )

    # 5. AI generation
    system_prompt = build_conversational_prompt(
        tunnel=tunnel,
        visitor=visitor,
        lead=lead,
        kb_results=kb_results if kb_results else None,
        history=history if history else None,
    )

    user_messages = [m for m in history if m.get("role") == "user"]
    use_sonnet = len(user_messages) >= 5 or intent == Intent.BOOKING_CHANGE

    if use_sonnet:
        # 5a. Sonnet for complex conversations
        logger.info("Using Sonnet (complex conversation)")
        ai_text, ai_cost = call_sonnet(system_prompt, entities.get("_raw_message", ""))
        if ai_text:
            return GeneratedResponse(text=ai_text, model_used="sonnet", cost=ai_cost)
    else:
        # 5b. Haiku for standard responses
        logger.info("Using Haiku (standard response)")
        ai_text, ai_cost = call_haiku(system_prompt, entities.get("_raw_message", ""))
        if ai_text:
            return GeneratedResponse(text=ai_text, model_used="haiku", cost=ai_cost)

    # 5c. Fallback
    logger.warning("AI generation failed — using fallback template")
    text = get_template("ai_fallback", tunnel, visitor) or (
        "Let me connect you with a specialist who can help with that right away."
    )
    return GeneratedResponse(text=text, model_used="template")
