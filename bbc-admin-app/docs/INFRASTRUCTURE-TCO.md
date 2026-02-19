# ANALIZĂ DEEP: INFRASTRUCTURĂ BBC AI CHATBOT
## Total Cost of Ownership pe 3 Ani · Fiecare Componentă Exhaustiv
## Mentenanță · Scalare · Failure Modes · Migration · DevOps Reality

---

## PRINCIPIU DIRECTOR

Nu alegem ce e "cel mai bun". Alegem ce **nu ne va crea probleme în următorii 3 ani** cu o echipă de 3 oameni care au și alte proiecte. Fiecare componentă trebuie evaluată pe:

1. **Setup time** — cât durează de la zero la funcțional
2. **Mentenanță lunară** — câte ore/lună consumă DUPĂ setup
3. **Failure mode** — ce se întâmplă când pică, cât durează recovery
4. **Scaling path** — ce facem când traficul crește 10x
5. **Migration cost** — cât de greu e să migrăm AWAY dacă nu mai merge
6. **Knowledge requirement** — ce trebuie să știe echipa
7. **Cost pe 3 ani** — nu doar lunar, ci total cu surprize

---

## ═══════════════════════════════════════════════════════
## 1. BAZA DE DATE PRINCIPALĂ
## Analiza exhaustivă: 8 opțiuni
## ═══════════════════════════════════════════════════════

### 1.1 PostgreSQL self-hosted (DigitalOcean Droplet / Hetzner VPS)

**Setup:** 4-8 ore (install, configure, SSL, backups, monitoring)
**Cost:** €4.50-10/mo (VPS) + 2-4 ore/lună mentenanță
**Ce faci lunar:**
- Verifici backup-urile (funcționează? pot fi restaurate?)
- Actualizezi PostgreSQL patches (securitate)
- Monitorizezi disk space (WAL logs cresc)
- Verifici slow queries (pg_stat_statements)
- Gestionezi connection pooling (PgBouncer)

**Failure mode:** Dacă VPS-ul pică → DB e offline. Recovery: 10-30 min dacă ai snapshot. Dacă disk-ul moare fără backup → **pierzi totul**. Probabilitate disk failure pe Hetzner: ~0.5%/an.

**Scaling 10x:** Trebuie VPS mai mare, posibil read replicas. Tu configurezi manual. Downtime la migration: 5-30 min.

**Migration away:** pg_dump → import oriunde. PostgreSQL e cel mai portabil. Cost: 1-2 ore.

**Verdict: EXCELENT tehnic, PROST operațional.** La echipa de 3, nimeni nu vrea să fie DBA la 2 AM când pică.

---

### 1.2 Supabase (PostgreSQL managed)

**Setup:** 30 min (create project, run migrations, done)
**Cost:**
- Free: 500MB, 2 projects, 50K rows, 500MB bandwidth
- Pro ($25/mo): 8GB, unlimited rows, 250GB bandwidth, daily backups
- Team ($599/mo): priority support, SOC2, 99.9% SLA

**Ce faci lunar pe Pro:**
- Aproape nimic. Backups automate. Updates automate.
- Verifici usage dashboard (approaching limits?)
- Occasional: review RLS policies dacă adaugi features
- ~30 min/lună

**Failure mode:** Supabase outage. Istoric 2024: 3 incidente majore, cel mai lung 4 ore. Pe free tier, outage-urile sunt mai frecvente. Pe Pro, SLA 99.9% = max 8.7 ore downtime/an.

Recovery: nu depinde de tine. Aștepți Supabase. Poți avea pg_dump periodic ca backup extern.

**Scaling 10x:**
- Free → Pro: click + card, zero downtime
- Pro la 50K conversații/lună: probabil suficient (8GB)
- Pro la 500K conversații/lună: trebuie Team ($599/mo) sau self-hosted
- Connection pooling: built-in via Supavisor

**Migration away:**
- pg_dump funcționează normal (e PostgreSQL standard)
- Dar: dacă folosești Supabase Auth, Realtime, Edge Functions, Storage → sunt PROPRIETARE. Migrezi DB-ul dar pierzi auth + realtime + functions. Trebuie reconstruite.
- Cost real de migration: 2-5 zile development

**Gotchas pe care nimeni nu le menționează:**
- Free tier: DB se pune pe pauză după 1 săptămână inactivitate. Prima query = 5-10 secunde cold start.
- Pro tier: always-on, dar connection limit = 60 direct + 200 pooled. La 100+ conexiuni simultane widget SSE, poți atinge limita.
- Supabase Realtime consumă din bandwidth limit. La 5000 conversații cu admin + widget subscriptions, 250GB bandwidth pe Pro poate fi insuficient.
- Edge Functions au cold start de 200-500ms. Nu le folosi pe critical path (chat response).

**Proiecție cost 3 ani:**
```
Anul 1: Free 6 luni + Pro 6 luni = $150
Anul 2: Pro 12 luni = $300
Anul 3: Pro 12 luni = $300 (sau Team dacă crește = $7,188)
─────────────────────────────────────────────
Total 3 ani (scenariu normal): $750
Total 3 ani (crește mult): $7,638
```

---

### 1.3 Neon (PostgreSQL serverless)

**Setup:** 20 min
**Cost:**
- Free: 512MB, 1 project, branching
- Launch ($19/mo): 10GB, autoscaling, branching
- Scale ($69/mo): 50GB, read replicas

**Ce faci lunar:** Aproape nimic. Serverless = scale to zero, zero administrare.

**Failure mode:** Neon e mai nou decât Supabase (founded 2022). Mai puțin battle-tested. Outage history: mai puțin transparent decât Supabase.

**Avantaj unic: Database Branching.** Poți crea o "copie" a DB-ului pentru testing fără a afecta producția. Ca un git branch pentru date. Extraordinar pentru development.

**Dezavantaj:** Nu are Auth, Realtime, Edge Functions, Storage. E DOAR database. Trebuie alte servicii pentru restul.

**Migration away:** pg_dump standard. Zero lock-in pe DB level.

