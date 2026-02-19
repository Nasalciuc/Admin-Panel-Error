# BBC AI CHATBOT — STRUCTURA PROIECTULUI BACKEND
## Bazat pe: Dezbaterile #1 + #2, Analiza FlyExpert, Structura Generică AI adaptată
## Stack: FastAPI + Supabase + Qdrant + Claude Haiku/Sonnet

---

## COMPARAȚIE: 3 ABORDĂRI → SOLUȚIA NOASTRĂ

### Structura Generică AI (din imagine) — OVER-ENGINEERED

```
generative_ai_project/          ← 20+ fișiere, abstracții multiple
├── config/                     ← YAML configs → NOI: .env simplu
├── data/cache/embeddings/vectordb/  ← 3 subfoldere → NOI: Qdrant Cloud = zero local
├── src/core/                   ← base_llm.py + gpt_client.py + claude_client.py + local_llm.py + model_factory.py
│                                  ← 5 fișiere pentru LLM abstraction → NOI: 2 (claude.py + fallback)
├── src/prompts/                ← templates.py + chain.py → NOI: prompts.py simplu
├── src/rag/                    ← embedder + retriever + vector_store + indexer (4 fișiere)
│                                  → NOI: kb_search.py (1 fișier, 3 strategii)
├── src/processing/             ← chunking + tokenizer + preprocessor → NOI: nu avem nevoie
├── src/inference/              ← inference_engine + response_parser → NOI: pipeline.py + validators.py
├── docs/                       ← README + SETUP → DA, păstrăm
├── scripts/                    ← setup + tests + build_embeddings → DA, adaptat
├── Dockerfile                  ← DA
├── docker-compose.yml          ← NOI: Railway deploy direct, fără Docker local
└── requirements.txt            ← DA
```

**Problemele:**
- Abstract Factory pentru LLM providers = over-engineering la 1 provider (Claude)
- RAG cu 4 fișiere separate = overkill sub 200 articole KB
- Processing pipeline (chunking, tokenizer) = necesar la 10K+ docs, nu la 50 KB entries
- Docker Compose local = complexitate inutilă cu Railway

### FlyExpert — UNDER-ENGINEERED

```
Fly_Expert/
├── front-end/my-project/       ← React + MUI + react-chatbotify
│   └── src/components/
│       └── ChatComponent.tsx   ← Tot chat-ul în 1 fișier, fetch direct la localhost
│
└── back-end/
    ├── app.py                  ← Flask pe port 5000 (vechi, abandonat)
    ├── apis/
    │   ├── server.py           ← FastAPI pe port 8000 (principal)
    │   ├── gpt_api.py          ← System prompts + GPT calls + intent detection
    │   ├── chromadb_api.py     ← KB hardcodat ÎN COD (30 articole ca strings)
    │   ├── chromadb_init.py    ← ChromaDB setup
    │   ├── flight_api.py       ← Amadeus API integration
    │   ├── auth.py             ← JWT auth
    │   └── google_auth.py      ← Google OAuth
    ├── database/               ← SQLAlchemy + PostgreSQL
    └── .env                    ← API KEYS EXPUSE ÎN REPO!
```

**Problemele:**
- 2 backend-uri (Flask + FastAPI) — confuz
- KB hardcodat în Python — update = redeploy
- Zero admin panel, zero lead capture
- API keys în git
- localhost hardcodat în frontend
- Un singur system prompt generic
- Zero error handling, zero fallback
- conversation_state = {} dict in-memory (se pierde la restart)

### BBC — PRAGMATIC (CE CONSTRUIM NOI)

Luăm ce e bun din ambele, eliminăm ce e prost:
- Din structura generică: separare clară pe responsabilități, config externalizat
- Din FlyExpert: simplitate, FastAPI, intent detection cu LLM
- Original: pipeline cu 8 pași, dual tunnel, lead capture, admin panel

---

## STRUCTURA FINALĂ BBC BACKEND

