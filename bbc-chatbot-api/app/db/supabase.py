"""Supabase DB client — all queries for BBC Chatbot.
Client: supabase-py (HTTP). NO asyncpg. NO SQLAlchemy.
"""
import logging
from typing import Optional, Any
from supabase import create_client, Client
from config.settings import settings

logger = logging.getLogger(__name__)

_client: Optional[Client] = None


def get_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client


# ════════════════════════════════════════════════════════════════
# CONVERSATIONS — pipeline (existing + complete)
# ════════════════════════════════════════════════════════════════

async def get_or_create_conversation(
    conversation_id: Optional[str],
    tunnel: str,
    visitor: Any,
) -> Optional[dict]:
    """Return existing conversation or create a new one."""
    try:
        db = get_client()
        if conversation_id:
            res = db.table("conversations").select("*").eq("id", conversation_id).single().execute()
            if res.data:
                return res.data
        payload: dict = {"tunnel": tunnel, "mode": "ai", "status": "active"}
        if visitor and visitor.name:  payload["visitor_name"]  = visitor.name
        if visitor and visitor.email: payload["visitor_email"] = visitor.email
        if visitor and visitor.phone: payload["visitor_phone"] = visitor.phone
        res = db.table("conversations").insert(payload).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"get_or_create_conversation error: {e}")
        return None


async def add_message(
    conversation_id: str,
    role: str,
    content: str,
    model_used: Optional[str] = None,
    cost: float = 0.0,
) -> Optional[dict]:
    """Insert a message. Never loses a message."""
    try:
        db = get_client()
        payload: dict = {"conversation_id": conversation_id, "role": role, "content": content, "cost": cost}
        if model_used:
            payload["model_used"] = model_used
        res = db.table("messages").insert(payload).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"add_message error: {e}")
        return None


async def count_messages(conversation_id: str) -> int:
    try:
        db = get_client()
        res = db.table("messages").select("id", count="exact").eq("conversation_id", conversation_id).execute()
        return res.count or 0
    except Exception:
        return 0


