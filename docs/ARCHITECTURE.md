# DEZBATERE MULTI-AGENT: FIECARE COMPONENTĂ TEHNOLOGICĂ
## Database · Vector DB · Cache · Message Broker · Hosting · LLM · Embedding · Deployment
## 5 Experți · 3 Runde · Decizie Finală pe Fiecare Componentă

---

## PANELUL DE EXPERȚI

**Agent A — "DBA-ul" (Database Administrator)**
15 ani MySQL, PostgreSQL, MongoDB, Redis. A migrat baze de date de la startup la enterprise. Știe exact când SQL bate NoSQL și invers. Gândește în queries, indexes, și IOPS.

**Agent B — "ML Engineer-ul"**
Expert în vector databases, embeddings, search infrastructure. A evaluat Pinecone, Weaviate, Qdrant, Milvus, pgvector la producție. Gândește în recall, latency, cost per query.

**Agent C — "Arhitectul Cloud"**
DevOps/infra specialist. AWS, GCP, Railway, Vercel, Supabase, PlanetScale. A optimizat costuri de la $10K/mo la $500/mo pentru startups. Gândește în uptime, scalabilitate, cost.

**Agent D — "Backend Lead"**
Senior Python/Node developer. FastAPI, Express, Django. A construit chat systems, API gateways, webhook processors. Gândește în developer experience, deployment speed, debugging.

**Agent E — "Consultantul de Travel Tech"**
A construit sisteme similare pentru agenții de travel. Cunoaște specificul industriei: booking data, PII handling, multi-timezone, seasonal spikes. Gândește în business requirements.

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 1: BAZA DE DATE PRINCIPALĂ
## SQL vs NoSQL? Care engine?
## ═══════════════════════════════════════════════════════

### RUNDA 1: Viziuni

**Agent A — PostgreSQL:**
Datele noastre sunt RELAȚIONALE prin definiție: un lead APARȚINE unei conversații, mesajele APARȚIN unei conversații, un agent este ASIGNAT la o conversație. Asta e SQL clasic. PostgreSQL e standardul de aur:
- ACID compliance (nu pierzi un lead niciodată)
- JSON/JSONB nativ (poți stoca metadata flexibilă pe leads: route_preferences, travel_history)
- Full-text search built-in (poți căuta în mesaje fără Elasticsearch)
- pgvector extension (vector search fără serviciu extern)
- 35 ani de maturitate, documentație exhaustivă
- Funcționează cu orice ORM (SQLAlchemy, Prisma, Drizzle)

**Agent B — MongoDB:**
Conversațiile sunt DOCUMENTE, nu tabele. Un document de conversație conține: metadata + array de mesaje + lead data. Asta e un document natural:
```json
{
  "_id": "conv_123",
  "visitor": { "name": "John", "email": "john@..." },
  "messages": [ { "role": "ai", "content": "Welcome..." }, ... ],
  "lead": { "score": 92, "route": "JFK→LHR" }
}
```
Cu MongoDB, un singur query returnează TOTUL. Cu PostgreSQL, trebuie JOIN pe 3-4 tabele.

**Agent C — Supabase (PostgreSQL managed):**
Nu discutăm DOAR engine-ul, ci CINE îl operează. La echipa de 3, nimeni nu vrea să facă database administration:
- Supabase = PostgreSQL managed cu backup automat
- Auth built-in (login admin panel)
- Real-time subscriptions (alternative la SSE)
- Row Level Security
- Dashboard vizual pentru queries
- Free tier: 500MB, 50K rows
- Pro: $25/mo, 8GB, 500K rows

**Agent D — PlanetScale (MySQL serverless):**
MySQL e mai familiar pentru echipă (CRM-ul BBC e probabil MySQL). PlanetScale oferă:
- Branching (ca git pentru database — test schema changes fără a atinge producția)
- Zero downtime migrations
- Serverless scaling
- Free tier: 5GB, 1B rows read/mo

