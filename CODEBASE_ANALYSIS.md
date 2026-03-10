# BBC AI Chatbot Admin Panel — Comprehensive Codebase Analysis

**Framework:** Python (FastAPI) Backend + React + TypeScript Frontend  
**Date:** March 9, 2026  
**Purpose:** AI-powered chat system for lead capture and management in premium business class travel

---

## 🏗️ System Architecture Overview

The system is a **two-tier application**:
- **Backend (bbc-chatbot-api):** Python FastAPI service for chat processing, lead management, and knowledge base
- **Frontend (bbc-admin-app):** React + TypeScript admin dashboard for managing conversations, leads, and KB

### Data Flow
```
Widget User → FastAPI Chat API → 8-Step Pipeline → Database (Supabase)
                                → Vector DB (Qdrant) → Response → Widget
                                ↓
         Admin Dashboard ← REST API ← Database
```

---

## 📡 Backend Architecture (bbc-chatbot-api)

### Core Technology Stack
- **Framework:** FastAPI (Python)
- **Database:** Supabase PostgreSQL (with pgvector extension)
- **Vector DB:** Qdrant Cloud (optional; falls back to pgvector)
- **LLM:** Claude Haiku (cheap, fast) + Claude Sonnet (smart, expensive)
- **Hosting:** Railway Pro ($7/month)

### API Routes Structure (`app/api/`)

| Route | Endpoint | Purpose |
|-------|----------|---------|
| **chat.py** | `POST /api/chat` | Main chat endpoint; orchestrates 8-step pipeline |
| **conversations.py** | `GET /api/conversations` | List all conversations with filters (tunnel, status, search) |
| | `GET /api/conversations/{id}` | Get single conversation with full message history |
| | `PATCH /api/conversations/{id}` | Update conversation (status, assigned agent) |
| **leads.py** | `GET /api/leads` | List leads with scoring, tier, status filters |
| | `GET /api/leads/{id}` | Get full lead detail with route segments |
| | `PATCH /api/leads/{id}/status` | Update lead status + auto-set timestamps |
| | `PATCH /api/leads/{id}` | Update lead score, tier, notes, intent signals |
| **kb.py** | `GET /api/kb/categories` | List KB categories by tunnel |
| | `GET /api/kb/entries` | List KB entries with search/filter |
| | `POST /api/kb/entries` | Create new KB entry |
| | `PATCH /api/kb/entries/{id}` | Update KB entry |
| | `DELETE /api/kb/entries/{id}` | Soft delete KB entry |
| **dashboard.py** | `GET /api/dashboard/stats` | Dashboard metrics (conversations, leads, costs, trends) |
| **health.py** | `GET /health` | Health check; returns 200 |

### Data Models (`app/models/`)

#### **conversation.py**
```typescript
Message {
  id: string
  conversation_id: string
  role: 'user' | 'ai' | 'agent' | 'system'
  content: string
  model_used: string | null
  cost: float
  created_at: datetime
}

Conversation {
  id: string
  tunnel: 'sales' | 'support'
  mode: 'ai' | 'human' | 'waiting_for_agent'
  status: 'active' | 'pending' | 'closed'
  visitor_name: string | null
  visitor_email: string | null
  visitor_phone: string | null
  message_count: int
  ai_cost_total: float
  created_at: datetime
  updated_at: datetime
}
```

#### **lead.py** (Travel-specific)
```typescript
Lead {
  id: string
  conversation_id: string (UNIQUE 1:1)
  trip_type: 'one_way' | 'round_trip' | 'multi_city' | 'open_jaw' | 'tour'
  cabin_class: 'business' | 'first' | 'economy' | 'mixed'
  passengers: int | null
  flexible_dates: boolean
  origin_code: string | null          // Synced from route_segments
  destination_code: string | null     // Synced from route_segments
  departure_date: date | null
  return_date: date | null
  route_display: string | null        // Human-readable "JFK → LHR"
  score: int (0-100)                  // Lead scoring (0-100)
  tier: 'gold' | 'silver' | 'bronze'  // Based on score
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  intent_signals: string[]            // Tags extracted from conversation
  notes: string
  created_at: datetime
  updated_at: datetime
  contacted_at: datetime | null       // Auto-set when status → contacted
  converted_at: datetime | null       // Auto-set when status → converted
}

RouteSegment (nested under Lead) {
  segment_order: int
  origin_code: string
  origin_city: string
  destination_code: string
  destination_city: string
  departure_date: date | null
  airline_code: string | null
  cabin_class: string
  segment_type: 'flight' | 'ground'
  stay_nights: int
  is_stopover: boolean
  transport_mode: 'flight' | 'train' | 'bus' | 'ferry' | 'car'
}
```