```
bbc-chatbot-api/
│
├── .env.example                    ← Template (comis în git)
├── .env                            ← Secrets reale (în .gitignore!)
├── .gitignore
├── requirements.txt
├── Dockerfile                      ← Pentru Railway deploy
├── railway.toml                    ← Railway config
├── README.md
│
├── config/
│   ├── __init__.py
│   └── settings.py                 ← Pydantic Settings (toate config-urile)
│
├── app/
│   ├── __init__.py
│   ├── main.py                     ← FastAPI app, CORS, middleware, startup
│   │
│   ├── api/                        ← HTTP endpoints (thin controllers)
│   │   ├── __init__.py
│   │   ├── chat.py                 ← POST /api/chat — endpoint principal
│   │   ├── conversations.py        ← CRUD conversații (admin)
│   │   ├── leads.py                ← CRUD leads (admin)
│   │   ├── kb.py                   ← CRUD knowledge base (admin)
│   │   ├── agents.py               ← Agent status, assignment (admin)
│   │   ├── sse.py                  ← SSE stream pentru widget + admin
│   │   ├── health.py               ← GET /health — status + degradation level
│   │   └── webhooks.py             ← CRM sync webhooks
│   │
│   ├── pipeline/                   ← CREIERUL — procesarea mesajelor
│   │   ├── __init__.py
│   │   ├── orchestrator.py         ← Pipeline-ul cu 8 pași (entry point)
│   │   ├── intent.py               ← Pas 3: Regex → Haiku classify
│   │   ├── extractor.py            ← Pas 4: Entity extraction (regex → Haiku)
│   │   ├── kb_search.py            ← Pas 5: Qdrant → pgvector → keyword
│   │   ├── generator.py            ← Pas 6: Template → Haiku → Sonnet
│   │   ├── validator.py            ← Pas 7: Output safety checks
│   │   └── router.py               ← Pas 2: Agent check + assignment
│   │
│   ├── ai/                         ← LLM integration (minimal, nu factory pattern)
│   │   ├── __init__.py
│   │   ├── claude.py               ← Claude API client (Haiku + Sonnet)
│   │   ├── prompts.py              ← System prompts (classifier + conversational)
│   │   └── templates.py            ← Template responses (welcome, closing, etc.)
│   │
│   ├── models/                     ← Pydantic models (request/response schemas)
│   │   ├── __init__.py
│   │   ├── chat.py                 ← ChatRequest, ChatResponse
│   │   ├── conversation.py         ← Conversation, Message
│   │   ├── lead.py                 ← Lead, LeadScore
│   │   └── kb.py                   ← KBCategory, KBEntry
│   │
│   ├── services/                   ← Business logic (between API and DB)
│   │   ├── __init__.py
│   │   ├── conversation_service.py ← Creare, update, close conversații
│   │   ├── lead_service.py         ← Scoring, update, CRM sync
│   │   ├── kb_service.py           ← CRUD + embedding trigger
│   │   └── agent_service.py        ← Online/offline, assignment, availability
│   │
│   ├── db/                         ← Database layer
│   │   ├── __init__.py
│   │   ├── supabase.py             ← Supabase client singleton
│   │   └── queries.py              ← SQL queries organizate pe entitate
│   │
│   ├── security/                   ← Security & rate limiting
│   │   ├── __init__.py
│   │   ├── rate_limiter.py         ← Upstash Redis rate limiting progresiv
│   │   ├── input_sanitizer.py      ← Max length, HTML strip, extreme patterns
│   │   └── budget_guard.py         ← $50/zi cap, $0.50/conversație, alerts
│   │
│   └── utils/                      ← Helpers
│       ├── __init__.py
│       ├── circuit_breaker.py      ← Circuit breaker pentru Claude/Qdrant
│       ├── metrics.py              ← Log: model, cost, latency, intent
│       └── helpers.py              ← uid generator, time utils, formatters
│
├── tests/                          ← Teste
│   ├── __init__.py
│   ├── test_pipeline.py            ← Pipeline integration tests
│   ├── test_intent.py              ← Intent detection (regex + mock Haiku)
│   ├── test_validator.py           ← Output validation
│   ├── test_templates.py           ← Template rendering
│   └── test_scoring.py             ← Lead scoring logic
│
└── scripts/
    ├── seed_kb.py                  ← Încarcă KB inițial în Supabase + Qdrant
    ├── test_claude.py              ← Testează conexiunea Claude API
    └── migrate_db.py               ← SQL migrations runner
```