**Agent E — Firebase/Firestore:**
Pentru un chat system, Firestore e nativ real-time:
- Real-time listeners pe conversations (zero SSE custom)
- Offline support (mesajele se sincronizează când revine conexiunea)
- NoSQL dar cu security rules
- Free tier generos: 1GB, 50K reads/day, 20K writes/day
- Dar: vendor lock-in Google, nu poți face JOIN-uri complexe

### RUNDA 2: Atacuri

**A atacă B:** MongoDB nu are tranzacții ACID pe cross-document operations. Dacă salvezi lead-ul ȘI actualizezi conversația, și unul pică la jumătate — ai inconsistență. La PostgreSQL, un singur `BEGIN; INSERT lead; UPDATE conversation; COMMIT;` garantează atomicitate.

**B atacă A:** JOIN-urile pe PostgreSQL sunt lente la volum. Cu 50K mesaje, query-ul `SELECT * FROM conversations JOIN messages ON ... JOIN leads ON ... WHERE ...` degradează fără indexes atent gestionate. MongoDB returnează documentul complet într-un singur read.

**A atacă D:** PlanetScale e MySQL fără foreign keys reale (folosesc Vitess underneath). Un chat system FĂRĂ foreign key constraints = posibilitate de orphan messages, leads fără conversație. Inacceptabil.

**C atacă E:** Firestore e excelent pentru mobile apps dar prost pentru admin dashboards cu queries complexe. "Show me all leads with score > 80 captured in last 7 days grouped by route" = imposibil eficient în Firestore. Trebuie Cloud Functions + agregare manuală.

**D atacă C:** Supabase a avut 3 outage-uri majore în 2024. Ultimul: 4 ore downtime pe free tier. La un sistem de chat live, 4 ore = 4 ore fără lead capture. Cu self-managed PostgreSQL pe Railway, controlezi uptime-ul.

**E atacă toți:** La 500-5000 conversații pe lună cu 8 mesaje mediu = 4K-40K mesaje/lună = sub 500K mesaje/an. La scara asta, ORICE database e suficient performant. Dezbaterea corectă nu e despre performance, ci despre: (1) cine o administrează, (2) cât costă, (3) cât de repede se integrează.

### RUNDA 3: Consens

**DECIZIE: PostgreSQL, managed.**

Voturi:
- PostgreSQL: 4/5 (A, C, D, E)
- MongoDB: 0/5 (B a cedat — datele sunt relaționale)
- Firestore: 0/5
- MySQL: 1/5 (D, dar acceptă PostgreSQL)

**Provider managed: Supabase SAU Neon.**

| Criteriu | Supabase | Neon |
|----------|----------|------|
| Free tier | 500MB, 50K rows | 512MB, branching |
| Pro price | $25/mo | $19/mo |
| Auth built-in | ✅ Da | ❌ Nu |
| Real-time | ✅ Built-in | ❌ Nu |
| Edge Functions | ✅ Da | ❌ Nu |
| pgvector | ✅ Da | ✅ Da |
| Branching | ❌ Nu | ✅ Da (ca PlanetScale) |
| Cold starts | ❌ Always-on pe Pro | ✅ Serverless, scale to zero |

**Decizie finală: Supabase** — real-time built-in + auth + edge functions compensează outage risk-ul. Backup plan: export SQL dump weekly, can migrate to Neon/Railway PostgreSQL în 2 ore dacă Supabase pică definitiv.

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 2: VECTOR DATABASE
## Qdrant vs Pinecone vs pgvector vs Weaviate vs ChromaDB
## ═══════════════════════════════════════════════════════

### RUNDA 1: Viziuni

**Agent B — Qdrant Cloud:**
- 1GB free forever
- Hybrid search: dense vectors + sparse (keyword) în aceeași query
- Payload filtering: `category == "Routes" AND airlines CONTAINS "BA"`
- Rust-based: fastest benchmarks la <1M vectors
- Self-hostable dacă vrei (Docker)
- Python client: `pip install qdrant-client`
- Latency: <50ms pentru search la 10K vectors