#### **admin.py**
Defines request/response schemas for admin endpoints with field validation.

### Services (`app/services/`)

#### **conversation_service.py**
- `get_or_create_conversation()` — Get existing or create new conversation
- `add_message()` — Append user/AI message to conversation
- Thin wrapper around database operations (delegates to supabase.py)

#### **lead_service.py**
- `update_lead_from_entities()` — Extract name, email, phone from message and update lead record
- Lead scoring automatic on creation/update

### AI Pipeline (`app/pipeline/`)

The **8-step operational pipeline**:

#### **orchestrator.py** — The Brain
Runs when every message arrives:

| Step | Function | Purpose |
|------|----------|---------|
| 1 | Get/Create Conversation | Fetch existing or create new conv_id |
| 2 | Agent Check | [V3] Route to human if agents available |
| 3 | **Intent Detection** | Classify message (NEW_BOOKING, PRICE_INQUIRY, etc.) |
| 4 | **Entity Extraction** | [V2] Extract name, email, dates, routes |
| 5 | **KB Search** | Keyword search + vector search in Qdrant |
| 6 | **Response Generation** | Build response using Claude Haiku/Sonnet |
| 7 | **Response Validation** | Ensure response doesn't violate rules |
| 8 | **Save Messages + Costs** | Store AI message, track token costs |

**Error Handling:** Always returns a response (never crashes):
- Timeout → Template fallback: "Let me connect you with a specialist..."
- Exception → Same template fallback

#### **intent.py** — Intent Detection Strategy
Hierarchical detection (cheap → expensive):

```python
1. Quick-reply metadata (free, instant)
2. Regex patterns (free, <5ms)
   - TALK_TO_AGENT: "talk.*agent|speak.*human"
   - NEW_BOOKING: "book|fly|flight|ticket|travel"
   - PRICE_INQUIRY: "price|cost|how much|fare|cheap"
   - BOOKING_CHANGE: "change|cancel|modify|refund"
   - BAGGAGE_INFO: "baggage|luggage|carry.on"
   - ROUTE_INFO: "route|airline|nonstop|duration"
   - GREETING: "hi|hello|hey|good (morning|afternoon)"
   - CLOSING: "thank|bye|goodbye"
3. Claude Haiku classifier (paid, <500ms)
4. Default → GENERAL_QUESTION
```

#### **generator.py** — Response Generation
- Builds system prompt with: rules, tunnel instructions, visitor context, KB results, conversation history
- Calls Claude Haiku/Sonnet with rate limiting

#### **validator.py** — Response Validation
- Checks response doesn't mention exact prices (only ranges)
- Verifies no competitor mentions
- Ensures max 3 sentences
- Validates extraction of next steps

### AI Integration (`app/ai/`)

#### **claude.py** — LLM Client
```python
_get_client() → Anthropic singleton
call_haiku(system, message) → text | None
call_sonnet(system, message) → text | None
classify_intent(message) → Intent category
_estimate_cost(model, input_tokens, output_tokens) → float
```

**Token Costs:**
- Claude Haiku: $0.25/1M input, $1.25/1M output (cheap)
- Claude Sonnet: $3.0/1M input, $15.0/1M output (10x expensive)

#### **prompts.py** — System Prompts
Contains **three levels**:

1. **CLASSIFIER_PROMPT** — Classify message intent
2. **COMMON_RULES** — Shared across sales & support
   - "NEVER state exact prices"
   - "If unsure: connect to specialist"
   - "Max 3 sentences per response"
