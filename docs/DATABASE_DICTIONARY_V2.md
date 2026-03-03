# 📊 BBC AI Chatbot — Dicționar Baza de Date V8

**9 Tabele · 120+ Câmpuri · Schema Finală**  
**Martie 2026 · Documentație Internă BBC Sky Data**

---

## 📑 Cuprins

- [Legendă & Convențiuni](#legendă--convențiuni)
- [Viziune Generală](#viziune-generală)
- [CORE](#-secțiunea-1-core-autentificare--chat) — users, conversations, messages
- [KNOWLEDGE BASE](#-secțiunea-2-knowledge-base) — kb_categories, kb_entries
- [VÂNZĂRI](#-secțiunea-3-vânzări) — leads, route_segments
- [ANALYTICS](#-secțiunea-4-analytics) — pipeline_runs
- [CONFIGURARE](#-secțiunea-5-configurare--app_settings) — app_settings
- [Funcții Speciale](#funcții--logică-specială)
- [Changelog](#-changelog)

---

## Legendă & Convențiuni

| Simbol | Înțeles |
|--------|---------|
| 🔴 **Roșu** | Cheie Primară (PK) — identificator unic |
| 🔵 **Albastru** | Cheie Externă (FK) — referință către altă tabelă |
| 🔄 **Sync** | Câmp calculat/sincronizat AUTOMAT din alte tabele |
| **NU** | Obligatoriu (NOT NULL) |
| *DA* | Opțional (nullable) |

---

## Viziune Generală

### Harta Tabelelor

| Secțiune | Tabele | Total Câmpuri | Rol |
|----------|--------|---------------|-----|
| **CORE** | users, conversations, messages | 31 | Baza chat + autentificare |
| **KB** | kb_categories, kb_entries | 16 | Baza cunoștințe |
| **VÂNZĂRI** | leads, route_segments | 40 | Capturare lead-uri + itinerariu |
| **ANALYTICS** | pipeline_runs | 16 | Logging AI + costuri |
| **CONFIG** | app_settings | 17 | Setări globale |
| **TOTAL** | **9 tabele** | **120 câmpuri** | — |

### Flux de Date (Happy Path)

```
1️⃣  Vizitator → widget → CONVERSAȚIE nouă (sales/support)
2️⃣  Trimite mesaj → MESAJ (role: user) în DB [SINCRON]
3️⃣  AI Pipeline:
    ├─ Caută KB relevantă
    ├─ Detectează INTENȚIE + extrage ENTITĂȚI
    ├─ Calculează COST
    └─ Generează RĂSPUNS
4️⃣  MESAJ AI creat → se loghează PIPELINE_RUN async
5️⃣  If SALES: extract LEAD + ROUTE_SEGMENTS
6️⃣  Agent vede LEAD → SUNĂ în maxim 2h (SLA)
```

### Diagrama Relații

```
                           ┌─────────────────┐
                           │  👤 users       │
                           │  (10 câmpuri)   │
                           └────────┬────────┘
                                    ▲
                                    │ assigned_agent_id
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
         ┌──────────▼──────────┐ ┌──▼──────────────┴────────┐
         │ 💬 conversations    │ │ 📂 kb_categories        │
         │ (14 câmpuri)        │ │ (7 câmpuri)            │
         └──────────┬──────────┘ └──┬────────────────────┘
                    │               │ category_id
                    │ conv_id       │
         ┌──────────▼──────────┐ ┌──▼──────────────────────┐
         │ ✉️  messages        │ │ 📄 kb_entries          │
         │ (7 câmpuri)         │ │ (9 câmpuri)            │
         └──────────┬──────────┘ └────────────────────────┘
                    │
    ┌───────────────┼─────────────────┐
    │               │                 │
┌───▼──────────┐ ┌──▼───────────────┤
│ 🎯 leads     │ │ ⚡ pipeline_runs │
│ (22 câmpuri) │ │ (16 câmpuri)    │
└───┬──────────┘ └────────────────┘
    │ lead_id
    │
┌───▼──────────────────┐
│ ✈️ route_segments    │
│ (18 câmpuri)         │
└──────────────────────┘

┌──────────────────────┐
│ ⚙️ app_settings      │ (singleton - 1 rând)
│ (17 câmpuri)         │
└──────────────────────┘
```

---

# 🔐 SECȚIUNEA 1: CORE (Autentificare & Chat)

Baza chat-ului și autentificării. Toată conversația și mesajele sunt înlănțuite aici.

## 1. 👤 users

**Utilizatorii admin panel-ului: agenți, manageri, proprietari.**

*NU sunt vizitatorii website-ului. Aceștia sunt oamenii care se LOGHEAZĂ în panoul de administrare.*

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Unic. Auto-generat Supabase. |
| `email` | varchar(255) UNIQUE | NU | Email de login. Constrângere UNIQUE. |
| `name` | varchar(255) | NU | Afișare în panel. Ex: `Maria Popescu` |
| `role` | varchar(20) | NU | `owner` / `admin` / `sales` / `support` |
| `tunnel_scope` | varchar(20) | NU | Vizibilitate: `sales` / `support` / `all` |
| `avatar_url` | varchar(500) | *DA* | URL foto profil. NULL = inițiale. |
| `is_active` | boolean | NU | `false` = soft delete. Default: `true` |
| `last_seen_at` | timestamptz | *DA* | Ultima activitate în panel. |
| `created_at` | timestamptz | NU | Auto `NOW()` |
| `updated_at` | timestamptz | NU | Auto-trigger pe UPDATE |

### 🔹 Reguli de Business

✓ Email trebuie UNIC  
✓ Owner = ÎNTOTDEAUNA `tunnel_scope = 'all'`  
✓ Dezactivare NU șterge conversații asignate  
✓ `updated_at` automat prin trigger PostgreSQL

---

## 2. 💬 conversations

**O sesiune de chat = o conversație. Clic widget = conversație nouă.**

**SURSA DE ADEVĂR** pentru datele de contact (nume, email, telefon).

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Creat în Step 1 AI pipeline. |
| `tunnel` | varchar(10) | NU | `sales` / `support` — determină KB + flow. |
| `mode` | varchar(20) | NU | `ai` (default) / `human` / `waiting_for_agent` |
| `status` | varchar(10) | NU | `active` / `pending` / `closed` (auto după 30min) |
| `visitor_name` | varchar(255) | *DA* | Extras AI din mesaje. **SURSA DE ADEVĂR** |
| `visitor_email` | varchar(255) | *DA* | Pentru follow-up email. |
| `visitor_phone` | varchar(50) | *DA* | **CRITICAL** — agentul sună în maxim 2h. |
| `metadata` | jsonb | NU | `{utm_source, utm_medium, page_url, ip}` Default: `{}` |
| 🔵 `assigned_agent_id` | uuid FK | *DA* | NULL = doar AI. |
| `message_count` | int | NU | Total mesaje. Auto-increment trigger. |
| `ai_cost_total` | decimal(10,6) | NU | Costuri AI USD cumulate. Auto-sum trigger. |
| `created_at` | timestamptz | NU | Start conversație. |
| `updated_at` | timestamptz | NU | Ultima activitate. |
| `closed_at` | timestamptz | *DA* | NULL = deschisă. Durata = `closed_at - created_at` |

### 🔹 Reguli de Business

✓ Tunelul NU se schimbă în conversație  
✓ `visitor_phone` = cel mai important pentru sales  
✓ `message_count` și `ai_cost_total` = TRIGGER ONLY  
✓ Auto-close după 30min inactivitate  
✓ Contact info trăiesc DOAR aici

---

## 3. ✉️ messages

**Fiecare mesaj din conversație. User, AI, agent, sau sistem.**

Se salvează **SINCRON** — nu pierdem mesajele niciodată.

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Unic pe mesaj. |
| 🔵 `conversation_id` | uuid FK | NU | CASCADE delete. |
| `role` | varchar(10) | NU | `user` / `ai` / `agent` / `system` |
| `content` | text | NU | Text mesaj. Fără limită. |
| `model_used` | varchar(20) | *DA* | `template` / `haiku` / `sonnet` / `template_fallback` / NULL |
| `cost` | decimal(10,6) | NU | USD. 0 pt. user/template. [Backup intent] |
| `created_at` | timestamptz | NU | Ordine mesaje = `ORDER BY created_at ASC` |

### 🔹 Reguli de Business

✓ INSERT = **SINCRON** (Step 1 pipeline)  
✓ `model_used` + `cost` = backup intențional de pipeline_runs  
✓ CASCADE: ștergere conv → ștergere mesaje

---

# 📚 SECȚIUNEA 2: KNOWLEDGE BASE

Baza de cunoștințe cu categorii și articole pe care AI le folosește pentru context.

## 4. 📂 kb_categories

**Dosare pentru articolele KB. Categorii sales: Rute, Companii, Prețuri. Categorii support: Modificări, Bagaje, Rambursări.**

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator categorie. |
| `name` | varchar(255) | NU | `Rute și Destinații`, `Modificări Booking` |
| `tunnel` | varchar(10) | NU | `sales` / `support` — separare KB. |
| `icon` | varchar(50) | NU | Lucide icon: `Plane`, `DollarSign`, `Luggage` etc. Default: `FileText` |
| `sort_order` | int | NU | Ordinea afișare. Mic = first. Drag-drop friendly. |
| `created_at` | timestamptz | NU | Creare. |
| `updated_at` | timestamptz | NU | Ultima modificare. |

### 🔹 Reguli de Business

✓ CASCADE delete: ștergere categorie → ștergere articole  
✓ `sort_order` update în batch la reorder

---

## 5. 📄 kb_entries

**Articole individuale din KB. Text scurt (max 500 char) ca context pentru AI.**

Pipeline caută prin keyword (V1 ILIKE) sau vector (V2 Qdrant).

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator articol. |
| 🔵 `category_id` | uuid FK | NU | Categoria parent. CASCADE delete. |
| `title` | varchar(255) | NU | `NYC to London`, `Politica Schimbare` |
| `content` | text | NU | Corp articol. **Max 500 char** — peste = cost extra. |
| `tunnel` | varchar(10) | NU | **DENORMALIZAT** din categorie pt. performance. |
| `is_active` | boolean | NU | `false` = ascuns din search. Default: `true` |
| `view_count` | int | NU | Ori folosit ca context. Dashboard: "Top articole". |
| `created_at` | timestamptz | NU | Creare. |
| `updated_at` | timestamptz | NU | Ultima modificare. Warning daca vechi >3 luni. |

### 🔹 Reguli de Business

✓ `tunnel` = DENORMALIZAT din categorie (update trebuie propagat)  
✓ Ideal: 200-500 char. Peste 500 = cost suplimentar  
✓ `view_count = 0` la criere. Increment pe utilizare reala  
✓ `search_vector` generat automat trigger din `title + content`

---

# 🎯 SECȚIUNEA 3: VÂNZĂRI

Capturare lead-uri și itinerariu detaliat al zborurilor.

## 6. 🎯 leads

**Lead-uri capturate din conversații sales. Un lead per conversație (UNIQUE FK 1:1).**

Conținut: intenție, scoring, status. Contact info = pe **CONVERSATIONS**.

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator lead. |
| 🔵 `conversation_id` | uuid FK | NU | **1:1 UNIQUE**. CASCADE. JOIN mandatory pt. contact. |
| `trip_type` | varchar(20) | NU | `one_way` / `round_trip` / `multi_city` / `open_jaw` / `tour` |
| `cabin_class` | varchar(20) | NU | Preferință general: `business` (default) / `first` / `economy` / `mixed` |
| `passengers` | int | *DA* | Număr călători. "My wife and I" = 2. NULL = nespec. |
| `flexible_dates` | boolean | NU | Flexibil cu datele? Default: `true` |
| 🔄 `origin_code` | varchar(10) | *DA* | **SYNC din segment[0].origin_code**. Ex: `JFK`. Indexat. |
| 🔄 `destination_code` | varchar(10) | *DA* | **SYNC din segment[0].destination_code**. Ex: `LHR` |
| 🔄 `departure_date` | date | *DA* | **SYNC din segment[0].departure_date** |
| 🔄 `return_date` | date | *DA* | **SYNC din segment[-1].departure_date**. NULL = one-way |
| 🔄 `total_nights` | int | *DA* | **CALC = SUM(segments.stay_nights)**. Ex: 3+2+3 = 8 nopți. |
| 🔄 `route_display` | text | *DA* | **CALC**. Ex: `JFK → LHR → CDG → JFK (multi-city)` |
| `score` | int | NU | Calitate 0-100. **CALC în Python**. Formula: +20 name, +15 phone, +10 email, +15 route, +10 dates. |
| `tier` | varchar(10) | NU | Derivat: `bronze` (0-49) / `silver` (50-79) / `gold` (80-100) |
| `status` | varchar(20) | NU | État machine: `new` → `contacted` → `qualified` → `converted` / `lost` |
| `intent_signals` | jsonb | NU | Cuvinte-cheie: `["anniversary","lie-flat","urgent","corporate"]` |
| `status_history` | jsonb | NU | Audit journal: `[{from, to, at, by}]`. Append only. |
| `notes` | text | NU | Note AI + Agent. |
| `created_at` | timestamptz | NU | Extracție prima entitate. |
| `updated_at` | timestamptz | NU | Ultima update. |
| `contacted_at` | timestamptz | *DA* | Cand agent a sunat. SLA: maxim 2h de la create. |
| `converted_at` | timestamptz | *DA* | Când booking creat. |

### 🔹 Reguli de Business

✓ Lead = Conversație (UNIQUE FK). NU 2 lead-uri/conv  
✓ Contact info pe **CONVERSATIONS** — JOIN mandatory  
✓ 7 câmpuri derived (🔄) = SYNC AUTOMAT via `sync_lead_derived()`  
✓ `score` = recalculat la FIECARE modificare  
✓ `status` = state machine, merge doar înainte  
✓ CRM export = JOIN leads + conversations + route_segments

---

## 7. ✈️ route_segments

**Segmente individuale de zbor/transport. Fiecare rând = etapă de călătorie.**

Round-trip JFK→LHR = 2 segmente. Tur Europe = 4-6+ segmente.

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator segment. |
| 🔵 `lead_id` | uuid FK | NU | CASCADE delete. 1 lead = 1-6+ segmente. |
| `segment_order` | int | NU | Secvență: 1=primo zbor, 2=secundo. Round-trip: 1=outbound, 2=return |
| `origin_code` | varchar(10) | NU | IATA: `JFK`, `LAX`, `LHR`. Sau cod oraș. |
| `origin_city` | varchar(100) | NU | Lizibil: `New York`, `Londra` |
| `destination_code` | varchar(10) | NU | IATA cod destinație. |
| `destination_city` | varchar(100) | NU | Lizibil destinație. |
| `departure_date` | date | *DA* | Data plecare. NULL = "cam prin martie". |
| `arrival_date` | date | *DA* | Data sosire. NULL inital. Crucial overnight flights. |
| `cabin` | varchar(20) | NU | Cabină segment: `business` / `first` / `economy` |
| `airline_pref` | varchar(255) | *DA* | Preferințe: "BA or Virgin", "ANA", "lie-flat" |
| `stay_nights` | int | *DA* | Nopți la destinație înainte segment urmator. 0=tranzit. |
| `is_stopover` | boolean | NU | `true` = oprire turistică. `false` = destinație principală |
| `transport_mode` | varchar(20) | NU | `flight` / `train` / `bus` / `ferry` / `car` |
| `is_confirmed` | boolean | NU | `false` = AI (aprox). `true` = agent (confirmed) |
| `notes` | text | *DA* | Note specifice segment. |
| `created_at` | timestamptz | NU | Extracție din chat. |
| `updated_at` | timestamptz | NU | Ultima update. |

### 🔹 Reguli de Business

✓ Pattern update: DELETE ALL → INSERT set nou. Fără UPSERT  
✓ După insert/delete → apel `sync_lead_derived()` pe lead  
✓ `segment_order` continuu: 1,2,3,4 — fără goluri  
✓ `is_confirmed = false` inițial (AI). Agent → `true`  
✓ `stay_nights` ultimul segment = 0 (întoarcere) sau NULL

### 📊 Exemple Complete

**🔄 Round-trip simplu (90% cazuri):** JFK → LHR, Mar 15-22

| # | Origin | Destination | Departure | Cabin | Stay | Transport |
|-|--------|-------------|-----------|-------|------|-----------|
| 1 | JFK, NY | LHR, Londra | Mar 15 | business | 7 | flight |
| 2 | LHR, Londra | JFK, NY | Mar 22 | business | 0 | flight |

**🗺️ Tur Europa 10 zile:** NYC → London (3n) → Paris (2n) → Roma (3n) → NYC

| # | Origin | Destination | Departure | Cabin | Stay | Transport |
|-|--------|-------------|-----------|-------|------|-----------|
| 1 | JFK, NY | LHR, Londra | Mar 10 | business | 3 | flight |
| 2 | LHR, Londra | CDG, Paris | Mar 13 | — | 2 | train |
| 3 | CDG, Paris | FCO, Roma | Mar 15 | economy | 3 | flight |
| 4 | FCO, Roma | JFK, NY | Mar 18 | business | 0 | flight |

**🌋 Round-trip cu stopover Iceland:** JFK → KEF (2n stopover) → LHR (5n) → JFK

| # | Origin | Destination | Departure | Cabin | Stay | Stopover | Transport |
|-|--------|-------------|-----------|-------|------|----------|-----------|
| 1 | JFK, NY | KEF, Reykjavik | Mar 10 | business | 2 | **true** | flight |
| 2 | KEF, Reykjavik | LHR, Londra | Mar 12 | business | 5 | false | flight |
| 3 | LHR, Londra | JFK, NY | Mar 17 | business | 0 | false | flight |

---

# ⚡ SECȚIUNEA 4: ANALYTICS

Logging execuții AI și tracking costuri.

## 8. ⚡ pipeline_runs

**Jurnal fiecărei execuții AI. Un rând = un mesaj generat de AI.**

Conținut: model folosit, cost, durată, intenție detectată, KB folosită. Insert **ASINCRON** — NU blochează răspunsul.

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator execuție. |
| 🔵 `message_id` | uuid FK | *DA* | Mesajul AI generat. NULL = edge case după ștergere. |
| 🔵 `conversation_id` | uuid FK | NU | **DENORMALIZAT** pt. analytics direct. |
| `tunnel` | varchar(10) | NU | **DENORMALIZAT** din conversație. `sales` / `support` |
| `intent_detected` | varchar(50) | *DA* | Sales: `NEW_BOOKING`, `PRICE_INQUIRY`. Support: `BOOKING_CHANGE`, `REFUND_REQUEST`. NULL = detecție eșuată. |
| `intent_confidence` | real | *DA* | 0.0-1.0. V1: NULL. V2: Haiku returnează. |
| `intent_method` | varchar(10) | *DA* | `regex` (gratuit) / `haiku` (plătit). Regex ~30% intenții. |
| `model_used` | varchar(20) | NU | `template` ($0) / `haiku` (~$0.003) / `sonnet` (~$0.015) / `template_fallback` ($0) |
| `cost` | decimal(10,6) | NU | USD exact. 0 pt. template. **SURSA DE ADEVĂR** analytics. |
| `latency_ms` | int | *DA* | ms: detecție → răspuns. Target: <2s template, <5s haiku, <8s sonnet. |
| `kb_hit` | boolean | NU | `true` = KB a găsit match. `false` = nicio potrivire. |
| 🔵 `kb_entry_id` | uuid FK | *DA* | Top match KB. NULL dacă `kb_hit=false` |
| `route_card_shown` | boolean | NU | `true` = răspuns inclus card rută vizual (sales only) |
| `had_fallback` | boolean | NU | `true` = AI eșuat, template fallback folosit. Trebuie <5%. **ALERTĂ** daca >10%. |
| `entities_extracted` | jsonb | NU | Array: `["name","phone","destination"]`. Default: `[]` |
| `created_at` | timestamptz | NU | Finalizare execuție (async, ușor după message.created_at) |

### 🔹 Reguli de Business

✓ INSERT = **ASINCRON** — nu blochează niciodată chat  
✓ `conversation_id` + `tunnel` = DENORMALIZAT pt. performance  
✓ **ALERTĂ** dacă `had_fallback > 10%` — pipeline are probleme  
✓ Latency target: template <2s, haiku <5s, sonnet <8s

---

# ⚙️ SECȚIUNEA 5: CONFIGURARE - app_settings

## 9. ⚙️ app_settings

**Tabelă SINGLETON — exact UN SINGUR RÂND, ÎNTOTDEAUNA.**

Configurare globală sistem. Editabilă din Settings panel. Modificări intră în efect **IMEDIAT** (fără restart).

### 📋 Schema

| Câmp | Tip | NULL? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | ID-ul singurului rând. INDEX UNIQUE ON (true) enforces 1 rând. |
| `company_name` | varchar(255) | NU | În header widget. Default: `Buy Business Class` |
| `widget_position` | varchar(20) | NU | `bottom-right` (default) / `bottom-left` |
| `sales_greeting` | text | NU | Primo mesaj sales tunnel. Default: "Welcome! Where are you looking..." |
| `support_greeting` | text | NU | Primo mesaj support. Default: "Hi! I can help with booking changes..." |
| `business_hours_start` | time | NU | Ex: `09:00` |
| `business_hours_end` | time | NU | Ex: `18:00` |
| `business_timezone` | varchar(50) | NU | Ex: `America/New_York`. Toate comparații timp = acest fus. |
| `auto_reply_after_hours` | boolean | NU | `true` = bot trimite `after_hours_message` după ore. Default: `true` |
| `after_hours_message` | text | NU | Mesaj după-program. Default: "Our specialists are available 9 AM - 6 PM..." |
| `max_ai_messages_per_conv` | int | NU | Limită siguranță. Default: `20`. Previne loop-uri. |
| `pipeline_timeout_sec` | int | NU | Max secunde așteptare AI → fallback. Default: `10`. Creștere daca timeout. |
| `enable_lead_notifications` | boolean | NU | Notificare agent pe lead nou. V1: console log, V2: Slack. Default: `true` |
| `enable_slack_notifications` | boolean | NU | If `true` ȘI `slack_webhook_url` setat: Slack send. Default: `false` |
| `slack_webhook_url` | varchar(500) | *DA* | Webhook Slack. NULL = Slack disabled. |
| `lead_callback_sla_minutes` | int | NU | SLA callback lead-uri. Default: `120` (2h). Agent trebuie sunat în interval. |
| `updated_at` | timestamptz | NU | Ultima modificare. Auto-trigger. |

### 🔹 Reguli de Business

✓ **EXACT 1 RÂND** — niciodată 0, niciodată >1  
✓ Modificări intră în efect **IMEDIAT** — pipeline citește la fiecare request  
✓ Singleton pattern: INSERT la seed, UPDATE doar ulterior  
✓ `lead_callback_sla_minutes` = SLA principal

---

# 🔧 Funcții & Logică Specială

## sync_lead_derived()

Când segmentele unui lead se modifică (INSERT/DELETE), pipeline apelează:

```python
def sync_lead_derived(lead_id: str):
    """
    Actualizeaza ATOMIC toate campurile derived ale lead-ului
    pe baza segmentelor sale.
    """
    segments = db.query(RouteSegment)\
        .filter_by(lead_id=lead_id)\
        .order_by("segment_order")\
        .all()
    
    if not segments:
        return  # Niciun segment inca
    
    # Extrage din PRIMEIRO segment
    lead.origin_code = segments[0].origin_code
    lead.destination_code = segments[0].destination_code
    lead.departure_date = segments[0].departure_date
    
    # Extrage din ULTIMUL segment
    lead.return_date = segments[-1].departure_date if len(segments) > 1 else None
    
    # Sumează stay_nights
    lead.total_nights = sum(s.stay_nights or 0 for s in segments)
    
    # Construiește display
    lead.route_display = build_route_display(segments, lead.trip_type)
    
    # Recalculează scor & tier
    lead.score = calculate_score(lead)
    lead.tier = "gold" if lead.score >= 80 \
               else "silver" if lead.score >= 50 \
               else "bronze"
    
    db.commit()  # ONE atomic UPDATE
```

---

# 📝 Changelog

| Versiune | Data | Schimbări Majore |
|----------|------|------------------|
| V1-V4 | Feb 2026 | Schema inițială: 12 tabele → optimizare 9 tabele |
| V5 | Mar 2026 | +route_segments (stay_nights, is_stopover, transport_mode) |
| V6 | Mar 2026 | -tickets (NU era support workflow) |
| V7 | Mar 2026 | -departure_date/return_date de pe leads (duplicate cu segments) |
| **V8** | **Mar 2026** | **🎯 AUDIT COMPLET**: +5 derived fields pe leads, -segment_type, +arrival_date, +entities_extracted, redenumit SLA |

---

## 🚀 Next Steps pentru Implementare

### SQL Migrations Necesare

1. Tabele CORE + relații
2. Índecsi pe `tunnel`, `status`, `created_at`
3. Trigger-uri pentru `updated_at`
4. Trigger-uri pentru `message_count` + `ai_cost_total` sync
5. Trigger-uri pentru `search_vector` (tsvector)
6. CHECK constraints: `score` 0-100, `tier` enums

### Application Layer

- [ ] Repository methods pt. fiecare tabelă
- [ ] Service layer: lead scoring, lead sync
- [ ] API endpoints pt. CRUD & special operations
- [ ] Admin panel views & forms
- [ ] Real-time notifications (lead create, status change)

---

**Document Version: V8 · Generated: March 2026 · BBC Sky Data Internal**