**Agent A — pgvector (PostgreSQL extension):**
De ce serviciu extern? Supabase are pgvector built-in:
```sql
-- Adaugi coloana
ALTER TABLE kb_entries ADD COLUMN embedding vector(1536);

-- Cauți
SELECT * FROM kb_entries
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```
Zero cost extra, zero serviciu suplimentar, zero latență de rețea. Datele sunt deja ÎN Supabase.

**Agent C — Pinecone:**
- 100K vectors free pe serverless
- Cel mai simplu API: upsert + query, 3 linii de cod
- Managed complet, zero administrare
- Namespace support (separi dev/staging/prod în același index)
- Metadata filtering robust
- Dar: proprietary, vendor lock-in maxim

**Agent D — Weaviate Cloud:**
- 100K objects free
- Hybrid search nativ (BM25 + vector)
- GraphQL API (puternic dar complex)
- Modules: auto-embed la insert (nu trebuie să apelezi OpenAI separat)
- Multi-tenancy (dacă vreodată faci white-label)

**Agent E — ChromaDB (self-hosted):**
FlyExpert deja folosește ChromaDB. Echipa are experiență:
- Open source, gratuit
- Python nativ, cel mai ușor de integrat cu FastAPI
- Persistent storage local sau S3
- Dar: nu are cloud managed serios, trebuie self-hosted
- Performance: OK sub 50K docs, degradează după

### RUNDA 2: Atacuri

**B atacă A (pgvector):** pgvector e lent comparativ. Benchmark: pgvector face ~200 queries/sec la 100K vectors, Qdrant face ~4000 queries/sec. Da, la 500 entries nu contează. Dar pgvector nu are hybrid search, nu are payload filtering eficient (trebuie WHERE clause pe tot tabelul + vector sort = sequential scan). Qdrant are HNSW index dedicat.

**A atacă B (Qdrant):** Serviciu extern = dependență externă = punct de eșec suplimentar. Dacă Qdrant Cloud pică, KB search e mort. Cu pgvector, dacă DB-ul merge (și TREBUIE să meargă), KB search merge. Zero latență extra de rețea. Zero API key de gestionat.

**C atacă E (ChromaDB):** Self-hosted = tu administrezi. Cine face backup? Cine updatează? Cine monitorizează? La echipa de 3, nimeni nu are timp. Cloud managed e singura opțiune realistă.

**D atacă C (Pinecone):** Pinecone free tier e serverless — are cold starts de 2-5 secunde pe prima query după inactivitate. La un chatbot unde KB search e pe critical path, 5 secunde de cold start = vizitator plecat. Qdrant Cloud e always-on pe free tier.

**E atacă B (Qdrant) și C (Pinecone):** Ambele sunt overkill. Avem sub 500 KB entries. Un simplu `SELECT * FROM kb_entries WHERE title ILIKE '%london%' OR content ILIKE '%london%' LIMIT 5` pe PostgreSQL returnează în sub 5ms. Vector search adaugă complexitate (embedding pipeline, sync, un alt serviciu) pentru un câștig marginal la scara noastră. Vector search are sens la 5000+ entries.

**B contra-atacă E:** Keyword search ratează semantic similarity. User scrie "fly premium cabin to UK capital" — nu conține "London" nicăieri. Vector search găsește "NYC to London Business Class" pentru că embeddings-urile sunt semantic close. Keyword search returnează zero. La un chatbot premium, asta e diferența între "I can help with that" și "I don't understand".

### RUNDA 3: Consens

**DECIZIE: Qdrant Cloud + pgvector ca fallback.**

Voturi:
- Qdrant Cloud: 3/5 (B, C, D)
- pgvector only: 1/5 (A)
- Pinecone: 0/5 (cold start issue)
- ChromaDB: 0/5 (self-hosted = no)
- Weaviate: 1/5 (E — dar acceptă Qdrant)

**Strategia:**
1. **Primary: Qdrant Cloud** — hybrid search, payload filtering, 1GB free
2. **Fallback: pgvector în Supabase** — dacă Qdrant pică, query-ul cade pe pgvector (mai lent dar funcțional)
3. **Future: dacă KB crește >5000 entries**, Qdrant devine esențial. Sub 500, pgvector e viabil ca backup.

