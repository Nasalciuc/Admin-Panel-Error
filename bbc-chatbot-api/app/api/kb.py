"""Admin API — Knowledge Base CRUD."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.db import supabase as db
from app.models.admin import KBEntryCreate, KBEntryUpdate

router = APIRouter()


@router.get("/kb/categories")
async def list_categories(tunnel: Optional[str] = Query(None, pattern="^(sales|support)$")):
    return {"data": await db.get_kb_categories(tunnel=tunnel)}


@router.get("/kb/entries")
async def list_entries(
    tunnel:      Optional[str]  = Query(None),
    category_id: Optional[str]  = Query(None),
    is_active:   Optional[bool] = Query(None),
    limit:       int            = Query(100, ge=1, le=500),
):
    return {"data": await db.get_kb_entries(tunnel=tunnel, category_id=category_id, is_active=is_active, limit=limit)}


@router.post("/kb/entries", status_code=201)
async def create_entry(body: KBEntryCreate):
    result = await db.create_kb_entry(body.model_dump())
    if not result:
        raise HTTPException(500, "Failed to create KB entry")
    return result


@router.patch("/kb/entries/{entry_id}")
async def update_entry(entry_id: str, body: KBEntryUpdate):
    payload = {k: v for k, v in body.model_dump().items() if v is not None}
    if not payload:
        raise HTTPException(400, "No fields to update")
    result = await db.update_kb_entry(entry_id, payload)
    if not result:
        raise HTTPException(404, "KB entry not found")
    return result


@router.delete("/kb/entries/{entry_id}", status_code=204)
async def delete_entry(entry_id: str):
    if not await db.delete_kb_entry(entry_id):
        raise HTTPException(404, "KB entry not found")