3. **SALES_INSTRUCTIONS** — Goal: capture contact info naturally
4. **SUPPORT_INSTRUCTIONS** — Goal: resolve booking issues
5. **build_conversational_prompt()** — Dynamically assemble full prompt with:
   - Visitor context (name, score, missing fields)
   - KB results (top 3 most relevant)
   - Recent conversation history (last 5 messages)
   - Conversation stage detection (early/mid/closing)

#### **templates.py** — Fallback Templates
Pre-written responses when AI is unavailable:
- `ai_fallback` — "Let me connect you..."
- `agent_assigned` — "An agent is connecting..."

### Database Layer (`app/db/`)

#### **supabase.py** — Single Source of Truth
All database operations go through here:

**Conversations:**
- `get_conversations()` — List with filters + pagination
- `get_conversation(id)` — Get single with message history
- `update_conversation()` — Update fields
- `count_messages()` — For rate limiting

**Leads:**
- `get_leads()` — List with status/tier/tunnel filters
- `get_lead_full(id)` — Get with route segments
- `update_lead()` — Score, tier, status changes
- `create_lead_from_conversation()` — Auto-create lead when triggered

**Knowledge Base:**
- `get_kb_categories()` — All categories for tunnel
- `get_kb_entries()` — List with active/category filters
- `keyword_search_kb()` — Free-text search using PostgreSQL `tsvector`
- `vector_search_kb()` — [V2] Semantic search via Qdrant

**Messages:**
- `add_message()` — Append message to conversation
- `get_messages()` — Retrieve conversation history

### Configuration (`config/settings.py`)

**Environment Variables:**
```python
# API
CORS_ORIGINS = ["https://buybusinessclass.com"]
DEBUG = False

# Claude
ANTHROPIC_API_KEY = "sk-..."
CLAUDE_HAIKU_MODEL = "claude-3-5-haiku-20241022"
CLAUDE_SONNET_MODEL = "claude-sonnet-4-20250514"

# Supabase
SUPABASE_URL = "https://xxx.supabase.co"
SUPABASE_KEY = "eyJhbGc..."

# Qdrant (optional)
QDRANT_URL = "https://xxx-qdrant.qdrant.io"
QDRANT_API_KEY = "xxxxxxx"

# Budget Control
DAILY_BUDGET = 50.0
PER_CONVERSATION_BUDGET = 0.50

# Rate Limiting
RATE_BURST = 15 (per second)
RATE_SUSTAINED = 3 seconds
RATE_HOURLY_MAX = 100
RATE_DAILY_MAX = 300

# Pipeline
PIPELINE_TIMEOUT = 10 seconds
MAX_MESSAGES_PER_CONVERSATION = 50
```

---

## 💾 Database Schema (PostgreSQL 15+)

**9 Tables · 120+ fields · Migrations in `migrations/`**

### Table Relationships
```
users (root)
├── conversations (FK: assigned_agent_id → users)
│   ├── messages (FK: conversation_id CASCADE)
│   └── leads (FK: conversation_id, UNIQUE 1:1 CASCADE)
│       └── route_segments (FK: lead_id CASCADE)
├── kb_categories
│   └── kb_entries (FK: category_id CASCADE)
├── pipeline_runs (FK: message_id, conversation_id CASCADE)
└── app_settings (singleton, id=1)
```

### Key Tables

#### 1. **users**
- Role-based: owner, admin, sales, support
- `tunnel_scope`: sales, support, or all
- `is_active`, `last_seen_at` for admin tracking

#### 2. **conversations**
- `tunnel` (sales/support) + `mode` (ai/human/waiting_for_agent)
- `assigned_agent_id` optional — NULL = unassigned
- `metadata: jsonb` — flexible field for custom data
- `message_count` auto-updated, `ai_cost_total` tracked

#### 3. **messages**
- FK cascade — deleting conversation deletes all messages
- `role`: user, ai, agent, system
- `model_used` tracks which Claude model generated it
- `cost` in USD

#### 4. **leads**
- **UNIQUE 1:1** with conversations (1 conversation → max 1 lead)
- FK cascade — delete conversation = delete lead
- `score` calculated automatically from intent signals
- `tier`: gold (>80), silver (50-80), bronze (<50)
- `status_history: jsonb` — audit trail