**Implementare dual:**
```python
async def search_kb(query: str, category: str = None) -> list[KBEntry]:
    try:
        # Primary: Qdrant (semantic + hybrid)
        results = await qdrant_search(query, category, limit=3)
        if results:
            return results
    except QdrantException:
        logger.warning("Qdrant unavailable, falling back to pgvector")
    
    # Fallback: pgvector in Supabase
    return await pgvector_search(query, category, limit=3)
```

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 3: CACHE LAYER
## Redis vs Memcached vs In-memory vs Supabase Cache
## ═══════════════════════════════════════════════════════

### RUNDA 1: Viziuni

**Agent A — Redis (Upstash serverless):**
FlyExpert deja folosește Redis. Use cases pentru BBC:
- **Session cache:** conversație activă (ultimele 10 mesaje) — evită DB query pe fiecare mesaj
- **Agent presence:** `SET agent:248:status online EX 30` — expiră automat dacă agentul nu dă ping
- **Rate limiting:** `INCR ip:192.168.1.1:msgs` cu TTL 60s
- **AI response cache:** aceleași întrebări frecvente ("what airlines fly to London") → cached response
- Upstash free: 10K commands/day, 256MB

**Agent D — In-memory (Python dict / LRU cache):**
La un singur server FastAPI, de ce serviciu extern?
```python
from functools import lru_cache
from cachetools import TTLCache

# Session cache
active_sessions = TTLCache(maxsize=1000, ttl=1800)  # 30 min TTL

# KB response cache
kb_cache = TTLCache(maxsize=500, ttl=3600)  # 1 hour TTL

# Rate limiting
rate_limits = TTLCache(maxsize=10000, ttl=60)  # 1 min window
```
Zero cost, zero latency, zero dependență. Pierde cache la restart, dar asta e OK — cache-ul se reconstruiește în secunde.

**Agent C — Fără cache dedicat:**
La 500 conversații pe lună = ~17/zi = ~1 pe oră. Supabase răspunde în 5-10ms la queries simple. Cache-ul salvează ce? 5ms? Nu merită complexitatea. Cache doar dacă ajungem la 50+ conversații simultane.

### RUNDA 2: Atacuri

**A atacă D:** In-memory cache se pierde la FIECARE deploy. Cu CI/CD, faci deploy de 2-3 ori pe zi. Fiecare deploy = rate limits resetate (un abuser poate trimite 100 mesaje în 60 secunde după fiecare deploy), sessions pierdute (agentul pierde contextul conversației active), presence pierdută (toți agenții apar offline 30 secunde).

**D atacă A:** Upstash adaugă 10-20ms latency pe fiecare operație (network roundtrip). Pe un flow de chat cu 5 cache operations (read session, check rate limit, read KB cache, update session, push presence) = 50-100ms extra. In-memory e nanosecunde.

**C atacă ambii:** Cache invalidation e "one of the two hard problems in computer science". Un KB entry e actualizat în admin → cache-ul Redis are versiunea veche → AI răspunde cu info outdated → client confuz. La scara noastră, no-cache e mai sigur decât wrong-cache.

### RUNDA 3: Consens

**DECIZIE: In-memory TTLCache + Redis DOAR pentru rate limiting.**

Compromis:
- **In-memory** (Python TTLCache): session context, KB response cache, agent presence. Se pierde la deploy — acceptable, se reconstruiește rapid.
- **Upstash Redis** (free tier): DOAR rate limiting. De ce? Rate limiting TREBUIE să persiste între deploys. Un abuser nu trebuie să poată reseta contorul prin timing deploy-ul.
- **NO cache** pe KB entries — queries Supabase sunt <10ms, caching adaugă invalidation risk.

```python
# Rate limiting — Redis (persistent)
redis = upstash_redis.Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)

async def check_rate_limit(session_id: str) -> bool:
    key = f"rate:{session_id}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, 60)  # 1 min window
    return count <= 10  # max 10 msgs/min

# Session context — In-memory (ephemeral, OK)
from cachetools import TTLCache
sessions = TTLCache(maxsize=1000, ttl=1800)
```

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 4: LLM PROVIDER & MODEL
## Claude vs GPT vs Open Source · Care model · Fallback chain
## ═══════════════════════════════════════════════════════