**Proiecție cost 3 ani:**
```
Anul 1: Free 6 luni + Launch 6 luni = $114
Anul 2: Launch = $228
Anul 3: Launch sau Scale = $228-$828
──────────────────────────────────────
Total 3 ani (normal): $570
Total 3 ani (crește): $1,170
```

---

### 1.4 PlanetScale (MySQL serverless)

**Setup:** 20 min
**Cost:** $39/mo Scaler (free tier eliminat în 2024)
**Dezavantaj fatal:** MySQL fără foreign keys (Vitess). Branching e superb dar lipsa FK-urilor = risc de orphan data.
**Dezavantaj #2:** MySQL, nu PostgreSQL. pgvector nu funcționează. Pierdem fallback vector search.
**Migration away:** mysqldump, dar trebuie rescris ORM-ul dacă migrezi la PostgreSQL.

**Verdict: ELIMINAT.** $39/mo minim + MySQL + no FK = nu merită.

---

### 1.5 MongoDB Atlas

**Setup:** 15 min
**Cost:**
- Free: 512MB shared cluster
- Dedicated ($57/mo): 10GB, dedicated, backups
- Serverless: $0.10/1M reads

**Ce faci lunar:** Verifici index-uri, monitorizezi slow queries.

**Failure mode:** MongoDB Atlas e foarte stabil (99.995% SLA pe dedicated). Dar: NoSQL = tu gestionezi consistența datelor la nivel de cod.

**Problemă fundamentală pentru BBC:** Datele noastre SUNT relaționale:
```
Conversation HAS MANY Messages
Conversation HAS ONE Lead
Agent IS ASSIGNED TO Conversation
KB Entry BELONGS TO Category
```
Modelarea asta în MongoDB = embedded documents + references. Funcționează, dar:
- Queries complexe (all leads with score > 80 from conversations this week) → aggregation pipeline complex
- Update-uri atomice cross-document → nu garantate
- Joins → $lookup, semnificativ mai lent decât SQL JOIN

**Proiecție cost 3 ani:**
```
Free 6 luni + Dedicated 30 luni = $1,710
```

**Verdict: ELIMINAT.** Datele sunt relaționale, MongoDB adaugă complexitate fără beneficiu.

---

### 1.6 Firebase Firestore

**Setup:** 10 min
**Cost:**
- Free: 1GB, 50K reads/day, 20K writes/day
- Blaze (pay-as-you-go): $0.06/100K reads, $0.18/100K writes

**Avantaj:** Real-time nativ, offline support, perfect pentru chat.
**Dezavantaj fatal:** Vendor lock-in Google maxim. Nu poți face pg_dump. Queries limitate (no JOIN, no aggregation complexă, nu poți face "average response time" fără Cloud Functions). Admin dashboard devine NIGHTMARE.
**Dezavantaj #2:** Nu ai pgvector. Trebuie alt serviciu pentru vector search.
**Dezavantaj #3:** Pricing impredictibil. 5000 conversații × 8 mesaje × 2 reads (widget + admin) = 80K reads/zi = depășești free tier rapid.

**Proiecție cost 3 ani la 5K conv/mo:**
```
~150K reads/day, ~50K writes/day
Reads: 150K × 30 × $0.06/100K × 36 mo = $97
Writes: 50K × 30 × $0.18/100K × 36 mo = $97
Cloud Functions: ~$5-10/mo × 36 = $180-360
──────────────────────────────────────────
Total: $374-554 (dar vendor lock-in TOTAL)
```

**Verdict: ELIMINAT.** Lock-in + queries slabe pentru admin = no.

---

### 1.7 CockroachDB Serverless

**Setup:** 20 min
**Cost:** Free (10GB, 50M request units/mo) → $0.20/1M extra
**Avantaj:** PostgreSQL-compatible, distributed, zero downtime migrations
**Dezavantaj:** Latency mai mare decât PostgreSQL nativ (~5-15ms vs ~1-5ms). pgvector NU e suportat. Over-engineered pentru scala noastră.

**Verdict: ELIMINAT.** Over-engineered, fără pgvector.

---

### 1.8 Turso (SQLite la edge, libSQL)

**Setup:** 15 min
**Cost:** Free (9GB, 500 locations) → $29/mo Scaler
**Avantaj:** SQLite-compatible, edge replicas, ultra-low latency
**Dezavantaj:** SQLite nu are tipuri rigide, nu are pgvector, ecosystem mic. Relativ nou (2023). Riscant pentru producție.

**Verdict: ELIMINAT.** Prea nou, fără vector support.

---

### DECIZIE FINALĂ BAZA DE DATE

| Criteriu | Supabase | Neon | Self-hosted PG |
|----------|----------|------|----------------|
| Setup | 30 min ✅ | 20 min ✅ | 4-8 ore ⚠️ |
| Mentenanță/lună | 30 min ✅ | 20 min ✅ | 3-4 ore ❌ |
| Auth built-in | ✅ | ❌ | ❌ |
| Realtime built-in | ✅ | ❌ | ❌ |
| pgvector | ✅ | ✅ | ✅ |
| Cost 3 ani | $750 | $570 | $486 + timp |
| Failure recovery | Aștepți Supabase | Aștepți Neon | Tu fixezi |
| Migration cost | 2-5 zile (auth lock-in) | 1-2 ore | 1-2 ore |
| Scalare 10x | Click upgrade | Auto | Manual, downtime |
| SLA | 99.9% (Pro) | 99.95% | Depinde de tine |

**CÂȘTIGĂTOR: Supabase Pro** pentru că Auth + Realtime economisesc 2-3 săptămâni de development care altfel ar fi petrecute implementând autentificare și real-time de la zero. Lock-in-ul pe Auth/Realtime e un risc acceptat conștient.

**BACKUP PLAN:** pg_dump zilnic automat (Supabase Pro include) + export săptămânal la S3/R2. Dacă Supabase moare, migrăm la Neon în 2 ore (DB) + 5 zile (rebuild auth + realtime).

---

## ═══════════════════════════════════════════════════════
## 2. VECTOR DATABASE
## Analiza exhaustivă: 7 opțiuni
## ═══════════════════════════════════════════════════════

### 2.1 Qdrant Cloud

**Setup:** 15 min (create cluster, create collection, done)
**Cost:**
- Free: 1GB RAM, 1 node, always-on
- Starter ($25/mo): 4GB RAM, backups
- Business ($100+/mo): HA, multi-node

