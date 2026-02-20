"""Supabase client singleton + CRUD query functions."""

import logging
import uuid
from datetime import datetime, timezone

from supabase import create_client, Client

from config.settings import settings

logger = logging.getLogger(__name__)

# ── Singleton client ──────────────────────────────────────────
_client: Client | None = None


def _get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client


def _uid() -> str:
    return uuid.uuid4().hex[:12]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# ── Conversations ─────────────────────────────────────────────

async def create_conversation(
    tunnel: str,
    visitor_name: str | None = None,
    visitor_email: str | None = None,
) -> dict | None:
    try:
        row = {
            "id": _uid(),
            "tunnel": tunnel,
            "mode": "ai",
            "status": "active",
            "visitor_name": visitor_name,
            "visitor_email": visitor_email,
            "message_count": 0,
            "ai_cost_total": 0,
            "created_at": _now(),
            "updated_at": _now(),
        }
        result = _get_client().table("conversations").insert(row).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"create_conversation failed: {e}")
        return None


async def get_conversation(conversation_id: str) -> dict | None:
    try:
        result = (
            _get_client()
            .table("conversations")
            .select("*")
            .eq("id", conversation_id)
            .single()
            .execute()
        )
        return result.data
    except Exception as e:
        logger.error(f"get_conversation failed: {e}")
        return None


async def update_conversation(conversation_id: str, **fields) -> dict | None:
    try:
        fields["updated_at"] = _now()
        result = (
            _get_client()
            .table("conversations")
            .update(fields)
            .eq("id", conversation_id)
            .execute()
        )
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"update_conversation failed: {e}")
        return None


# ── Messages ──────────────────────────────────────────────────

async def save_message(
    conversation_id: str,
    role: str,
    content: str,
    model_used: str | None = None,
    cost: float = 0,
) -> dict | None:
    try:
        row = {
            "id": _uid(),
            "conversation_id": conversation_id,
            "role": role,
            "content": content,
            "model_used": model_used,
            "cost": cost,
            "created_at": _now(),
        }
        result = _get_client().table("messages").insert(row).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"save_message failed: {e}")
        return None


async def get_recent_messages(
    conversation_id: str, limit: int = 5
) -> list[dict]:
    try:
        result = (
            _get_client()
            .table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        # Return in chronological order (oldest first)
        return list(reversed(result.data)) if result.data else []
    except Exception as e:
        logger.error(f"get_recent_messages failed: {e}")
        return []


async def count_messages(conversation_id: str) -> int:
    try:
        result = (
            _get_client()
            .table("messages")
            .select("id", count="exact")
            .eq("conversation_id", conversation_id)
            .execute()
        )
        return result.count or 0
    except Exception as e:
        logger.error(f"count_messages failed: {e}")
        return 0


# ── Leads ─────────────────────────────────────────────────────

async def create_lead(conversation_id: str) -> dict | None:
    try:
        row = {
            "id": _uid(),
            "conversation_id": conversation_id,
            "score": 0,
            "tier": "bronze",
            "created_at": _now(),
            "updated_at": _now(),
        }
        result = _get_client().table("leads").insert(row).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"create_lead failed: {e}")
        return None


async def get_lead_by_conversation(conversation_id: str) -> dict | None:
    try:
        result = (
            _get_client()
            .table("leads")
            .select("*")
            .eq("conversation_id", conversation_id)
            .single()
            .execute()
        )
        return result.data
    except Exception as e:
        logger.error(f"get_lead_by_conversation failed: {e}")
        return None


async def update_lead(lead_id: str, **fields) -> dict | None:
    try:
        fields["updated_at"] = _now()
        result = (
            _get_client()
            .table("leads")
            .update(fields)
            .eq("id", lead_id)
            .execute()
        )
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error(f"update_lead failed: {e}")
        return None


# ── Knowledge Base ────────────────────────────────────────────

async def keyword_search_kb(keywords: list[str], limit: int = 3) -> list[dict]:
    """V1: simple ILIKE keyword search. V2 will add Qdrant vector search."""
    try:
        client = _get_client()
        all_results: list[dict] = []
        seen_ids: set[str] = set()

        for keyword in keywords:
            result = (
                client.table("kb_entries")
                .select("*")
                .ilike("content", f"%{keyword}%")
                .limit(limit)
                .execute()
            )
            for row in result.data or []:
                if row["id"] not in seen_ids:
                    seen_ids.add(row["id"])
                    all_results.append(row)

        return all_results[:limit]
    except Exception as e:
        logger.error(f"keyword_search_kb failed: {e}")
        return []


async def get_all_kb_entries() -> list[dict]:
    try:
        result = _get_client().table("kb_entries").select("*").execute()
        return result.data or []
    except Exception as e:
        logger.error(f"get_all_kb_entries failed: {e}")
        return []


# ── Health Check ──────────────────────────────────────────────

async def check_connection() -> bool:
    """Quick connectivity check for health endpoint."""
    try:
        _get_client().table("conversations").select("id").limit(1).execute()
        return True
    except Exception:
        return False