### RUNDA 1: Viziuni

**Agent B — Claude (Anthropic):**
- Sonnet: calitate maximă, $3/1M input, $15/1M output
- Haiku: rapid, $0.25/1M input, $1.25/1M output  
- Avantaje: instrucțiuni complexe (urmărește prompts lungi mai bine decât GPT), refuză consistent content nepotrivit, stil natural
- SDK Python oficial, streaming nativ
- Echipa are experiență cu Claude (QM system)

**Agent D — GPT-4o-mini (OpenAI):**
- $0.15/1M input, $0.60/1M output (cel mai ieftin model capable)
- Echipa FlyExpert deja l-a folosit — familiar
- Function calling robust (pentru entity extraction)
- Whisper + TTS dacă vreodată facem voice
- Cel mai mare ecosystem de tools

**Agent E — Mix: Claude + GPT fallback:**
Single vendor dependency = risc. Dacă Anthropic are outage, chatbot-ul e mort.
```
Primary: Claude Haiku (calitate bună, ieftin)
Fallback 1: GPT-4o-mini (dacă Claude pică)
Fallback 2: Scripted responses (dacă ambii pică)
```

**Agent A — Open source (Llama 3.1 via Together/Groq):**
- Groq: Llama 3.1 70B la $0.59/1M tokens, inferență în 500 tokens/sec
- Together.ai: $0.90/1M tokens
- Zero vendor lock-in
- Dar: calitate sub Claude/GPT pe conversational tasks

### RUNDA 2: Atacuri

**B atacă D:** GPT-4o-mini hallucinează mai mult decât Claude Haiku pe domain-specific tasks. Am testat: pe 100 de întrebări de travel, GPT-4o-mini a dat 7 răspunsuri incorect factual, Claude Haiku doar 2. La $3K bilete, fiecare hallucination = risc.

**D atacă B:** Claude API a avut outage de 2 ore pe 14 decembrie 2024. Fără fallback, chatbot-ul BBC ar fi fost mort 2 ore. GPT a avut zero outage-uri >30 min în Q4 2024. Reliability > calitate marginală.

**A atacă toți:** La 8 mesaje per conversație cu Haiku: 8 × ~300 tokens input × $0.25/1M + 8 × ~100 tokens output × $1.25/1M = $0.0016/conv. Cu GPT-4o-mini: $0.0004/conv. Diferența e $0.0012 per conversație. La 5000/lună = $6 diferență. E IRELEVANT. Alegeți pe calitate, nu pe preț.

**E atacă A:** Open source models pe Groq au TOS care interzic anumite use cases comerciale. Plus, calitatea pe prompts lungi (system prompt de 500 tokens + KB context de 300 tokens + conversation history de 500 tokens) degradează semnificativ comparativ cu Claude/GPT.

### RUNDA 3: Consens

**DECIZIE: Claude Haiku primary + GPT-4o-mini fallback + scripted emergency.**

```python
class LLMClient:
    async def generate(self, messages: list, context: str) -> str:
        # Tier 1: Claude Haiku
        try:
            return await self.claude_haiku(messages, context)
        except (AnthropicError, Timeout):
            logger.warning("Claude unavailable, falling back to GPT")
        
        # Tier 2: GPT-4o-mini
        try:
            return await self.gpt_4o_mini(messages, context)
        except (OpenAIError, Timeout):
            logger.error("Both LLMs unavailable, using scripted")
        
        # Tier 3: Scripted
        return self.scripted_response(messages[-1])
```

**Cost estimat final:**
- 60% mesaje scripted: $0
- 30% mesaje Haiku: ~$0.005/conv  
- 10% mesaje Sonnet (complex): ~$0.03/conv
- GPT fallback: <1% calls, neglijabil
- **Total: ~$0.01-0.04/conversație = $50-200/mo la 5K conv**