**Mentenanță lunară:** ~0. Managed complet. Verifici dashboard ocazional.

**Performance:**
- Search latency: 5-15ms la 10K vectors, 20-50ms la 100K
- Throughput: 1000+ queries/sec pe free tier
- Hybrid search (dense + sparse) în aceeași query

**Failure mode:**
- Free tier: single node. Dacă nodul pică → downtime 5-30 min (auto-recovery)
- Starter: backups, dar tot single node
- Business: multi-node, zero downtime

**Gotchas:**
- Free tier: RAM-only, nu persistă pe disk. Restart = pierdere date dacă nu ai backup extern. **FALS** — Qdrant Cloud free tier ARE persistence pe disk. Doar self-hosted Docker default e in-memory.
- Collection size limit pe free: 1GB RAM ≈ 500K vectors cu 1536 dims. Mai mult decât suficient (noi avem 500).
- Qdrant Cloud e hosted în EU (Frankfurt) sau US. Latency din Moldova: ~50ms la Frankfurt, ~150ms la US.

**Scaling 10x (5000 KB entries):**
- Free tier: suficient. 5000 × 1536 dims × 4 bytes = ~30MB. Sub 1% din 1GB limit.
- Abia la 50,000+ entries trebuie Starter plan.

**Migration away:**
- Export: `GET /collections/{name}/points` → JSON dump
- Import: orice alt vector DB acceptă JSON cu vectors
- Cost: 2-4 ore script de migrare

**Proiecție cost 3 ani:**
```
Scenariu normal (<5K entries): Free 36 luni = $0
Scenariu creștere (5K-50K): Free 24 luni + Starter 12 luni = $300
──────────────────────────────────────────────
Total 3 ani: $0-300
```

---

### 2.2 Pinecone

**Setup:** 10 min (cel mai simplu API din industrie)
**Cost:**
- Free (Starter): 100K vectors, 1 index, 2GB storage
- Standard ($70/mo): 1M vectors, 5 indexes
- Enterprise: custom

**Mentenanță lunară:** ~0. Cel mai managed din toate.

**Performance:**
- Search latency: 10-50ms (serverless has cold starts!)
- **PROBLEMA CRITICĂ: Serverless cold starts.** Free tier e serverless. Dacă nu ai query 5 min → primul query = 2-5 secunde. La un chatbot, asta e FATAL.

**Gotchas:**
- Free tier: serverless ONLY. Nu poți alege always-on fără Standard ($70/mo).
- Metadata filtering pe Free: limitat la 40KB metadata per vector.
- Namespace-uri: utile pentru multi-tenant, dar noi nu avem nevoie.
- **Vendor lock-in MAXIM**: proprietar, nu poți self-host, export e posibil dar format proprietar.

**Migration away:**
- Fetch all vectors: posibil dar lent (paginated, max 1000/request)
- Cost: 4-8 ore script + re-index la destinație

**Proiecție cost 3 ani:**
```
Free (dacă tolerezi cold starts): $0
Standard (dacă nu): $70 × 36 = $2,520
──────────────────────────────────
Total: $0 (inutilizabil) sau $2,520
```

**Verdict:** Cold starts pe free tier = eliminat pentru chatbot real-time. Standard la $70/mo = prea scump vs Qdrant free.

---

### 2.3 pgvector (extensie PostgreSQL în Supabase)

**Setup:** 5 min (`CREATE EXTENSION vector; ALTER TABLE ADD COLUMN embedding vector(1536);`)
**Cost:** $0 suplimentar (inclus în Supabase)

**Mentenanță lunară:** ~0. E parte din DB.

**Performance:**
- Search latency: 5-20ms la 500 entries (sequential scan OK la scale mică)
- Throughput: depinde de Supabase plan. La Pro, ~500 queries/sec pe vector search
- La 10K+ entries FĂRĂ index HNSW: degradează la 100-500ms
- Cu HNSW index: 10-30ms la 100K entries, dar index-ul consumă RAM

**Gotchas:**
- HNSW index rebuild la fiecare insert = lent. Cu ivfflat e mai rapid dar less accurate.
- Nu are hybrid search nativ (trebuie 2 queries: unul vector, unul full-text, apoi merge manual)
- Supabase free tier: 500MB include vectori. 500 entries × 1536 dims × 4 bytes = 3MB. Plenty.
- Connection pooling de la Supabase afectează performance pe vector queries (prepared statements nu se cachează prin pooler)

**Scaling 10x:**
- La 5000 entries: OK cu HNSW index
- La 50K entries: performance degradează, trebuie dedicated vector DB
- Nu are payload filtering optimizat (WHERE + ORDER BY vector distance = slow)

**Migration away:** N/A — e PostgreSQL, migrezi cu tot DB-ul.

**Proiecție cost 3 ani:** $0 suplimentar.

---

### 2.4 Weaviate Cloud

**Setup:** 20 min
**Cost:**
- Sandbox (free): 100K objects, 14 zile TTL (se ȘTERGE după 14 zile!) 
- Serverless: $0.055/1M vector dims stored/mo
- Dedicated ($25/mo): 100K objects, persistent

**PROBLEMA CRITICĂ:** Free tier se șterge la 14 zile. E doar pentru testing. Minimum $25/mo pentru producție.

**Avantaj:** Module de auto-embedding (nu trebuie să apelezi OpenAI separat — Weaviate face embed la insert). GraphQL API puternic.

**Dezavantaj:** GraphQL e complex pentru queries simple. Over-engineered pentru 500 entries.

**Proiecție cost 3 ani:** $25 × 36 = $900 minim.

**Verdict:** Eliminat pe cost.

---

### 2.5 Milvus (Zilliz Cloud)

**Setup:** 20 min
**Cost:**
- Free: 2 collections, 1M vectors (generos!)
- Standard ($65/mo): unlimited

**Performance:** Cel mai rapid la scale mare (1M+ vectors). Dar la 500 vectors = overkill.

**Dezavantaj:** API mai complex decât Qdrant/Pinecone. Python client are mai multe dependențe. Comunitate mai mică.

