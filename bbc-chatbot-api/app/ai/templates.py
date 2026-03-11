"""Pre-written template responses — handle 60-70 % of messages at $0 cost."""

import random
from typing import Optional

from app.models.chat import VisitorInfo

# ── Template registry ─────────────────────────────────────────
# Keys follow the pattern: "{key}:{tunnel}" or "{key}:{tunnel}:anonymous"

TEMPLATES: dict[str, list[str]] = {
    # ── SALES ──────────────────────────────────────────────────
    "welcome:sales": [
        "Welcome, {name}! Where are you looking to fly in business class?",
        "Hi {name}! Tell me your route and preferred dates, and I'll find options for you.",
    ],
    "welcome:sales:anonymous": [
        "Welcome! Where are you looking to fly in business class?",
        "Hi! Tell me your route and preferred travel dates.",
    ],
    "route_card_response:sales": [
        "Great choice! {route} typically runs {price_range} in business class, "
        "with {airlines} offering service at about {duration}. "
        "Shall I have a specialist find the best fare for your dates?",
    ],
    "ask_name:sales": [
        "I'd love to help you find the best fare! What's your name?",
        "Sure thing! May I have your name so I can look into that?",
    ],
    "ask_email:sales": [
        "What's the best e-mail to send your quote to, {name}?",
        "Could I get your e-mail address so we can send over the options?",
    ],
    "ask_phone:sales": [
        "To get you the best available fare, what's the best number "
        "for our specialist to reach you?",
    ],
    "lead_captured:sales": [
        "Perfect, {name}! One of our travel specialists will reach out "
        "within 2 hours with the best {route} options. "
        "We'll contact you at {contact}.",
    ],
    "closing:sales": [
        "Thank you for choosing Buy Business Class{name_suffix}! "
        "We'll be in touch soon.",
        "Thanks{name_suffix}! Our team is already working on your request.",
    ],

    # ── SUPPORT ────────────────────────────────────────────────
    "welcome:support": [
        "Hi{name_suffix}! I can help with booking changes, cancellations, "
        "or questions about your trip.",
    ],
    "welcome:support:anonymous": [
        "Hi! I can help with booking changes, cancellations, "
        "or questions about your trip.",
    ],
    "closing:support": [
        "Glad I could help{name_suffix}! Don't hesitate to reach out "
        "if you need anything else.",
    ],

    # ── INTENT-SPECIFIC ───────────────────────────────────────
    "baggage_info": [
        "Business class typically includes 2 checked bags (32 kg each) "
        "plus a carry-on. Exact allowances vary by airline — "
        "would you like me to check a specific carrier?",
    ],
    "price_inquiry": [
        "I'd be happy to get you a quote! Could you tell me your "
        "departure city, destination, and approximate travel dates?",
    ],
    "booking_change": [
        "I can help with changes to an existing booking. "
        "Could you share your booking reference or confirmation number?",
    ],

    # ── UNIVERSAL ──────────────────────────────────────────────
    "talk_to_agent": [
        "I'll connect you with a travel specialist right away. "
        "One moment please.",
    ],
    "after_hours": [
        "Our specialists are available 9 AM – 6 PM EST. "
        "Leave your number and we'll reach out first thing tomorrow.",
    ],
    "ai_fallback": [
        "Let me connect you with a specialist who can help with that right away.",
    ],
    "rate_limited": [
        "You've been chatting with us a lot! For the fastest service, "
        "call us at +1-XXX-XXX-XXXX.",
    ],
    "error": [
        "I'm sorry, something went wrong on our end. "
        "Please try again in a moment or call us directly.",
    ],
}


def get_template(
    key: str,
    tunnel: str = "sales",
    visitor: Optional[VisitorInfo] = None,
    **kwargs: str,
) -> str | None:
    """Look up a template, pick a random variant, and fill placeholders.

    Lookup order:
      1. "{key}:{tunnel}:anonymous"  (if visitor has no name)
      2. "{key}:{tunnel}"
      3. "{key}"
    """
    visitor = visitor or VisitorInfo()
    has_name = bool(visitor.name)

    # Build candidate keys
    candidates: list[str] = []
    if not has_name:
        candidates.append(f"{key}:{tunnel}:anonymous")
    candidates.append(f"{key}:{tunnel}")
    candidates.append(key)

    variants: list[str] | None = None
    for candidate in candidates:
        if candidate in TEMPLATES:
            variants = TEMPLATES[candidate]
            break

    if not variants:
        return None

    text = random.choice(variants)

    # Build replacement map
    replacements = {
        "name": visitor.name or "",
        "name_suffix": f", {visitor.name}" if visitor.name else "",
        "contact": visitor.phone or visitor.email or "the number you provided",
        **kwargs,
    }

    try:
        return text.format(**replacements)
    except KeyError:
        # Missing placeholder — return raw template rather than crash
        return text