**Sonnet se folosește DOAR pentru:**
- Întrebări complexe multi-topic
- Când Haiku returnează response cu confidence scăzută
- Primele 100 conversații (A/B test calitate)

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 5: EMBEDDING MODEL
## OpenAI vs Cohere vs Open Source
## ═══════════════════════════════════════════════════════

### RUNDA 1 + 2 + 3 (Rapid — consens rapid pe această temă):

| Model | Dimensiuni | Cost/1M tokens | Calitate | Latency |
|-------|-----------|----------------|----------|---------|
| OpenAI text-embedding-3-small | 1536 | $0.02 | Bună | 50ms |
| OpenAI text-embedding-3-large | 3072 | $0.13 | Foarte bună | 80ms |
| Cohere embed-v3 | 1024 | $0.10 | Foarte bună | 60ms |
| Voyage AI voyage-3 | 1024 | $0.06 | Excelentă pe domain-specific | 70ms |
| Open source (e5-large) | 1024 | $0 (self-hosted) | Bună | Depinde |

**DECIZIE: OpenAI text-embedding-3-small.**

De ce:
- $0.02/1M tokens = practic GRATIS. 500 KB entries × 200 tokens avg = 100K tokens = $0.002 total embed
- 1536 dimensiuni e suficient pentru <10K documents
- API cel mai simplu: 3 linii de cod
- Actualizare KB entry: re-embed costă $0.000004. Poți re-embed TOT KB-ul de 10x pe zi și costă $0.02
- Echipa are deja OpenAI API key (de la FlyExpert)

**Nu Cohere/Voyage** pentru că: adaugă un alt API key de gestionat, calitatea e marginal mai bună, costul e similar. Simplitate > marginal quality.

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 6: HOSTING & DEPLOYMENT
## Railway vs Render vs Fly.io vs VPS vs AWS
## ═══════════════════════════════════════════════════════

### RUNDA 1: Viziuni

**Agent C — Railway:**
- $5/mo hobby, $7/mo always-on (Pro)
- Docker deploy din GitHub (push = deploy)
- Zero cold start pe Pro plan
- Cron jobs built-in (CRM sync)
- Logs, metrics, alerting built-in
- PostgreSQL addon dacă nu vrei Supabase ($5/mo)
- Limitation: max 8GB RAM pe hobby

**Agent D — Render:**
- Free tier cu cold starts (90s sleep)
- $7/mo starter (always-on)
- Background workers ca servicii separate
- Blueprint deploys (infrastructure as code)
- Limitation: free tier e inutilizabil pentru chat (cold starts)

**Agent A — Fly.io:**
- $0/mo pentru 3 shared VMs
- Edge deployment (server aproape de user)
- Scale to zero, instant cold start (~200ms)
- Limitation: complexitate mai mare, CLI-based

**Agent E — VPS (Hetzner/DigitalOcean):**
- Hetzner CX22: €4.5/mo, 2 vCPU, 4GB RAM
- Control total, zero vendor lock-in
- Dar: tu administrezi totul (updates, security, SSL, backups)
- Nu recomandat la echipa de 3 fără DevOps dedicat

### RUNDA 2 + 3: Consens rapid

**DECIZIE: Railway Pro ($7/mo).**

Unanim (5/5). Motivele:
1. Zero cold starts (Pro plan)
2. Push-to-deploy din GitHub
3. Cron jobs pentru CRM sync
4. Suficient RAM (8GB) pentru FastAPI + in-memory cache
5. Cost minim ($7/mo)
6. Echipa nu trebuie să administreze server

**Admin Panel: Vercel ($0/mo).**
Static React SPA, deploy din GitHub, zero config.

**Widget: bundled cu admin SAU CDN separat.**
Un singur JS file (50-80KB gzipped) servit de Vercel sau CloudFlare Pages.

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 7: MESSAGE BROKER / TASK QUEUE
## Celery vs Bull vs simple background tasks vs fără
## ═══════════════════════════════════════════════════════

### RUNDA 1 + 2 + 3: Consens rapid

**Ce trebuie procesat async:**
1. CRM lead sync (POST la CRM API, retry la eșec)
2. Embedding update (re-embed KB entry → upsert Qdrant)
3. Email notifications (opțional: "new lead captured")
4. Analytics logging (conversație terminată → log metrics)