#### 5. **route_segments**
- Nested under lead (many-to-one)
- Stores multi-leg travel: JFK → London (leg 1), London → Paris (leg 2)
- `segment_order` for sequencing
- FK cascade

#### 6. **kb_categories & kb_entries**
- Categories: Sales vs Support tunnels
- `search_vector tsvector` — PostgreSQL full-text search
- `is_active` boolean for soft-delete pattern

#### 7. **pipeline_runs**
- Records every AI execution for observability
- `step_name` — which step in pipeline failed
- `intent_detected`, `kb_entries_used`, `model_used`
- `prompt_tokens`, `completion_tokens`, `cost` — track costs
- `latency_ms`, `status` (success/error/timeout/fallback)

#### 8. **app_settings**
- Singleton table (id=1 enforced)
- System configuration: budgets, URLs, feature flags

---

## 🎨 Frontend: React Admin Dashboard (bbc-admin-app)

### Tech Stack
- **React 18** + **TypeScript** — Type-safe components
- **Vite** — Lightning-fast build (HMR in <100ms)
- **TanStack Router** — Type-safe routing
- **TanStack Query (React Query)** — Server state management
- **Tailwind CSS** — Utility-first styling
- **Zustand** — Client state (auth, theme)
- **Lucide Icons** — Minimal, clean SVG icons

### Route Structure (`src/routes/`)

```
__root.tsx (context: QueryClient)
├── _authenticated/               # ALL routes require auth
│   ├── dashboard/ (default)
│   ├── conversations/
│   │   ├── list
│   │   └── detail (params: id)
│   ├── leads/
│   │   ├── list
│   │   └── detail (params: id)
│   ├── knowledge-base/
│   │   ├── entries
│   │   └── categories
│   ├── settings/
│   ├── tasks/
│   ├── users/
│   └── apps/
├── (auth)/                       # Auth pages (no layout)
│   ├── login
│   └── signup
├── (errors)/                     # Error pages
│   ├── 404
│   └── 50x
└── notFoundComponent: GeneralError
errorComponent: NotFoundError
```

**Routing Pattern:** TanStack Router with **file-based routing** (similar to Next.js)

### Component Structure

#### **Layout Components** (`src/components/layout/`)
- `Header.tsx` — Top navigation bar
- `Main.tsx` — Main content wrapper
- `navigation-progress.tsx` — Loading bar on route transitions

#### **UI Components** (`src/components/ui/`)
- Atomic building blocks: Button, Input, Select, Tabs, etc.
- Styled with Tailwind + Lucide icons

#### **Feature Components** (`src/features/`)

