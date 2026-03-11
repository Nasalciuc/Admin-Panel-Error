"""Tests for the in-memory rate limiter."""

import pytest
from unittest.mock import MagicMock, patch

from fastapi import HTTPException

from app.security.rate_limiter import (
    _Bucket,
    _buckets,
    _lock,
    check_rate_limit,
)


def _fake_request(ip: str = "1.2.3.4") -> MagicMock:
    """Build a mock Request with a given client IP."""
    req = MagicMock()
    req.headers = {}
    req.client.host = ip
    return req


def _fake_request_forwarded(ip: str = "5.6.7.8") -> MagicMock:
    """Mock Request with X-Forwarded-For header."""
    req = MagicMock()
    req.headers = {"x-forwarded-for": f"{ip}, 10.0.0.1"}
    req.client.host = "127.0.0.1"
    return req


@pytest.fixture(autouse=True)
def _clear_buckets():
    """Reset rate limiter state between tests."""
    _buckets.clear()
    yield
    _buckets.clear()


# ── Basic acceptance ───────────────────────────────────────────

@pytest.mark.asyncio
async def test_single_request_passes():
    """One request should never be rate-limited."""
    req = _fake_request()
    await check_rate_limit(req)  # should not raise


@pytest.mark.asyncio
async def test_forwarded_ip_extracted():
    """X-Forwarded-For IP should be used as the key."""
    req = _fake_request_forwarded("9.8.7.6")
    await check_rate_limit(req)
    assert "9.8.7.6" in _buckets


# ── Burst limit ────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_burst_limit():
    """Exceeding burst limit should raise 429."""
    req = _fake_request("10.0.0.1")

    with patch("app.security.rate_limiter.settings") as mock_settings:
        mock_settings.rate_burst = 3
        mock_settings.rate_sustained_seconds = 0.001
        mock_settings.rate_hourly_max = 10000
        mock_settings.rate_daily_max = 10000

        # First 3 should pass
        for _ in range(3):
            _buckets.clear()  # reset so tokens start fresh each call
            await check_rate_limit(req)

        # Now exhaust tokens without clearing
        _buckets.clear()
        mock_settings.rate_burst = 2
        await check_rate_limit(req)
        await check_rate_limit(req)

        with pytest.raises(HTTPException) as exc_info:
            await check_rate_limit(req)
        assert exc_info.value.status_code == 429
        assert "slow down" in exc_info.value.detail.lower()


# ── Hourly limit ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_hourly_limit():
    """Exceeding hourly max should raise 429."""
    req = _fake_request("10.0.0.2")

    with patch("app.security.rate_limiter.settings") as mock_settings:
        mock_settings.rate_burst = 10000
        mock_settings.rate_sustained_seconds = 0.001
        mock_settings.rate_hourly_max = 3
        mock_settings.rate_daily_max = 10000

        for _ in range(3):
            await check_rate_limit(req)

        with pytest.raises(HTTPException) as exc_info:
            await check_rate_limit(req)
        assert exc_info.value.status_code == 429
        assert "hourly" in exc_info.value.detail.lower()


# ── Daily limit ───────────────────────────────────────────────

@pytest.mark.asyncio
async def test_daily_limit():
    """Exceeding daily max should raise 429."""
    req = _fake_request("10.0.0.3")

    with patch("app.security.rate_limiter.settings") as mock_settings:
        mock_settings.rate_burst = 10000
        mock_settings.rate_sustained_seconds = 0.001
        mock_settings.rate_hourly_max = 10000
        mock_settings.rate_daily_max = 2

        await check_rate_limit(req)
        await check_rate_limit(req)

        with pytest.raises(HTTPException) as exc_info:
            await check_rate_limit(req)
        assert exc_info.value.status_code == 429
        assert "daily" in exc_info.value.detail.lower()


# ── Isolation ─────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_different_ips_isolated():
    """Rate limits for one IP should not affect another."""
    req_a = _fake_request("10.0.0.10")
    req_b = _fake_request("10.0.0.11")

    with patch("app.security.rate_limiter.settings") as mock_settings:
        mock_settings.rate_burst = 1
        mock_settings.rate_sustained_seconds = 0.001
        mock_settings.rate_hourly_max = 10000
        mock_settings.rate_daily_max = 10000

        await check_rate_limit(req_a)

        # req_b should still be allowed even though req_a exhausted its burst
        await check_rate_limit(req_b)
