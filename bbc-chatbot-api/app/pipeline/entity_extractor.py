"""Entity extraction V1 — regex patterns for structured data from chat messages.

Extracts: email (99%), phone (95%), airport codes (100%), 
city names top-20 (100%), passengers, cabin class, name (~70%).

Does NOT extract: dates from text, verbal phone numbers, airport aliases.
Those are V2 (Claude-based extraction).
"""

import re
import logging
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger(__name__)


@dataclass
class ExtractedEntities:
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    origin_code: Optional[str] = None
    destination_code: Optional[str] = None
    passengers: Optional[int] = None
    cabin_class: Optional[str] = None


# ── Patterns ──────────────────────────────────────────────────

EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')

PHONE_RE = re.compile(
    r'(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    r'|(?:\+\d{1,3}[-.\s]?)(?:\d[-.\s]?){7,14}\d'
)

AIRPORTS = {
    "JFK", "LHR", "CDG", "FCO", "LAX", "SFO", "ORD", "MIA", "BOS", "ATL",
    "DXB", "SIN", "HKG", "NRT", "HND", "ICN", "FRA", "AMS", "MAD", "BCN",
    "IST", "DOH", "AUH", "EWR", "IAD", "DFW", "SEA", "DEN", "PHX", "LGA",
    "YYZ", "YVR", "MEX", "GRU", "SCL", "LIM", "BOG", "PTY", "SYD", "MEL",
    "ZRH", "VIE", "MUC", "CPH", "OSL", "ARN", "HEL", "LIS", "DUB", "EDI",
}
AIRPORT_RE = re.compile(r'\b([A-Z]{3})\b')

CITY_TO_CODE = {
    "new york": "JFK", "nyc": "JFK", "manhattan": "JFK",
    "london": "LHR", "paris": "CDG", "rome": "FCO",
    "los angeles": "LAX", "la": "LAX", "san francisco": "SFO",
    "chicago": "ORD", "miami": "MIA", "boston": "BOS",
    "dubai": "DXB", "singapore": "SIN", "hong kong": "HKG",
    "tokyo": "NRT", "frankfurt": "FRA", "amsterdam": "AMS",
    "madrid": "MAD", "barcelona": "BCN", "istanbul": "IST",
    "atlanta": "ATL", "seattle": "SEA", "denver": "DEN",
    "toronto": "YYZ", "vancouver": "YVR", "zurich": "ZRH",
    "vienna": "VIE", "munich": "MUC", "sydney": "SYD",
    "dublin": "DUB", "lisbon": "LIS", "copenhagen": "CPH",
}

NAME_PATTERNS = [
    re.compile(r"(?:my name is|I'm|I am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", re.I),
]

PAX_RE = re.compile(r'(\d+)\s*(?:passengers?|people|persons?|travelers?|pax|of us)', re.I)

CABIN_KEYWORDS = {"business", "business class", "first", "first class", "economy", "coach"}
CABIN_RE = re.compile(r'\b(business\s*class|first\s*class|business|first|economy|coach)\b', re.I)
CABIN_MAP = {
    "business": "business", "business class": "business",
    "first": "first", "first class": "first",
    "economy": "economy", "coach": "economy",
}

ROUTE_RE = re.compile(
    r'(?:from|departing|leaving|flying)\s+([\w\s]{2,25}?)\s+(?:to|→|->|–)\s+([\w\s]{2,25}?)(?:\s|$|[,.])',
    re.I,
)

# ── Stopwords for KB search ───────────────────────────────────
STOPWORDS = frozenset({
    "the", "and", "for", "from", "with", "that", "this", "have", "been",
    "will", "what", "when", "where", "which", "about", "into", "your",
    "just", "want", "need", "like", "some", "also", "very", "much",
    "many", "than", "then", "them", "could", "would", "should", "their",
    "there", "these", "those", "other", "each", "only", "more", "most",
    "look", "looking", "help", "please", "thanks", "hello", "class",
    "flights", "flight", "flying", "travel", "trip",
})


def extract_entities(message: str) -> ExtractedEntities:
    """Extract structured entities from a visitor chat message."""
    entities = ExtractedEntities()
    text = message.strip()

    # 1. Email
    m = EMAIL_RE.search(text)
    if m:
        entities.email = m.group(0).lower()

    # 2. Phone
    m = PHONE_RE.search(text)
    if m:
        entities.phone = m.group(0).strip()

    # 3. Name
    for pattern in NAME_PATTERNS:
        m = pattern.search(text)
        if m:
            entities.name = m.group(1).strip()
            break

    # 4. Airport codes (direct in message)
    codes = [c.group(1) for c in AIRPORT_RE.finditer(text) if c.group(1) in AIRPORTS]
    if len(codes) >= 2:
        entities.origin_code = codes[0]
        entities.destination_code = codes[1]
    elif len(codes) == 1:
        entities.destination_code = codes[0]

    # 5. City names → airport codes (fallback if no codes found)
    if not entities.origin_code and not entities.destination_code:
        m = ROUTE_RE.search(text)
        if m:
            origin = m.group(1).strip().lower()
            dest = m.group(2).strip().lower()
            entities.origin_code = CITY_TO_CODE.get(origin)
            entities.destination_code = CITY_TO_CODE.get(dest)

    # 6. Passengers
    m = PAX_RE.search(text)
    if m:
        n = int(m.group(1))
        if 1 <= n <= 20:
            entities.passengers = n
    elif re.search(r'\bjust\s+me\b', text, re.I):
        entities.passengers = 1
    elif re.search(r'\btwo of us\b|\bme and my\b', text, re.I):
        entities.passengers = 2

    # 7. Cabin class
    m = CABIN_RE.search(text)
    if m:
        entities.cabin_class = CABIN_MAP.get(m.group(1).lower().strip(), "business")

    found = [k for k in ["email", "phone", "name", "origin_code", "destination_code", "passengers", "cabin_class"]
             if getattr(entities, k) is not None]
    if found:
        logger.info(f"Entities extracted: {', '.join(found)}")

    return entities


def extract_kb_keywords(message: str) -> list[str]:
    """Extract meaningful keywords for KB search (stopwords removed)."""
    words = re.findall(r'[a-zA-Z]{3,}', message.lower())
    keywords = [w for w in words if w not in STOPWORDS]

    # Boost airport codes
    codes = [c.group(1).lower() for c in AIRPORT_RE.finditer(message) if c.group(1) in AIRPORTS]
    keywords = codes + [k for k in keywords if k not in codes]

    return keywords[:5]