| Feature | Components | Purpose |
|---------|-----------|---------|
| **auth/** | login, signup, logout | Authentication flow |
| **dashboard/** | overview, activity, analytics, sales | 4-tab dashboard system |
|  | pages/dashboard-1/2/3/4 | Multiple dashboard layouts |
| **chats/** | list, detail, components | Conversation management |
| **leads/** | index (list) | Lead list with score/tier badges |
| **knowledge-base/** | entries, categories | KB CRUD interface |
| **settings/** | admin settings | System configuration |
| **tasks/** | task list | [V2+] Task management |
| **users/** | user list, roles | [V2+] User management |
| **errors/** | 404, 500, general | Error page UI |

#### **Page Components** (Partial List)

**Dashboard** (`src/features/dashboard/index.tsx`)
```tsx
4 Tabs: Overview | Activity | Analytics | Sales
├── Overview: Key metrics, hot leads
├── Activity: Conversation trends, real-time log
├── Analytics: Burndown charts, cost vs budget
└── Sales: Funnel, top routes, team performance
```

**Leads** (`src/features/leads/index.tsx`)
```tsx
Leads List Page
├── Filters: Status, Tier, Tunnel, Search
├── Pagination: 50 leads per page
├── Columns: Score badge, Route, Visitor name, Status, Tier
└── Row Actions: Update status, View detail, Contact
```

**Conversations** (`src/features/chats/index.tsx` + `detail.tsx`)
```tsx
Conversations List
├── Filters: Tunnel (sales/support), Status (active/closed)
├── Search: By visitor name or email
└── Columns: ID, Visitor, Messages, Cost, Created at

Conversation Detail
├── Message history (scrollable)
├── Lead (if exists): Score, status, route
├── Visitor info: Name, email, phone
└── Actions: Assign agent, close, add notes
```

**Knowledge Base** (`src/features/knowledge-base/`)
```tsx
KB Editor
├── Categories (left sidebar)
└── Entries (main)
    ├── CRUD operations
    ├── Search
    └── Active/inactive toggle
```

### Data Layer

#### **Types** (`src/lib/types.ts`)
```typescript
Message, Conversation, Lead, KBEntry, DashboardStats
```

#### **API Utilities** (`src/lib/bbc/`)
- API client functions for each feature
- Error handling + mock data fallback

#### **Mock Data** (`src/lib/mock-data.ts`)
- MOCK_CONVERSATIONS, MOCK_LEADS, MOCK_KB_ENTRIES
- Used when backend is unreachable

#### **Utility Functions** (`src/lib/utils.ts`)
- `cn()` — Tailwind class merging (tailwind-merge + clsx)
- `sleep()` — Utility for delays
- `getPageNumbers()` — Pagination with ellipsis

### State Management

#### **Auth Store** (`src/stores/auth-store.ts`)
```typescript
useAuthStore()
├── user: AuthUser | null
├── accessToken: string
├── setUser()
├── setAccessToken()
├── resetAccessToken()
└── reset()
```
Persists token to cookie `thisisjustarandomstring`.

#### **Context Providers** (`src/context/`)

| Provider | Purpose |
|----------|---------|
| **theme-provider.tsx** | Dark/light mode toggle (localStorage) |
| **direction-provider.tsx** | LTR/RTL language support |
| **layout-provider.tsx** | Sidebar state (open/closed) |
| **search-provider.tsx** | Global search overlay |
| **font-provider.tsx** | Font family selection |

### Hooks (`src/hooks/`)

#### **use-dialog-state.tsx**
```typescript
useDialogState()
├── isOpen: boolean
├── open()
├── close()
└── toggle()
```
Reusable hook for modal/dialog state.

#### **use-mobile.tsx**
Detects if viewport < 768px (Tailwind md breakpoint).

#### **use-table-url-state.ts**
Syncs table state (sort, filter, pagination) to URL query params.

---

## 🔌 Common Patterns & Architecture

### 1. **Error Handling Pattern**
- **Backend:** Always return response (no 5xx errors in pipeline)
- **Frontend:** Mock data fallback when API unreachable
- **Result:** Graceful degradation; never crash

### 2. **Cost Tracking**
```
Every message:
├── Tokens used (input + output)
├── Cost calculated: tokens × rate
├── Stored in messages.cost (USD)
└── Aggregated: conversations.ai_cost_total
```

### 3. **Lead Scoring Automatic**
```python
score = calculate_from(
  intent_signals,        # NEW_BOOKING = +30 points
  entity_extraction,     # Name = +10, Phone = +15
  engagement_level,      # Message count
  timing                 # Response time
)
tier = "gold" if score > 80 else "silver" if score > 50 else "bronze"
```

### 4. **Two-Tunnel Architecture**
- **Sales**: Capture leads, qualify, collect contact info
- **Support**: Resolve existing bookings, changes
- Each with own system prompts, KB, and response templates

### 5. **Permission Control**
- Auth via Supabase (JWT tokens in cookies)
- User role defines tunnel scope: sales-only, support-only, or all
- API endpoints filter data by user's tunnel

### 6. **Observability**
- Every pipeline step logged to `pipeline_runs` table
- Traces include: intent, KB used, model, latency, cost, status
- Admin can debug any conversation's AI decisions

---

## 📊 Main Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| **Chat Widget** | ✅ MVP | Receive messages, run 8-step pipeline |
| **Intent Detection** | ✅ V1 | Regex + Claude Haiku classifier |
| **KB Search** | ✅ V1 | Keyword search via PostgreSQL tsvector |
| **Lead Capture** | ✅ MVP | Auto-create after conversation |
| **Lead Scoring** | ✅ V1 | Score 0-100, tier (gold/silver/bronze) |
| **Admin Dashboard** | ✅ MVP | 4 tabs, key metrics, real-time stats |
| **Conversations API** | ✅ MVP | List, filter, detail, update |
| **Leads API** | ✅ MVP | List, filter, status updates, detail |
| **Knowledge Base API** | ✅ MVP | CRUD entries, search, categories |
| **Dashboard API** | ✅ MVP | Stats, trends, hot leads, funnel |
| **Cost Tracking** | ✅ MVP | Per-message, per-conversation, daily budget |
| **Rate Limiting** | ✅ MVP | Burst (15/s), hourly, daily limits |
| **Error Handling** | ✅ MVP | Timeout, exception fallbacks |
| **Entity Extraction** | 🔄 V2 | Extract name, email, route from messages |
| **Agent Routing** | 🔄 V2 | Route to human if agents online |
| **Vector Search** | 🔄 V2 | Semantic search via Qdrant |
| **Webhook Sync** | 🔄 V3 | Sync leads to CRM webhook |
| **Multi-language** | 🔄 V3 | Support multiple languages |

---

## 🧩 Technology Decisions & Tradeoffs

### Why PostgreSQL (Supabase)?
- ✅ Relational data (conversations → messages → leads)
- ✅ ACID transactions (no orphan data)
- ✅ Built-in full-text search (tsvector)
- ✅ pgvector extension (vector search fallback)
- ✅ Auth built-in (Supabase JWT)
- ❌ Outage risk (Supabase had 3 outages in 2024)

### Why Claude (not GPT)?
- ✅ Cheaper Haiku model for intent classification
- ✅ Better cost/quality ratio for smaller responses
- ✅ Better at following rules (exact price limits, no competitors)
- ✅ Longer context window (200K tokens)
- ❌ Less popular than OpenAI

### Why FastAPI (not Express/Django)?
- ✅ Built-in async/await (non-blocking I/O)
- ✅ Type hints via Pydantic (runtime validation)
- ✅ Auto-generated OpenAPI docs
- ✅ Less boilerplate than Django

### Why TanStack Router (not Next.js)?
- ✅ Full control over SPA routing (no SSR needed)
- ✅ Type-safe route definitions
- ✅ Smaller bundle size
- ❌ Smaller ecosystem than Next.js

### Why Zustand (not Redux)?
- ✅ Minimal boilerplate
- ✅ Works great for simple state (auth, theme)
- ❌ Not as powerful for complex flows

---

## 🔄 Data Flow Examples

### User Sends Message to Chat Widget

```
1. POST /api/chat
   ├── { conversation_id, message, tunnel, visitor }
   └── → chat.py:chat() endpoint

2. Pipeline orchestrator runs 8 steps:
   ├── Step 1: Get/create conversation in DB
   ├── Step 2: [V3] Check agent availability (hardcoded AI for now)
   ├── Step 3: Detect intent (regex → Claude)
   │   └── Returns: Intent enum
   ├── Step 4: [V2] Extract entities (currently placeholder)
   ├── Step 5: Search KB (keyword search in tsvector)
   │   └── Returns: KBResult[] (top 3 most relevant)
   ├── Step 6: Generate response (call Claude Haiku/Sonnet)
   │   └── System prompt includes: KB results, conversation history
   ├── Step 7: Validate response (no prices, no competitors, max 3 sentences)
   ├── Step 8: Save AI message + costs to DB
   └── Return: ChatResponse { message, type, model_used, cost, conversation_id }

3. Widget displays response to user

4. DB records:
   ├── conversations.message_count++
   ├── conversations.ai_cost_total += cost
   ├── messages table: 2 rows (user message, AI message)
   └── pipeline_runs table: 1 row (debug trace)
```

### Admin Views Lead in Dashboard

```
1. Frontend: GET /api/leads?tier=gold&status=new&limit=50
   ├── Parse filters + pagination
   └── Call useQuery() → request to API

2. Backend:
   ├── Validate query params
   ├── Build SQL: SELECT * FROM leads WHERE tier='gold' AND status='new'
   ├── Join with conversations (visitor info)
   ├── Return paginated results + total count
   └── Response: LeadsResponse { data[], total, limit, offset }

3. Frontend renders:
   ├── Leads table with Score badge (0-100)
   ├── Tier styling: gold=yellow, silver=gray, bronze=orange
   ├── Status dropdown: new → contacted → qualified → converted
   └── Action buttons: Update status, View detail, Contact
```

---

## 🚀 Deployment & Infrastructure

### Frontend (bbc-admin-app)
- Host: Vercel ($0)
- Database: Managed state + localStorage
- Build: `npm run build` → static HTML/JS

### Backend (bbc-chatbot-api)
- Host: Railway Pro ($7/month)
- Database: Supabase PostgreSQL ($25/month)
- Vector DB: Qdrant Cloud ($0-25/month)
- LLM: Anthropic Claude API (pay-per-use, ~$20-50/month typical)

### Total Monthly Cost
- $0 (Frontend) + $7 (Backend) + $25 (DB) + $25 (Vector DB) + $30 (LLM) = **~$87/month**

---

## 📝 Key Code Locations

| Feature | Files |
|---------|-------|
| Chat API | `bbc-chatbot-api/app/api/chat.py` |
| AI Pipeline | `bbc-chatbot-api/app/pipeline/orchestrator.py` |
| Intent Detection | `bbc-chatbot-api/app/pipeline/intent.py` |
| LLM Client | `bbc-chatbot-api/app/ai/claude.py` |
| Prompts | `bbc-chatbot-api/app/ai/prompts.py` |
| Database Client | `bbc-chatbot-api/app/db/supabase.py` |
| Schema | `bbc-chatbot-api/migrations/001_schema.sql` |
| Admin Dashboard | `bbc-admin-app/src/features/dashboard/` |
| Conversations Page | `bbc-admin-app/src/features/chats/` |
| Leads Page | `bbc-admin-app/src/features/leads/` |
| KB Page | `bbc-admin-app/src/features/knowledge-base/` |
| Auth Store | `bbc-admin-app/src/stores/auth-store.ts` |
| Routing | `bbc-admin-app/src/routes/` |

---

## 🔐 Security Measures

1. **Input Sanitization** — `app/security/input_sanitizer.py`
   - Remove HTML/script tags
   - Detect suspicious patterns
   - Limit message length

2. **API Auth** — Supabase JWT
   - All admin endpoints require valid token
   - Token persisted in secure HTTP-only cookie

3. **SQL Injection Prevention**
   - Parameterized queries via Supabase client
   - No string concatenation in queries

4. **CORS** — Whitelist only `buybusinessclass.com`

5. **Budget Controls** — Hard limits
   - Per-conversation: $0.50 max
   - Per-day: $50 max
   - API returns 429 if budget exceeded

---

## 📈 Monitoring & Observability

**Every API call creates audit trail:**
- `pipeline_runs` table stores: step_name, intent, KB used, model, latency, cost, status
- Admin can click any conversation → see full trace of AI decisions
- Dashboard shows: cost trends, response latency distribution, error rates

---

## 🎯 Next Steps (V2+)

1. **Entity Extraction** — Extract name, email, route from free-form text using Claude
2. **Agent Routing** — Check if agents online; route to human if available
3. **Vector Search** — Full semantic search via Qdrant
4. **Webhook Sync** — Push leads to external CRM
5. **Multi-language** — Support French, Spanish, German
6. **Mobile App** — Flutter/React Native admin app
7. **Analytics** — Custom dashboards, export reports

---

## ✅ Summary

This is a **full-stack AI chatbot system** with:
- **Backend:** FastAPI microservice with 8-step AI pipeline, cost tracking, rate limiting
- **Frontend:** React admin dashboard for managing conversations, leads, KB
- **Database:** Supabase PostgreSQL with pgvector, full-text search
- **AI:** Claude Haiku/Sonnet with hierarchical intent detection
- **Architecture:** Two-tunnel (sales/support), role-based permissions, fallback error handling

The codebase is **well-structured**, **type-safe** (TypeScript + Pydantic), and **production-ready** with proper logging, error handling, and observability.
