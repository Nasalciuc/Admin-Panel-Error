"""Pydantic models for all admin endpoints."""
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel


# ── Conversations ─────────────────────────────────────────────
class ConversationListItem(BaseModel):
    id: str
    tunnel: str
    mode: str
    status: str
    visitor_name: Optional[str]
    visitor_email: Optional[str]
    visitor_phone: Optional[str]
    assigned_agent_id: Optional[str]
    message_count: int
    ai_cost_total: float
    created_at: datetime
    updated_at: datetime
    closed_at: Optional[datetime]


class MessageItem(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    model_used: Optional[str]
    cost: float
    created_at: datetime


class ConversationDetail(ConversationListItem):
    messages: List[MessageItem] = []
    metadata: dict = {}


class ConversationUpdate(BaseModel):
    status: Optional[str] = None
    mode: Optional[str] = None
    assigned_agent_id: Optional[str] = None
    visitor_name: Optional[str] = None
    visitor_email: Optional[str] = None
    visitor_phone: Optional[str] = None


# ── Leads ─────────────────────────────────────────────────────
class RouteSegmentItem(BaseModel):
    id: str
    lead_id: str
    segment_order: int
    origin_code: str
    origin_city: str
    destination_code: str
    destination_city: str
    departure_date: Optional[date]
    airline_code: Optional[str]
    cabin_class: str
    segment_type: str
    stay_nights: int
    is_stopover: bool
    transport_mode: str


class LeadListItem(BaseModel):
    id: str
    conversation_id: str
    trip_type: str
    cabin_class: str
    passengers: Optional[int]
    flexible_dates: bool
    origin_code: Optional[str]
    destination_code: Optional[str]
    departure_date: Optional[date]
    return_date: Optional[date]
    route_display: Optional[str]
    score: int
    tier: str
    status: str
    intent_signals: List[str] = []
    notes: str
    created_at: datetime
    updated_at: datetime
    contacted_at: Optional[datetime]
    converted_at: Optional[datetime]
    # JOINed from conversations
    visitor_name: Optional[str] = None
    visitor_email: Optional[str] = None
    visitor_phone: Optional[str] = None


class LeadFull(LeadListItem):
    route_segments: List[RouteSegmentItem] = []
    status_history: List[dict] = []


class LeadStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


# ── KB ────────────────────────────────────────────────────────
class KBCategoryItem(BaseModel):
    id: str
    name: str
    tunnel: str
    icon: str
    sort_order: int
    entry_count: int = 0


class KBEntryItem(BaseModel):
    id: str
    category_id: str
    title: str
    content: str
    tunnel: str
    is_active: bool
    view_count: int
    created_at: datetime
    updated_at: datetime


class KBEntryCreate(BaseModel):
    category_id: str
    title: str
    content: str
    tunnel: str
    is_active: bool = True


class KBEntryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[str] = None


# ── Dashboard ─────────────────────────────────────────────────
class DashboardStats(BaseModel):
    conversations_today: int = 0
    conversations_week: int = 0
    conversations_month: int = 0
    conversations_active: int = 0
    leads_total: int = 0
    leads_new: int = 0
    leads_contacted: int = 0
    leads_qualified: int = 0
    leads_converted: int = 0
    leads_lost: int = 0
    leads_gold: int = 0
    leads_silver: int = 0
    leads_bronze: int = 0
    cost_today: float = 0.0
    cost_week: float = 0.0
    cost_month: float = 0.0
    top_routes: List[dict] = []
    conversations_trend: List[dict] = []
    leads_trend: List[dict] = []
