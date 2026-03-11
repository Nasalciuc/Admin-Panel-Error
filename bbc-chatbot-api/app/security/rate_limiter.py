"""In-memory per-IP rate limiter for the chat endpoint."""

import time
import logging
from collections import defaultdict
from threading import Lock

from fastapi import HTTPException, Request

from config.settings import settings

logger = logging.getLogger(__name__)


class _Bucket:
    """Token bucket + sliding window counters for one IP."""

    __slots__ = (
        "tokens", "last_refill",
        "hourly_hits", "hourly_reset",
        "daily_hits", "daily_reset",
    )

    def __init__(self) -> None:
        now = time.monotonic()
        self.tokens: float = float(settings.rate_burst)
        self.last_refill: float = now
        self.hourly_hits: int = 0
        self.hourly_reset: float = now + 3600
        self.daily_hits: int = 0
        self.daily_reset: float = now + 86400


_buckets: dict[str, _Bucket] = defaultdict(_Bucket)
_lock = Lock()


def _get_ip(request: Request) -> str:
    """Extract client IP, respecting X-Forwarded-For behind a proxy."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def check_rate_limit(request: Request) -> None:
    """FastAPI dependency — raises 429 if any limit is exceeded."""
    ip = _get_ip(request)
    now = time.monotonic()

    with _lock:
        b = _buckets[ip]

        # ── Reset sliding windows ──────────────────────────────
        if now >= b.hourly_reset:
            b.hourly_hits = 0
            b.hourly_reset = now + 3600
        if now >= b.daily_reset:
            b.daily_hits = 0
            b.daily_reset = now + 86400

        # ── Refill token bucket ────────────────────────────────
        elapsed = now - b.last_refill
        refill = elapsed / settings.rate_sustained_seconds
        b.tokens = min(float(settings.rate_burst), b.tokens + refill)
        b.last_refill = now

        # ── Check limits ───────────────────────────────────────
        if b.tokens < 1:
            logger.warning("Rate limit (burst) hit for %s", ip)
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please slow down.",
            )

        if b.hourly_hits >= settings.rate_hourly_max:
            logger.warning("Rate limit (hourly) hit for %s", ip)
            raise HTTPException(
                status_code=429,
                detail="Hourly message limit reached.",
            )

        if b.daily_hits >= settings.rate_daily_max:
            logger.warning("Rate limit (daily) hit for %s", ip)
            raise HTTPException(
                status_code=429,
                detail="Daily message limit reached.",
            )

        # ── Consume ────────────────────────────────────────────
        b.tokens -= 1
        b.hourly_hits += 1
        b.daily_hits += 1