**Proiecție cost 3 ani:** $0 pe free tier (1M vectors e enorm pentru noi).

**Verdict:** Fezabil, dar Qdrant are hybrid search mai bun și comunitate mai mare.

---

### 2.6 ChromaDB (self-hosted)

**Setup:** 10 min local, 1-2 ore producție (Docker)
**Cost:** $0 (open source) + cost hosting ($5-10/mo VPS)

**Mentenanță lunară:** 1-2 ore. Updates, monitoring, backup-uri.

**Gotchas:**
- Persistence: by default e in-memory. Trebuie configurat explicit pentru disk.
- Scale: degradează după 50K documents. OK pentru noi.
- Nu are cloud managed serios. ChromaDB Cloud e în waitlist.
- FlyExpert îl folosește — echipa știe API-ul.

**Dezavantaj MAJOR:** Self-hosted = tu administrezi. Plus: nu are hybrid search, nu are payload filtering avansat.

**Proiecție cost 3 ani:** $5/mo hosting × 36 = $180 + 1-2h/lună mentenanță × 36 = 36-72 ore timp.

**Verdict:** Familiar dar self-hosted = eliminat (echipă de 3, zero DevOps dedicat).

---

### 2.7 Typesense (alternativă search engine cu vector support)

**Setup:** 15 min (Typesense Cloud)
**Cost:**
- Free tier: nu există
- Cheapest: $29.95/mo (8GB RAM)

**Avantaj:** Full-text search + vector search + typo tolerance + faceting. Tot ce ai nevoie într-un singur serviciu.

**Dezavantaj:** $30/mo minim pentru ceva ce Qdrant face gratuit. Overqualified.

**Verdict:** Eliminat pe cost.

---

### DECIZIE FINALĂ VECTOR DATABASE

| Criteriu | Qdrant Cloud | pgvector | Pinecone | Milvus |
|----------|-------------|----------|----------|--------|
| Cost 3 ani | $0-300 ✅ | $0 ✅ | $0-2520 ❌ | $0 ✅ |
| Cold starts | ❌ No ✅ | ❌ No ✅ | ✅ Da ❌ | ❌ No ✅ |
| Hybrid search | ✅ Nativ | ❌ Manual | ❌ Nu | ⚠️ Limitat |
| Mentenanță | ~0 ✅ | ~0 ✅ | ~0 ✅ | ~0 ✅ |
| Performance | Excelent | OK (<5K) | Bun | Excelent |
| Migration | Ușor | N/A | Greu | Mediu |
| Payload filters | ✅ Puternic | ⚠️ WHERE | ⚠️ Limitat free | ✅ Bun |

**CÂȘTIGĂTOR: Qdrant Cloud (primary) + pgvector (fallback).**

Strategie pe 3 ani:
```
Anul 1: Qdrant free (500 entries). pgvector ca fallback pasiv.
Anul 2: Qdrant free (2000 entries). Încă sub limita de 1GB.
Anul 3: Dacă KB crește la 10K+ entries → Qdrant Starter ($25/mo).
         Dacă nu crește → rămâne free.
```

---

## ═══════════════════════════════════════════════════════
## 3. CACHE & SESSION STORE
## Analiza exhaustivă: 6 opțiuni
## ═══════════════════════════════════════════════════════

### 3.1 Upstash Redis (serverless)

**Cost:** Free (10K commands/day, 256MB) → Pro ($10/mo, 10M commands/day)
**Latency:** 1-5ms (edge, în aceeași regiune)
**Use case pentru BBC:** Rate limiting (persistent între deploys), session tokens
**Mentenanță:** ~0
**Gotcha:** 10K commands/day pe free. Fiecare mesaj de chat = ~5 Redis commands (rate check, session read, session write, presence update, message count). 10K / 5 = 2000 mesaje/zi. La 5000 conversații/lună cu 8 mesaje = 40K mesaje/lună = ~1333/zi. **Încape în free tier cu marja mică.** La creștere, trebuie Pro.

**Proiecție cost 3 ani:**
```
Anul 1: Free (suficient la 5K conv/mo) = $0
Anul 2-3: Probabil Pro ($10/mo) = $240
Total: $0-240
```

---

### 3.2 Redis self-hosted (Docker pe Railway)

**Cost:** $0 suplimentar (rulează în același container sau addon Railway $5/mo)
**Latency:** <1ms (localhost)
**Mentenanță:** Updates, monitoring RAM usage. 1-2 ore setup, 30 min/lună.
**Gotcha:** Railway addon Redis: $0.30/GB/mo. La 256MB = $0.08/mo ≈ gratuit.

---

### 3.3 Dragonfly (Redis-compatible, mai eficient)

**Cost:** Dragonfly Cloud: $15/mo minim. Self-hosted: free.
**Avantaj:** 25x mai eficient pe memorie decât Redis. La 256MB Redis = 10MB Dragonfly.
**Dezavantaj:** Cloud e scump. Self-hosted = tu administrezi. Over-engineered pentru scala noastră.

**Verdict:** Eliminat. Over-engineered.

---

### 3.4 KeyDB (Redis fork, multi-threaded)

**Cost:** Self-hosted only, free.
**Avantaj:** Mai rapid decât Redis pe multi-core.
**Dezavantaj:** Nu are cloud managed. Self-hosted = no.

**Verdict:** Eliminat.

---

### 3.5 Valkey (Linux Foundation Redis fork)

**Cost:** Self-hosted, free. Cloud: prin AWS ElastiCache.
**Context:** Fork-ul open-source după ce Redis a schimbat licența în 2024.
**Dezavantaj:** Prea nou (2024), nu are cloud managed independent.

**Verdict:** Eliminat. Prea nou.

---

### 3.6 In-memory Python (fără serviciu extern)

**Cost:** $0
**Latency:** Nanosecunde
**Mentenanță:** Zero
**Problema:** Se resetează la deploy. Rate limits pierdute. Sessions pierdute.
**Soluție:** E OK pentru session context (se reconstruiește din DB). NU e OK pentru rate limiting (resetare = vulnerability).

---

### DECIZIE FINALĂ CACHE

**CÂȘTIGĂTOR: Upstash Redis (rate limiting) + In-memory TTLCache (sessions, KB cache).**