**Total: ~35 fișiere Python.** Comparat cu: structura generică (~45 fișiere), FlyExpert (~10 fișiere).

---

## DETALII PE FIECARE MODUL

### 1. `config/settings.py` — Toate config-urile într-un loc

```python
# Ce face: centralizează TOATĂ configurația, validare Pydantic

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API
    app_name: str = "BBC Chatbot API"
    debug: bool = False
    cors_origins: list[str] = ["https://buybusinessclass.com"]
    
    # Claude
    anthropic_api_key: str          # OBLIGATORIU
    claude_haiku_model: str = "claude-3-5-haiku-20241022"
    claude_sonnet_model: str = "claude-sonnet-4-20250514"
    claude_timeout: int = 8         # secunde
    
    # Supabase
    supabase_url: str               # OBLIGATORIU
    supabase_key: str               # OBLIGATORIU (service role)
    
    # Qdrant
    qdrant_url: str = ""            # Opțional — dacă gol, skip vector search
    qdrant_api_key: str = ""
    qdrant_collection: str = "bbc_kb"
    
    # Redis (Upstash)
    redis_url: str = ""             # Opțional — dacă gol, skip rate limiting
    
    # Budget
    daily_budget: float = 50.0
    per_conversation_budget: float = 0.50
    budget_alert_threshold: float = 0.70
    
    # Rate Limiting
    rate_burst: int = 15
    rate_sustained_seconds: int = 3
    rate_hourly_max: int = 100
    rate_daily_max: int = 300
    
    # Pipeline
    pipeline_timeout: int = 10      # secunde total
    max_message_length: int = 2000
    max_messages_per_conversation: int = 50
    
    # CRM
    crm_api_url: str = "https://crm.buybusinessclass.com/ai"
    crm_api_token: str = ""
    
    class Config:
        env_file = ".env"
```

**De ce e mai bun decât FlyExpert:** FlyExpert avea load_dotenv() random prin cod, chei duplicate în 2 .env-uri, zero validare. La noi: un singur fișier, Pydantic validează la startup, crash imediat dacă lipsește ceva obligatoriu.

**De ce e mai simplu decât structura generică:** Nu avem model_config.yaml + logging_config.yaml separate. Un singur Settings class cu defaults sensibile.

---

## MAPAREA COMPLETĂ: STRUCTURA GENERICĂ → BBC

| Generic AI Project | BBC Chatbot | De ce |
|-------------------|-------------|-------|
| `config/model_config.yaml` | `config/settings.py` | Pydantic > YAML (validare la startup) |
| `config/logging_config.yaml` | Python standard logging | Nu avem nevoie de logging framework |
| `data/cache/` | Upstash Redis (cloud) | Zero local storage |
| `data/embeddings/` | Qdrant Cloud | Zero local storage |
| `data/vectordb/` | Qdrant Cloud | Zero local storage |
| `src/core/base_llm.py` | NU EXISTĂ | Nu avem nevoie de abstractizare LLM |
| `src/core/gpt_client.py` | NU EXISTĂ | Un singur provider (Claude) |
| `src/core/claude_client.py` | `app/ai/claude.py` | Client simplu, fără abstracție |
| `src/core/local_llm.py` | NU EXISTĂ | Nu rulăm modele local |
| `src/core/model_factory.py` | NU EXISTĂ | Factory pattern = overkill la 1 provider |
| `src/prompts/templates.py` | `app/ai/prompts.py` | Prompturi dinamice, nu statice |
| `src/prompts/chain.py` | `app/pipeline/orchestrator.py` | Pipeline explicit > chain abstraction |
| `src/rag/embedder.py` | Script: `scripts/seed_kb.py` | Embedding la upload, nu la query |
| `src/rag/retriever.py` | `app/pipeline/kb_search.py` | 3 strategii în 1 fișier |
| `src/rag/vector_store.py` | Qdrant client direct | Zero abstracție |
| `src/rag/indexer.py` | `app/services/kb_service.py` | Part of CRUD, nu separat |
| `src/processing/chunking.py` | NU EXISTĂ | KB entries sunt scurte (<500 chars) |
| `src/processing/tokenizer.py` | NU EXISTĂ | Nu numărăm tokens manual |
| `src/processing/preprocessor.py` | `app/security/input_sanitizer.py` | Sanitizare, nu preprocessing NLP |
| `src/inference/inference_engine.py` | `app/pipeline/generator.py` | Decision tree concret |
| `src/inference/response_parser.py` | `app/pipeline/validator.py` | Validare output, nu parsing |
| `docker-compose.yml` | `railway.toml` | Railway deploy, nu Docker local |
| `scripts/build_embeddings.py` | `scripts/seed_kb.py` | Seed, nu build |
| `scripts/setup_env.sh` | `.env.example` + README | Simplificat |
| `Dockerfile` | `Dockerfile` | PĂSTRAT — Railway îl folosește |