async def get_recent_messages(conversation_id: str, limit: int = 5) -> list:
    """Last N messages from a conversation (for AI context)."""
    try:
        db = get_client()
        res = (
            db.table("messages")
            .select("role,content,model_used,created_at")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception:
        return []


async def keyword_search_kb(keywords: list[str], tunnel: str = "sales", limit: int = 3) -> list:
    """V1: full-text search. V2: Qdrant vector search."""
    try:
        db = get_client()
        query = " | ".join(keywords)
        res = (
            db.table("kb_entries")
            .select("id,title,content,tunnel")
            .eq("is_active", True)
            .eq("tunnel", tunnel)
            .text_search("search_vector", query)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as e:
        logger.warning(f"keyword_search_kb error: {e}")
        return []


# ════════════════════════════════════════════════════════════════
# ADMIN — CONVERSATIONS
# ════════════════════════════════════════════════════════════════

async def get_conversations(
    tunnel: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list, int]:
    """List conversations with filters. Returns (rows, total_count)."""
    try:
        db = get_client()
        q = db.table("conversations").select("*", count="exact").order("created_at", desc=True)
        if tunnel:  q = q.eq("tunnel", tunnel)
        if status:  q = q.eq("status", status)
        if search:
            q = q.or_(
                f"visitor_name.ilike.%{search}%,"
                f"visitor_email.ilike.%{search}%,"
                f"visitor_phone.ilike.%{search}%"
            )
        res = q.range(offset, offset + limit - 1).execute()
        return res.data or [], res.count or 0
    except Exception as e:
        logger.error(f"get_conversations error: {e}")
        return [], 0


async def get_conversation(conversation_id: str) -> Optional[dict]:
    """One conversation + all its messages."""
    try:
        db = get_client()
        conv = db.table("conversations").select("*").eq("id", conversation_id).single().execute()
        if not conv.data:
            return None
        msgs = (
            db.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .execute()
        )
        result = dict(conv.data)
        result["messages"] = msgs.data or []
        return result
    except Exception as e:
        logger.error(f"get_conversation error: {e}")
        return None


async def update_conversation(conversation_id: str, payload: dict) -> Optional[dict]:
    try:
        db = get_client()
        res = db.table("conversations").update(payload).eq("id", conversation_id).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"update_conversation error: {e}")
        return None


# ════════════════════════════════════════════════════════════════
# ADMIN — LEADS
# ════════════════════════════════════════════════════════════════

async def get_leads(
    status: Optional[str] = None,
    tier: Optional[str] = None,
    tunnel: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list, int]:
    """List leads with JOIN on conversations for contact details. Returns (rows, total_count)."""
    try:
        db = get_client()
        q = db.table("leads").select(
            "*, conversations!inner(visitor_name, visitor_email, visitor_phone, tunnel)",
            count="exact"
        ).order("score", desc=True)
        if status:  q = q.eq("status", status)
        if tier:    q = q.eq("tier", tier)
        if tunnel:  q = q.eq("conversations.tunnel", tunnel)
        if search:
            q = q.or_(
                f"conversations.visitor_name.ilike.%{search}%,"
                f"conversations.visitor_email.ilike.%{search}%,"
                f"origin_code.ilike.%{search}%,"
                f"destination_code.ilike.%{search}%"
            )
        res = q.range(offset, offset + limit - 1).execute()
        rows = []
        for row in (res.data or []):
            flat = dict(row)
            conv = flat.pop("conversations", {}) or {}
            flat["visitor_name"]  = conv.get("visitor_name")
            flat["visitor_email"] = conv.get("visitor_email")
            flat["visitor_phone"] = conv.get("visitor_phone")
            rows.append(flat)
        return rows, res.count or 0
    except Exception as e:
        logger.error(f"get_leads error: {e}")
        return [], 0


async def get_lead_full(lead_id: str) -> Optional[dict]:
    """Full lead: lead + conversation contact info + route_segments."""
    try:
        db = get_client()
        lead_res = (
            db.table("leads")
            .select("*, conversations(visitor_name, visitor_email, visitor_phone, tunnel, metadata)")
            .eq("id", lead_id).single().execute()
        )
        if not lead_res.data:
            return None
        segs_res = (
            db.table("route_segments").select("*")
            .eq("lead_id", lead_id).order("segment_order", desc=False).execute()
        )
        result = dict(lead_res.data)
        conv = result.pop("conversations", {}) or {}
        result["visitor_name"]  = conv.get("visitor_name")
        result["visitor_email"] = conv.get("visitor_email")
        result["visitor_phone"] = conv.get("visitor_phone")
        result["route_segments"] = segs_res.data or []
        return result
    except Exception as e:
        logger.error(f"get_lead_full error: {e}")
        return None


async def update_lead(lead_id: str, payload: dict) -> Optional[dict]:
    """Update lead fields. Recalculates tier if score is modified."""
    try:
        db = get_client()
        if "score" in payload:
            s = payload["score"]
            payload["tier"] = "gold" if s >= 80 else "silver" if s >= 50 else "bronze"
        res = db.table("leads").update(payload).eq("id", lead_id).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"update_lead error: {e}")
        return None


# ════════════════════════════════════════════════════════════════
# ADMIN — KNOWLEDGE BASE
# ════════════════════════════════════════════════════════════════

async def get_kb_categories(tunnel: Optional[str] = None) -> list:
    """KB categories with article count per category."""
    try:
        db = get_client()
        q = db.table("kb_categories").select("*, kb_entries(count)").order("sort_order")
        if tunnel:
            q = q.eq("tunnel", tunnel)
        res = q.execute()
        result = []
        for row in (res.data or []):
            flat = dict(row)
            entries = flat.pop("kb_entries", []) or []
            flat["entry_count"] = entries[0].get("count", 0) if entries else 0
            result.append(flat)
        return result
    except Exception as e:
        logger.error(f"get_kb_categories error: {e}")
        return []


async def get_kb_entries(
    tunnel: Optional[str] = None,
    category_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = 100,
) -> list:
    try:
        db = get_client()
        q = db.table("kb_entries").select("*").order("updated_at", desc=True)
        if tunnel:      q = q.eq("tunnel", tunnel)
        if category_id: q = q.eq("category_id", category_id)
        if is_active is not None: q = q.eq("is_active", is_active)
        res = q.limit(limit).execute()
        return res.data or []
    except Exception as e:
        logger.error(f"get_kb_entries error: {e}")
        return []