```
Rate limiting       → Upstash Redis (persistent, 10K cmd/day free)
Session context     → In-memory TTLCache (ephemeral, OK)
KB response cache   → In-memory TTLCache (1 hour TTL)
Agent presence      → In-memory dict (rebuild la restart din DB)
```

**Proiecție cost 3 ani:** $0-240 (probabil $0 anul 1, $120 anii 2-3).

---

## ═══════════════════════════════════════════════════════
## 4. LLM PROVIDER & MODEL
## Analiza exhaustivă: 10 opțiuni
## ═══════════════════════════════════════════════════════

### 4.1 Claude Haiku 3.5 (Anthropic)

**Cost:** $0.80/1M input, $4/1M output (Haiku 3.5, prețuri februarie 2025)
**Per conversație (8 mesaje, ~400 tokens input avg, ~150 tokens output avg):**
- 8 × 400 × $0.80/1M = $0.00256 input
- 8 × 150 × $4/1M = $0.0048 output
- **Total: ~$0.007/conversație**
**La 5K conv/lună: $35/mo**

**Calitate:** Excelentă pe instrucțiuni complexe. Urmărește system prompt strict.
**Latency:** TTFT 300-500ms, full response 1-2s
**Rate limits:** 50 requests/min pe tier 1 ($5 spent). 1000/min pe tier 3 ($400 spent).
**SDK:** `anthropic` Python, streaming nativ, async support.

---

### 4.2 Claude Sonnet 3.5/4 (Anthropic)

**Cost:** $3/1M input, $15/1M output
**Per conversație: ~$0.03/conversație**
**La 5K conv/lună: $150/mo**

**Calitate:** Cea mai bună pe piață pentru conversational AI.
**Use case:** Doar pentru întrebări complexe, nu default.

---

### 4.3 GPT-4o-mini (OpenAI)

**Cost:** $0.15/1M input, $0.60/1M output
**Per conversație: ~$0.001/conversație**
**La 5K conv/lună: $5/mo** (FOARTE ieftin)

**Calitate:** Bună, dar: hallucinează mai mult pe domain-specific, urmărește system prompt mai slab, stil mai generic.
**Latency:** TTFT 200-400ms (cel mai rapid)
**Rate limits:** 500 requests/min pe tier 1.
**SDK:** `openai` Python, cel mai matur.

---

### 4.4 GPT-4o (OpenAI)

**Cost:** $2.50/1M input, $10/1M output
**Per conversație: ~$0.025/conversație**
**La 5K conv/lună: $125/mo**

**Calitate:** Comparabilă cu Claude Sonnet. Function calling mai bun.
**Use case:** Alternativă la Sonnet dacă Claude pică.

---

### 4.5 Gemini 2.0 Flash (Google)

**Cost:** FREE tier: 15 requests/min, 1M tokens/day. Paid: $0.10/1M input, $0.40/1M output.
**Per conversație: ~$0.001/conversație** (mai ieftin decât GPT-4o-mini!)
**La 5K conv/lună pe free tier: $0/mo** (dacă sub 1M tokens/day)

**Calitate:** Bună, competitivă cu GPT-4o-mini. Multimodal.
**Gotcha:** Free tier interzis pentru producție? TOS-ul Google e ambiguu. Paid tier e explicit OK.
**Latency:** Rapid, comparabil cu GPT-4o-mini.
**SDK:** `google-generativeai` Python, mai puțin matur.

---

### 4.6 Llama 3.1 70B via Groq

**Cost:** $0.59/1M input, $0.79/1M output
**Per conversație: ~$0.002/conversație**
**La 5K conv/lună: $10/mo**

**Avantaj:** Cel mai rapid (500+ tokens/sec, instant TTFT).
**Dezavantaj:** Calitate sub Claude/GPT pe conversational. Groq e un startup — longevity risc.
**Rate limits:** 30 requests/min pe free tier. Limitat.

---

### 4.7 Llama 3.1 via Together.ai

**Cost:** $0.88/1M input, $0.88/1M output
**Per conversație: ~$0.003/conversație**
**Avantaj:** Stabil, SLA bun.
**Dezavantaj:** Calitate sub Claude/GPT.

---

### 4.8 Mistral Large via Mistral API

**Cost:** $2/1M input, $6/1M output
**Per conversație: ~$0.012/conversație**
**Calitate:** Bună pe European languages. Server-e în EU (Paris).
**Dezavantaj:** Calitate sub Claude Sonnet. Mai scump decât Haiku.

---

### 4.9 DeepSeek v3

**Cost:** $0.27/1M input, $1.10/1M output
**Per conversație: ~$0.003/conversație**
**Avantaj:** Foarte ieftin, calitate comparabilă cu GPT-4o.
**Dezavantaj MAJOR:** Companie chineză. Date trec prin servere în China. La un chatbot care procesează PII (email, telefon, rute de travel ale C-suite) = INACCEPTABIL din perspectiva compliance. Unii clienți corporate au politici explicite anti-China data routing.

**Verdict:** Eliminat pe compliance/privacy.

---

### 4.10 OpenRouter (aggregator — acces la TOATE modelele)

**Cost:** Markup 0-5% peste prețul providerului original.
**Avantaj UNIC:** Un singur API key pentru Claude, GPT, Gemini, Llama, Mistral. Fallback automat. Model switching fără schimbare de cod. Echipa BBC deja îl folosește în QM system.
**Dezavantaj:** Extra hop = +20-50ms latency. Dacă OpenRouter pică, totul pică (single point of failure pe aggregator).
**SDK:** OpenAI-compatible API. Schimbi doar base_url și model string.

---

### DECIZIE FINALĂ LLM

**CÂȘTIGĂTOR: Direct API calls (Anthropic + OpenAI) — NU prin OpenRouter.**

De ce nu OpenRouter: adaugă latency, adaugă un SPOF, prețul e similar. Direct API = mai fiabil.

