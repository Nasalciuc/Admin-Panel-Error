"""FastAPI application — CORS, middleware, router includes."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from app.api.chat import router as chat_router
from app.api.health import router as health_router

# ── Logging ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url=None,
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(health_router, tags=["health"])


# ── Startup ───────────────────────────────────────────────────
@app.on_event("startup")
async def startup() -> None:
    logger.info(f"{settings.app_name} starting — v1.0.0")
    logger.info(f"CORS origins: {settings.cors_origins}")
    logger.info(f"Claude Haiku: {settings.claude_haiku_model}")
    logger.info(f"Claude Sonnet: {settings.claude_sonnet_model}")
    logger.info(f"Qdrant: {'configured' if settings.qdrant_url else 'disabled'}")
    logger.info(f"Redis: {'configured' if settings.redis_url else 'disabled'}")
    logger.info(f"Budget: ${settings.daily_budget}/day, ${settings.per_conversation_budget}/conv")