**Scor:** Din 20+ fișiere generice → **~35 fișiere BBC** (mai multe, dar fiecare mai mic și mai focusat)

---

## MAPAREA: FLYEXPERT → BBC

| FlyExpert (ce aveau) | BBC (ce facem noi) | Îmbunătățire |
|---------------------|-------------------|-------------|
| `app.py` Flask + `server.py` FastAPI | `app/main.py` FastAPI only | 1 server, nu 2 |
| `gpt_api.py` (totul într-un fișier) | `pipeline/` (8 module) | Separare responsabilități |
| `chromadb_api.py` (KB hardcodat) | `services/kb_service.py` + admin CRUD | KB editabil din UI |
| GPT-4o-mini pe TOT | Templates 60% + Haiku 35% + Sonnet 5% | Cost -70%, calitate +50% |
| `conversation_state = {}` (in-memory) | Supabase PostgreSQL | Persistent, multi-server |
| Zero fallback | 3-level fallback chain | Reziliență |
| Zero rate limiting | Progresiv (burst → sustained → cap) | Anti-abuse |
| API keys în .env comis | Railway env vars, .gitignore | Securitate |
| `localhost:8000` hardcodat | `settings.cors_origins` config | Deployment-ready |
| Zero admin panel | React admin complet | Vizibilitate |
| Zero lead capture | Lead scoring + CRM sync | Revenue |
| Un singur prompt generic | 2 prompturi + secțiuni dinamice | Calitate |
| Zero tests | Pipeline + intent + validator tests | Mentenanță |

---

## CE IMPLEMENTĂM PRIMA DATĂ (V1)

```
SĂPTĂMÂNA 3-4:

✅ config/settings.py          — 1 oră
✅ app/main.py                  — 2 ore (FastAPI + CORS + middleware)
✅ app/api/chat.py              — 3 ore (endpoint principal)
✅ app/api/health.py            — 30 min
✅ app/pipeline/orchestrator.py — 4 ore (pipeline cu 8 pași)
✅ app/pipeline/intent.py       — 2 ore (regex + Haiku classify)
✅ app/pipeline/generator.py    — 3 ore (templates + Haiku)
✅ app/pipeline/validator.py    — 2 ore (safety checks)
✅ app/ai/claude.py             — 2 ore (API client)
✅ app/ai/prompts.py            — 3 ore (system prompts)
✅ app/ai/templates.py          — 2 ore (template responses)
✅ app/db/supabase.py           — 2 ore (client + queries de bază)
✅ app/security/input_sanitizer.py — 1 oră
✅ tests/test_intent.py         — 1 oră
✅ tests/test_validator.py      — 1 oră
✅ Dockerfile + railway.toml    — 1 oră
✅ scripts/seed_kb.py           — 1 oră

Total V1: ~30 ore development = ~1 săptămână intensivă

FĂRĂ în V1 (vine în V2-V3):
□ pipeline/extractor.py        — V2 (entity extraction cu Haiku)
□ pipeline/kb_search.py        — V2 (Qdrant, pgvector — V1 face keyword search)
□ pipeline/router.py           — V3 (agent assignment)
□ api/sse.py                   — V2 (SSE pentru admin)
□ api/agents.py                — V3 (agent management)
□ security/rate_limiter.py     — V2 (Upstash Redis)
□ security/budget_guard.py     — V2
□ utils/circuit_breaker.py     — V2
□ api/webhooks.py              — V3 (CRM sync)
```

---

*Structura e pragmatică: suficient de organizată pentru 3 developeri, suficient de simplă pentru V1 în 1 săptămână, suficient de modulară pentru a scala la V3 fără refactoring.*