**Fallback chain:**
```
Tier 1: Claude Haiku 3.5 ($0.007/conv, ~$35/mo)
  → Calitate excelentă, cost acceptabil
  → 90% din conversații

Tier 2: GPT-4o-mini ($0.001/conv, ~$5/mo)
  → Fallback dacă Claude pică
  → <5% din conversații

Tier 3: Claude Sonnet ($0.03/conv, ~$15/mo extra)
  → Doar conversații complexe (intent="complex", confidence<0.7)
  → ~5% din conversații

Tier 4: Scripted responses ($0)
  → Emergency fallback: ambii provideri pică
  → <1% din conversații
```

**Cost estimat lunar:**
```
Haiku (90% × 5000 = 4500 conv): 4500 × $0.007 = $31.50
Sonnet (5% × 5000 = 250 conv): 250 × $0.03 = $7.50
GPT fallback (5%): ~$2.50
─────────────────────────────────────────
Total AI cost: ~$41.50/mo la 5K conv
```

**Proiecție cost 3 ani:**
```
Anul 1 (ramp up, 2K avg conv/mo): ~$200
Anul 2 (5K conv/mo): ~$500
Anul 3 (10K conv/mo): ~$1,000
────────────────────────────────────
Total AI 3 ani: ~$1,700
```

---

## ═══════════════════════════════════════════════════════
## 5. EMBEDDING MODEL
## Analiza exhaustivă: 6 opțiuni
## ═══════════════════════════════════════════════════════

| Model | Dims | Cost/1M tok | Batch? | Quality (MTEB) |
|-------|------|-------------|--------|-----------------|
| OpenAI text-embedding-3-small | 1536 | $0.02 | ✅ | 62.3% |
| OpenAI text-embedding-3-large | 3072 | $0.13 | ✅ | 64.6% |
| Cohere embed-v3 | 1024 | $0.10 | ✅ | 64.5% |
| Voyage AI voyage-3 | 1024 | $0.06 | ✅ | 67.2% |
| Google embedding-001 | 768 | FREE | ✅ | 63.1% |
| Jina v3 | 1024 | $0.02 | ✅ | 65.5% |

**La scala noastră (500 entries × 200 tokens average):**
- Total embed: 100K tokens = o singură dată
- Cost OpenAI small: $0.002 (DOUĂ MIIMI DE CENT)
- Cost la re-embed zilnic tot KB: $0.002 × 365 = $0.73/AN

**La orice scală realistă (chiar 50K entries), costul embedding e NEGLIJABIL.**

**DECIZIE: OpenAI text-embedding-3-small.**
- Cel mai simplu API
- Echipa are deja API key
- Calitatea e suficientă (diferența de 2-5% pe MTEB benchmark e invizibilă la 500 docs)
- $0.73/an chiar cu re-embed zilnic

---

## ═══════════════════════════════════════════════════════
## 6. BACKEND HOSTING
## Analiza exhaustivă: 8 opțiuni
## ═══════════════════════════════════════════════════════

### Matrice comparativă completă

| Criteriu | Railway | Render | Fly.io | Hetzner VPS | DigitalOcean | AWS ECS | Google Cloud Run | Vercel |
|----------|---------|--------|--------|-------------|-------------|---------|-----------------|--------|
| Cost minim | $5/mo | $7/mo | $0 | €4.50/mo | $5/mo | ~$15/mo | $0 (pay per use) | $0 (serverless) |
| Always-on | ✅ Pro $7 | ✅ $7 | ✅ $0 | ✅ | ✅ | ✅ | ❌ cold starts | ❌ cold starts |
| Deploy | Git push | Git push | CLI | SSH manual | CLI/UI | Complex | gcloud CLI | Git push |
| Docker | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ nativ | ✅ | ❌ |
| Cron jobs | ✅ built-in | ❌ | ❌ | crontab | ❌ | CloudWatch | Cloud Scheduler | ✅ |
| SSE support | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ via ALB | ⚠️ 15 min limit | ❌ 10s limit |
| Logs | ✅ | ✅ | ✅ CLI | manual | ✅ | CloudWatch | Cloud Logging | ✅ |
| Max RAM | 8GB hobby, 32GB Pro | 512MB free, custom paid | 256MB free | 4-64GB | 1-192GB | Custom | 32GB | 1GB |
| SSL | auto | auto | auto | manual/certbot | auto | manual/ACM | auto | auto |
| Mentenanță/lună | 0-15 min | 0-15 min | 30 min | 3-4 ore | 1-2 ore | 2-3 ore | 30 min | 0 min |
| Cold start | ❌ none (Pro) | ❌ none ($7) | ~200ms | ❌ none | ❌ none | ❌ none | 1-5s ❌ | 5-10s ❌ |

**SSE SUPPORT e CRITIC.** Eliminăm orice nu suportă long-running SSE:
- ❌ Vercel: funcții serverless, max 10s execution pe hobby, 60s pe Pro. Imposibil pentru SSE chat.
- ❌ Google Cloud Run: max request duration 60 min, dar min instances = 0 by default = cold starts. Min instances ≥ 1 = $15+/mo.
- ⚠️ AWS ECS: funcționează dar setup complex (VPC, ALB, task definitions, ECR). 2-3 zile setup. Over-engineered.

**Rămân:** Railway, Render, Fly.io, Hetzner VPS, DigitalOcean.

**Eliminăm VPS-urile:** Hetzner + DO necesită administrare server (updates, security, SSL, firewall, monitoring). Echipa de 3 nu are timp. Economisești $2/mo dar pierzi 3-4 ore/lună.

**Top 3 finalist:**

| Criteriu | Railway Pro | Render Starter | Fly.io |
|----------|-------------|---------------|--------|
| Cost | $7/mo | $7/mo | $3-5/mo |
| Git deploy | ✅ | ✅ | ❌ CLI-based |
| Cron built-in | ✅ | ❌ (trebuie alt serviciu) | ❌ |
| SSE | ✅ perfect | ✅ perfect | ✅ perfect |
| DX (dev experience) | 9/10 | 8/10 | 7/10 |
| Community | Mare | Mare | Mediu |
| Stability | Foarte bun | Bun | Bun |

**CÂȘTIGĂTOR: Railway Pro ($7/mo).**

Fly.io e mai ieftin dar CLI-based deployment e mai puțin accesibil pentru echipă. Render e comparabil dar fără cron built-in (trebuie cron-job.org extern pentru CRM sync retry).

