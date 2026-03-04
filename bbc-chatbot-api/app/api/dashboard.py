"""Admin API — Dashboard statistics."""
from fastapi import APIRouter
from app.db import supabase as db
from app.models.admin import DashboardStats

router = APIRouter()


@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_stats():
    """Full dashboard statistics. Falls back to 0 for any failed query."""
    stats = await db.get_dashboard_stats()
    return DashboardStats(**stats)
