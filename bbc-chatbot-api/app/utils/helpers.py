"""Small utility helpers — uid, time, formatting."""

import uuid
from datetime import datetime, timezone


def uid(length: int = 12) -> str:
    """Generate a short readable unique ID."""
    return uuid.uuid4().hex[:length]


def utc_now() -> datetime:
    """Current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


def utc_iso() -> str:
    """Current UTC as ISO 8601 string."""
    return utc_now().isoformat()


def truncate(text: str, max_len: int = 100) -> str:
    """Truncate text with ellipsis for logging."""
    if len(text) <= max_len:
        return text
    return text[: max_len - 1] + "…"