**Proiecție cost 3 ani:**
```
Railway Pro: $7 × 36 = $252
(dacă trebuie mai mult RAM: $20/mo Pro = $720)
──────────────────────────────────
Total: $252-720
```

---

## ═══════════════════════════════════════════════════════
## 7. FRONTEND HOSTING (Admin + Widget)
## ═══════════════════════════════════════════════════════

**Admin Panel (React SPA):**
- Vercel: $0/mo, Git deploy, preview per branch. Perfect.
- Alternativă: Netlify, CloudFlare Pages (toate $0).
- Decizie: **Vercel** (cel mai bun DX pentru React).

**Widget (JS bundle pe site BBC):**
- Opțiune A: Servit de Vercel ca static asset ($0)
- Opțiune B: Servit de CloudFlare Pages ($0, edge cached, ultra-rapid)
- Opțiune C: Servit de Railway (din backend)
- Decizie: **CloudFlare Pages** — edge caching = widget se încarcă în <100ms din orice locație.

**Cost 3 ani:** $0.

---

## ═══════════════════════════════════════════════════════
## 8. MONITORING & OBSERVABILITY
## ═══════════════════════════════════════════════════════

| Tool | Free tier | Ce monitorizează | Setup |
|------|-----------|------------------|-------|
| **Sentry** | 5K errors/mo | Errors, exceptions, traces | 5 min (SDK) |
| **Uptime Robot** | 50 monitors | Uptime, response time | 2 min |
| **Better Stack** | 10 monitors | Logs, uptime, incidents | 10 min |
| **Axiom** | 500MB/mo | Logs, traces, dashboards | 10 min |
| **Railway Logs** | Built-in | Stdout/stderr | 0 min |

**DECIZIE:**
```
Errors: Sentry free ($0)
Uptime: Uptime Robot free ($0)  
Logs: Railway built-in ($0)
Custom metrics: Log to Supabase table ($0)
────────────────────────────────────────
Total: $0/mo
```

**Custom metrics table în Supabase:**
```sql
CREATE TABLE metrics (
  id serial PRIMARY KEY,
  event_type text,  -- 'chat_response', 'lead_captured', 'crm_sync', 'llm_error'
  metadata jsonb,   -- { model: 'haiku', latency_ms: 450, tokens: 200, cost: 0.001 }
  created_at timestamptz DEFAULT now()
);

-- Dashboard query:
SELECT 
  date_trunc('day', created_at) as day,
  count(*) FILTER (WHERE event_type = 'chat_response') as total_messages,
  avg((metadata->>'latency_ms')::int) FILTER (WHERE event_type = 'chat_response') as avg_latency,
  sum((metadata->>'cost')::float) FILTER (WHERE event_type = 'chat_response') as daily_ai_cost,
  count(*) FILTER (WHERE event_type = 'lead_captured') as leads_captured
FROM metrics
GROUP BY 1 ORDER BY 1 DESC;
```

---

## ═══════════════════════════════════════════════════════
## 9. DEVOPS: CI/CD, SECRETS, ENVIRONMENTS
## ═══════════════════════════════════════════════════════

### CI/CD Pipeline

```
GitHub repo (monorepo)
│
├── /backend (FastAPI)
│   └── Push to main → Railway auto-deploy (2 min)
│
├── /admin (React SPA)
│   └── Push to main → Vercel auto-deploy (1 min)
│
├── /widget (React bundle)
│   └── Push to main → CloudFlare Pages auto-deploy (1 min)
│
└── GitHub Actions:
    └── On PR: run pytest (backend) + TypeScript check (admin, widget)
    └── On merge to main: auto-deploy all
```

**Zero manual deploy.** Push = live în 2 minute.

### Secrets Management

```
Railway:    ANTHROPIC_API_KEY, OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY,
            SUPABASE_URL, SUPABASE_SERVICE_KEY, CRM_API_TOKEN, UPSTASH_REDIS_URL,
            SENTRY_DSN

Vercel:     VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
            (DOAR anon key, NICIODATĂ service key)

CloudFlare: Nimic (widget-ul nu are secrete, vorbește doar cu FastAPI)
```

### Environments

```
Development: Local (docker-compose cu Supabase local + Qdrant Docker)
Staging:     Supabase free project #2 + Railway dev branch
Production:  Supabase Pro + Railway Pro + Qdrant Cloud
```

---

## ═══════════════════════════════════════════════════════
## 10. PROIECȚIE COST TOTAL PE 3 ANI
## ═══════════════════════════════════════════════════════

### Scenariu 1: Rămânem mici (2-5K conversații/lună)

| Componentă | Anul 1 | Anul 2 | Anul 3 | Total |
|-----------|--------|--------|--------|-------|
| Supabase | $0 (free) | $300 (Pro) | $300 | $600 |
| Railway | $84 | $84 | $84 | $252 |
| Qdrant | $0 | $0 | $0 | $0 |
| Upstash Redis | $0 | $0 | $0 | $0 |
| Vercel + CF | $0 | $0 | $0 | $0 |
| Claude API | $200 | $500 | $500 | $1,200 |
| OpenAI Embed | $1 | $1 | $1 | $3 |
| Sentry + monitoring | $0 | $0 | $0 | $0 |
| **TOTAL** | **$285** | **$885** | **$885** | **$2,055** |

**Cost per conversație:** $2,055 / (3 × 12 × 3500 avg) = **$0.016/conversație**

### Scenariu 2: Creștem 10x (20-50K conversații/lună)

| Componentă | Anul 1 | Anul 2 | Anul 3 | Total |
|-----------|--------|--------|--------|-------|
| Supabase | $150 | $300 | $300 | $750 |
| Railway | $84 | $240 (Pro+) | $240 | $564 |
| Qdrant | $0 | $0 | $300 (Starter) | $300 |
| Upstash Redis | $0 | $120 | $120 | $240 |
| Vercel + CF | $0 | $0 | $0 | $0 |
| Claude API | $500 | $2,000 | $4,000 | $6,500 |
| OpenAI Embed | $1 | $5 | $10 | $16 |
| Monitoring | $0 | $0 | $228 (Sentry paid) | $228 |
| **TOTAL** | **$735** | **$2,665** | **$5,198** | **$8,598** |