async def create_kb_entry(payload: dict) -> Optional[dict]:
    try:
        db = get_client()
        res = db.table("kb_entries").insert(payload).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"create_kb_entry error: {e}")
        return None


async def update_kb_entry(entry_id: str, payload: dict) -> Optional[dict]:
    try:
        db = get_client()
        res = db.table("kb_entries").update(payload).eq("id", entry_id).execute()
        return res.data[0] if res.data else None
    except Exception as e:
        logger.error(f"update_kb_entry error: {e}")
        return None


async def delete_kb_entry(entry_id: str) -> bool:
    try:
        db = get_client()
        db.table("kb_entries").delete().eq("id", entry_id).execute()
        return True
    except Exception as e:
        logger.error(f"delete_kb_entry error: {e}")
        return False


# ════════════════════════════════════════════════════════════════
# ADMIN — DASHBOARD STATS
# ════════════════════════════════════════════════════════════════

async def get_dashboard_stats() -> dict:
    """Dashboard statistics. All queries independent with fallback to 0."""
    db = get_client()
    stats: dict = {}

    def safe(fn):
        try:   return fn()
        except: return None

    # Conversation counts
    r = safe(lambda: db.table("conversations").select("id", count="exact").gte("created_at", "now() - interval '1 day'").execute())
    stats["conversations_today"] = r.count if r else 0

    r = safe(lambda: db.table("conversations").select("id", count="exact").gte("created_at", "now() - interval '7 days'").execute())
    stats["conversations_week"] = r.count if r else 0

    r = safe(lambda: db.table("conversations").select("id", count="exact").gte("created_at", "now() - interval '30 days'").execute())
    stats["conversations_month"] = r.count if r else 0

    r = safe(lambda: db.table("conversations").select("id", count="exact").eq("status", "active").execute())
    stats["conversations_active"] = r.count if r else 0

    # Leads by status
    r = safe(lambda: db.table("leads").select("id", count="exact").execute())
    stats["leads_total"] = r.count if r else 0

    for s in ["new", "contacted", "qualified", "converted", "lost"]:
        r = safe(lambda s=s: db.table("leads").select("id", count="exact").eq("status", s).execute())
        stats[f"leads_{s}"] = r.count if r else 0

    for t in ["gold", "silver", "bronze"]:
        r = safe(lambda t=t: db.table("leads").select("id", count="exact").eq("tier", t).execute())
        stats[f"leads_{t}"] = r.count if r else 0

    # AI costs (from pipeline_runs)
    r = safe(lambda: db.table("pipeline_runs").select("cost").gte("created_at", "now() - interval '1 day'").execute())
    stats["cost_today"] = round(sum(x["cost"] for x in (r.data or [])), 4)

    r = safe(lambda: db.table("pipeline_runs").select("cost").gte("created_at", "now() - interval '7 days'").execute())
    stats["cost_week"] = round(sum(x["cost"] for x in (r.data or [])), 4)

    r = safe(lambda: db.table("pipeline_runs").select("cost").gte("created_at", "now() - interval '30 days'").execute())
    stats["cost_month"] = round(sum(x["cost"] for x in (r.data or [])), 4)

    # Top routes
    r = safe(lambda: db.table("leads").select("origin_code,destination_code").not_.is_("origin_code", "null").limit(200).execute())
    if r and r.data:
        from collections import Counter
        counts = Counter(
            f"{x['origin_code']}→{x['destination_code']}"
            for x in r.data if x.get("destination_code")
        )
        stats["top_routes"] = [{"route": k, "count": v} for k, v in counts.most_common(5)]
    else:
        stats["top_routes"] = []

    # Conversations trend (last 7 days)
    r = safe(lambda: db.table("conversations").select("created_at").gte("created_at", "now() - interval '7 days'").execute())
    if r and r.data:
        from datetime import datetime, timedelta
        from collections import defaultdict
        day_counts: dict = defaultdict(int)
        for row in r.data:
            day_counts[row["created_at"][:10]] += 1
        today_dt = datetime.utcnow().date()
        stats["conversations_trend"] = [
            {"date": str(today_dt - timedelta(days=i)), "count": day_counts.get(str(today_dt - timedelta(days=i)), 0)}
            for i in range(6, -1, -1)
        ]
    else:
        stats["conversations_trend"] = []

    stats["leads_trend"] = []
    return stats