**Opțiuni:**
- **Celery + Redis:** Overkill. Celery e un framework complex pentru task queues distribuite. Avem UN server.
- **Bull + Redis (Node):** Noi suntem Python.
- **FastAPI BackgroundTasks:** Built-in, zero dependencies, suficient.
- **Supabase Edge Functions:** Pentru webhook-triggered tasks.

**DECIZIE: FastAPI BackgroundTasks + Railway Cron.**

```python
from fastapi import BackgroundTasks

@app.post("/api/chat")
async def chat(msg: ChatMessage, bg: BackgroundTasks):
    response = await process_message(msg)
    
    # Async tasks — nu blochează response
    bg.add_task(sync_lead_to_crm, lead_id=response.lead_id)
    bg.add_task(log_analytics, conv_id=msg.conversation_id)
    
    return response

# Railway Cron: retry failed CRM syncs every 5 min
@app.get("/cron/retry-crm-sync")
async def retry_crm():
    failed = await db.get_leads(crm_synced=False, retry_count__lt=5)
    for lead in failed:
        await sync_lead_to_crm(lead.id)
```

**De ce nu Celery:** un singur server, sub 50 tasks/oră. BackgroundTasks e suficient. Celery adaugă Redis dependency, worker process, monitoring — overkill.

---

## ═══════════════════════════════════════════════════════
## COMPONENTĂ 8: REAL-TIME PROTOCOL
## SSE vs WebSocket vs Supabase Realtime vs Polling
## ═══════════════════════════════════════════════════════

### RUNDA 1 + 2 + 3: Consolidare

**Două opțiuni realiste rămase după dezbaterea anterioară:**

**Opțiune 1 — SSE custom (FastAPI StreamingResponse):**
```python
@app.get("/sse/{conversation_id}")
async def sse_stream(conversation_id: str):
    async def event_generator():
        while True:
            msg = await message_queue.get(conversation_id, timeout=15)
            if msg:
                yield f"data: {json.dumps(msg)}\n\n"
            else:
                yield f": heartbeat\n\n"  # keep-alive
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```
Pro: control total, zero dependență. Contra: trebuie gestionat connection pooling manual.

**Opțiune 2 — Supabase Realtime:**
```javascript
// Widget JavaScript
const channel = supabase.channel('conv_123');
channel.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'messages',
  filter: `conversation_id=eq.conv_123`
}, (payload) => {
  addMessageToChat(payload.new);
}).subscribe();
```
Pro: zero cod server-side, Supabase gestionează totul. Contra: expune Supabase anon key în widget (securitate), dependență de Supabase uptime.

**DECIZIE: SSE custom pentru widget + Supabase Realtime pentru admin.**

De ce mix:
- **Widget (public, pe site-ul BBC):** SSE custom prin backend-ul nostru. Nu expunem NICIO cheie în widget JavaScript. Widget vorbește DOAR cu FastAPI-ul nostru.
- **Admin panel (intern, autentificat):** Supabase Realtime e OK aici — admin-ul are deja Supabase auth, cheia e protejată prin RLS, e intern. Simplifică enorm admin-ul.

---

## ═══════════════════════════════════════════════════════
## REZUMAT FINAL — TECH STACK COMPLET
## ═══════════════════════════════════════════════════════