**Cost per conversație:** $8,598 / (3 × 12 × 25K avg) = **$0.010/conversație** (scade cu scala!)

### Scenariu 3: Crește exploziv (100K+ conversații/lună)

La 100K conv/lună, trebuie:
- Supabase Team ($599/mo) sau self-hosted PostgreSQL cu dedicated DBA
- Railway cu dedicated resources ($50-100/mo)
- Qdrant Starter ($25/mo) sau Business ($100/mo)
- Redis dedicated ($25-50/mo)
- Model switch: mai mult scripted + Haiku, mai puțin Sonnet
- **Posibil un DevOps part-time sau contractor**
- Total: ~$2,000-3,000/mo = $24K-36K/an

Dar la 100K conv × 10% lead capture × 5% conversion × $400 = **$200K revenue/an**. Cost infra e 12-18% din revenue. Acceptabil.

---

## ═══════════════════════════════════════════════════════
## 11. MENTENANȚĂ: CE FACE CINE, CÂT DUREAZĂ
## ═══════════════════════════════════════════════════════

### Mentenanță săptămânală (30-60 min total)

```
Cine: Scaler (tu) sau Nasalciuc
Când: Luni dimineața, 30 min

Checklist:
□ Railway: check deploy logs, any failed deploys?
□ Sentry: any new errors? Recurring issues?
□ Supabase: check usage dashboard (approaching limits?)
□ Uptime Robot: any downtime events last week?
□ Cost check: Claude API usage → within budget?
□ Qdrant: collection health (quick dashboard look)
□ CRM sync: any failed syncs? (SELECT * FROM leads WHERE crm_synced = false)
```

### Mentenanță lunară (2-3 ore total)

```
Cine: Scaler
Când: Prima zi din lună, 2-3 ore

Checklist:
□ Dependency updates: npm audit, pip audit
□ SSL certificate: auto-renew OK? (Supabase/Railway gestionează)
□ Database: table sizes, index health, vacuum status
□ Qdrant: collection size, query latency trends
□ AI quality: sample 10 random conversations, check response quality
□ Lead scoring: review scoring accuracy, adjust thresholds
□ KB: any outdated entries? Airlines changed routes? Prices updated?
□ Security: review API logs for abuse patterns
□ Cost report: total spend vs budget, forecast next month
```

### Mentenanță trimestrială (4-6 ore)

```
Cine: Scaler + Dan (review)
Când: Q1, Q2, Q3, Q4

Checklist:
□ PostgreSQL: ANALYZE, REINDEX, review slow queries
□ Qdrant: re-embed entire KB (refreshes vectors with latest model)
□ LLM evaluation: test current model vs newer options
□ System prompts: review and optimize based on conversation patterns
□ Security audit: review all API keys, rotate if needed
□ Dependency major updates: React, FastAPI, Python versions
□ Infrastructure review: current plan vs usage, optimize spend
□ Disaster recovery test: can we restore from backup?
□ Load test: simulate 10x current traffic, identify bottlenecks
```

### Mentenanță anuală (1-2 zile)

```
□ Full security audit
□ Compliance review (GDPR data retention, PII handling)
□ Infrastructure migration evaluation (should we change providers?)
□ Major version upgrades (Python, Node, PostgreSQL)
□ Cost optimization deep dive
□ Architecture review: what's working, what's painful?
```

---

## ═══════════════════════════════════════════════════════
## REZUMAT: TECH STACK FINAL CU OWNERSHIP PLAN
## ═══════════════════════════════════════════════════════

```
┌─────────────────────────────────────────────────────────────────┐
│              TECH STACK FINAL — BBC AI CHATBOT                   │
│              Optimizat pentru: 3 oameni, 3 ani, $0-284/mo start │
├──────────────────┬──────────────┬────────────┬─────────────────┤
│ Componentă       │ Alegere      │ Cost/mo    │ Mentenanță/lună │
├──────────────────┼──────────────┼────────────┼─────────────────┤
│ Database         │ Supabase PG  │ $0→25      │ 30 min          │
│ Vector DB        │ Qdrant Cloud │ $0         │ 0 min           │
│ Vector fallback  │ pgvector     │ $0 (incl)  │ 0 min           │
│ Cache            │ In-memory    │ $0         │ 0 min           │
│ Rate limiting    │ Upstash Redis│ $0→10      │ 0 min           │
│ LLM primary      │ Claude Haiku │ ~$35       │ 15 min (review) │
│ LLM fallback     │ GPT-4o-mini  │ ~$2        │ 0 min           │
│ LLM premium      │ Claude Sonnet│ ~$7        │ 0 min           │
│ Embeddings       │ OpenAI small │ <$1        │ 0 min           │
│ Backend          │ Railway Pro  │ $7         │ 15 min          │
│ Admin hosting    │ Vercel       │ $0         │ 0 min           │
│ Widget hosting   │ CF Pages     │ $0         │ 0 min           │
│ Real-time widget │ SSE custom   │ $0 (incl)  │ 0 min           │
│ Real-time admin  │ Supabase RT  │ $0 (incl)  │ 0 min           │
│ Task queue       │ FastAPI BG   │ $0 (incl)  │ 0 min           │
│ Monitoring       │ Sentry free  │ $0         │ 15 min          │
│ Uptime           │ Uptime Robot │ $0         │ 0 min           │
│ CI/CD            │ GH Actions   │ $0         │ 0 min           │
│ CDN              │ CloudFlare   │ $0         │ 0 min           │
├──────────────────┼──────────────┼────────────┼─────────────────┤
│ TOTAL LUNAR      │              │ $52-87     │ ~75 min         │
│ TOTAL ANUAL      │              │ $624-1,044 │ ~15 ore         │
│ TOTAL 3 ANI      │              │ $2,055     │ ~45 ore         │
└──────────────────┴──────────────┴────────────┴─────────────────┘
```

---

*Analiză completă cu Total Cost of Ownership pe 3 ani.*
*Fiecare componentă evaluată pe: setup, mentenanță, failure mode, scaling, migration, cost.*
*Stack-ul minimizează mentenanța la ~75 minute/lună pentru o echipă de 3.*
