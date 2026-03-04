"""Admin API — conversations CRUD."""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.db import supabase as db
from app.models.admin import ConversationDetail, ConversationUpdate

router = APIRouter()


@router.get("/conversations")
async def list_conversations(
    tunnel: Optional[str] = Query(None, pattern="^(sales|support)$"),
    status: Optional[str] = Query(None, pattern="^(active|pending|closed)$"),
    search: Optional[str] = Query(None, max_length=100),
    limit:  int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    rows, total = await db.get_conversations(tunnel=tunnel, status=status, search=search, limit=limit, offset=offset)
    return {"data": rows, "total": total, "limit": limit, "offset": offset}


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(conversation_id: str):
    conv = await db.get_conversation(conversation_id)
    if not conv:
        raise HTTPException(404, "Conversation not found")
    return conv


@router.patch("/conversations/{conversation_id}")
async def update_conversation(conversation_id: str, body: ConversationUpdate):
    payload = {k: v for k, v in body.model_dump().items() if v is not None}
    if not payload:
        raise HTTPException(400, "No fields to update")
    result = await db.update_conversation(conversation_id, payload)
    if not result:
        raise HTTPException(404, "Conversation not found")
    return result