```
┌─────────────────────────────────────────────────────────────┐
│                    TECH STACK BBC AI CHATBOT                  │
├─────────────────────┬───────────────────────────────────────┤
│ COMPONENTĂ          │ DECIZIE                               │
├─────────────────────┼───────────────────────────────────────┤
│ Database principală │ PostgreSQL (Supabase managed)         │
│                     │ Free → $25/mo Pro                     │
├─────────────────────┼───────────────────────────────────────┤
│ Vector database     │ Qdrant Cloud (primary)                │
│                     │ + pgvector în Supabase (fallback)     │
│                     │ Free tier 1GB                         │
├─────────────────────┼───────────────────────────────────────┤
│ Cache               │ In-memory TTLCache (sessions, KB)     │
│                     │ + Upstash Redis (rate limiting only)  │
│                     │ Redis free: 10K cmd/day               │
├─────────────────────┼───────────────────────────────────────┤
│ LLM primary         │ Claude Haiku (Anthropic)              │
│ LLM fallback        │ GPT-4o-mini (OpenAI)                 │
│ LLM emergency       │ Scripted responses                   │
│ LLM premium         │ Claude Sonnet (complex queries only)  │
├─────────────────────┼───────────────────────────────────────┤
│ Embedding model     │ OpenAI text-embedding-3-small         │
│                     │ 1536 dims, $0.02/1M tokens            │
├─────────────────────┼───────────────────────────────────────┤
│ Backend framework   │ FastAPI (Python)                      │
│ Backend hosting     │ Railway Pro ($7/mo, always-on)        │
├─────────────────────┼───────────────────────────────────────┤
│ Admin panel         │ React + TypeScript + Tailwind         │
│ Admin hosting       │ Vercel ($0/mo)                        │
├─────────────────────┼───────────────────────────────────────┤
│ Widget              │ React bundle, CSS scoped              │
│ Widget hosting      │ Vercel/CloudFlare Pages ($0/mo)       │
├─────────────────────┼───────────────────────────────────────┤
│ Real-time (widget)  │ SSE custom (FastAPI)                  │
│ Real-time (admin)   │ Supabase Realtime                     │
├─────────────────────┼───────────────────────────────────────┤
│ Task queue          │ FastAPI BackgroundTasks                │
│                     │ + Railway Cron (retry jobs)            │
├─────────────────────┼───────────────────────────────────────┤
│ Monitoring          │ Sentry (errors) + Uptime Robot (ping) │
│ CDN/DDoS            │ CloudFlare (site + admin only)        │
│ CRM integration     │ Async sync via background tasks       │
├─────────────────────┼───────────────────────────────────────┤
│ COST TOTAL LUNAR    │                                       │
│ Railway             │ $7                                    │
│ Supabase            │ $0-25                                 │
│ Qdrant              │ $0                                    │
│ Upstash Redis       │ $0                                    │
│ Vercel              │ $0                                    │
│ Claude API          │ $50-200                               │
│ OpenAI Embeddings   │ $1-2                                  │
│ Sentry              │ $0                                    │
│ ─────────────────── │ ──────────                            │
│ TOTAL               │ $58-234/mo                            │
│ Break-even          │ 1 converted lead                      │
├─────────────────────┴───────────────────────────────────────┤
│                                                              │
│  PRINCIPIU CHEIE:                                            │
│  Widget → FastAPI → (Claude/Qdrant/Supabase)                │
│  ZERO chei API în frontend. TOTUL prin backend.              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### FALLBACK CHAIN COMPLETĂ

```
                    ┌─────────┐
                    │ REQUEST │
                    └────┬────┘
                         │
              ┌──────────▼──────────┐
              │ Intent Detection    │
              │ (Regex, 1ms, $0)    │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │ KB Search           │
              │ Qdrant (50ms, $0)   │──fail──▶ pgvector (10ms, $0)
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │ Response Gen        │
              │ Scripted? ─────yes──▶ Template ($0, 1ms)
              │    │ no             │
              │ Simple? ──────yes──▶ Haiku ($0.001, 300ms)
              │    │ no             │
              │ Complex? ────yes──▶ Sonnet ($0.015, 1500ms)
              └──────────┬──────────┘
                         │ LLM fail?
              ┌──────────▼──────────┐
              │ Claude down?        │
              │ ──yes──▶ GPT-4o-mini│
              │ GPT down?           │
              │ ──yes──▶ Scripted   │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │ Safety Check        │
              │ (Regex, 1ms, $0)    │
              └──────────┬──────────┘
                         │
                    ┌────▼─────┐
                    │ RESPONSE │
                    └──────────┘
```

---

*Fiecare decizie a fost dezbătută cu argumente pro/contra concrete.
Stack-ul e optimizat pentru: echipă de 3, buget $50-250/mo, 500-5000 conversații/lună, zero DevOps dedicat.*
