"""Input sanitisation — runs BEFORE any pipeline processing."""

import re

SAFE_FALLBACK = "I'd like to learn about business class flights."

INJECTION_PATTERNS = [
    re.compile(p, re.IGNORECASE)
    for p in [
        r"ignore\s+(all\s+)?previous\s+instructions",
        r"you\s+are\s+now",
        r"(system|original)\s+prompt",
        r"reveal\s+your",
        r"act\s+as\s+(a|an)?",
        r"pretend\s+(to\s+be|you)",
        r"forget\s+(everything|all|your)",
        r"new\s+instructions?:",
        r"<\|?(system|user|assistant)\|?>",
    ]
]

MAX_LENGTH = 2000
HTML_TAG_RE = re.compile(r"<[^>]+>")
EXCESS_NEWLINES_RE = re.compile(r"\n{3,}")


def is_suspicious(message: str) -> bool:
    """Return True if message contains prompt-injection patterns."""
    for pattern in INJECTION_PATTERNS:
        if pattern.search(message):
            return True
    return False


def sanitize_message(message: str) -> str:
    """Clean and validate visitor message.

    1. Strip whitespace
    2. Enforce max length (truncate)
    3. Remove HTML tags
    4. Block prompt injection → return safe fallback
    5. Collapse excessive newlines
    """
    # 1. Strip
    text = message.strip()

    # 2. Max length
    if len(text) > MAX_LENGTH:
        text = text[:MAX_LENGTH]

    # 3. Remove HTML tags
    text = HTML_TAG_RE.sub("", text)

    # 4. Injection check
    if is_suspicious(text):
        return SAFE_FALLBACK

    # 5. Collapse newlines (3+ → 2)
    text = EXCESS_NEWLINES_RE.sub("\n\n", text)

    return text if text else SAFE_FALLBACK
