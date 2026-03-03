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
- [CONFIGURARE](#-secțiunea-5-configurare---app_settings) — app_settings
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

Baza chat-ului și sistemului de autentificare. Fiecare conversație e legată de utilizator și mesaje.

## 1. 👤 users

**Utilizatorii admin panel-ului: agenți de vânzări, agenți de suport, manageri, proprietari.**

NU sunt vizitatorii website-ului. Aceștia sunt oamenii care se **LOGHEAZĂ** în panoul de administrare pentru a gestiona lead-uri, articole KB și setări.

### Schema Câmpuri

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic. UUID v4 generat automat de Supabase la INSERT. Nu se modifică niciodată. |
| `email` | varchar(255) UNIQUE | NU | Email-ul de login. Constrângere UNIQUE — nu pot exista doi useri cu același email. Folosit pentru autentificarea Supabase Auth. |
| `name` | varchar(255) | NU | Numele afișat în admin panel și de agent în chat. Ex: `Maria Popescu`. |
| `role` | varchar(20) | NU | Nivel permisiuni: `owner`, `admin`, `sales`, `support` |
| `tunnel_scope` | varchar(20) | NU | Vizibilitate tunel: `sales`, `support`, `all` |
| `avatar_url` | varchar(500) | *DA* | URL fotografie profil. NULL = inițiale |
| `is_active` | boolean | NU | `false` = soft delete, utilizator dezactivat. Default: `true` |
| `last_seen_at` | timestamptz | *DA* | Ultima activitate. NULL = nu s-a loghat niciodată |
| `created_at` | timestamptz | NU | La creare. Auto `NOW()` |
| `updated_at` | timestamptz | NU | Ultima modificare. Auto-actualizat prin trigger |

### Enums & Valori

**`role`:**  `owner` (acces complet) · `admin` (minus facturare) · `sales` · `support`

**`tunnel_scope`:**  `sales` · `support` · `all`

### Reguli de Business

- Email trebuie UNIC — constrângere UNIQUE la DB
- Owner are ÎNTOTDEAUNA `tunnel_scope = 'all'`
- Dezactivarea user-ului NU șterge conversațiile asignate
- `updated_at` se actualizează AUTOMAT prin trigger PostgreSQL

---

## 2. 💬 conversations

**Fiecare sesiune de chat între vizitator și chatbot/agent. Clic widget = conversație nouă.**

**SURSA DE ADEVĂR** pentru datele de contact ale vizitatorului (nume, email, telefon). Celelalte tabele referențiază conversația pentru identitate.

### Schema Câmpuri
|------|-----|-------|-----------|
| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic. Creat în Step 1 pipeline la sosirea primului mesaj. |
| `tunnel` | varchar(10) | NU | Tip: `sales` sau `support`. Determină din pagina/widget care e deschis. Nu se poate schimba. |
| `mode` | varchar(20) | NU | Cine răspunde: `ai` (default), `human` (agent), `waiting_for_agent` |
| `status` | varchar(10) | NU | Stare: `active`, `pending`, `closed` (auto după 30 min inactivitate) |
| `visitor_name` | varchar(255) | *DA* | Numele extras de AI din mesaje. SURSA DE ADEVĂR pt. identitate. |
| `visitor_email` | varchar(255) | *DA* | Email extras din chat. Pentru follow-up. |
| `visitor_phone` | varchar(50) | *DA* | **CEL MAI IMPORTANT** pentru sales — agentul sună în maxim 2h. |
| `metadata` | jsonb | NU | Flexibil: `{utm_source, utm_medium, page_url, ip_country}`. Default: `{}` |
| 🔵 `assigned_agent_id` | uuid FK → users.id | *DA* | Agent ce gestionează. NULL = doar AI. |
| `message_count` | int | NU | Total mesaje. Se INCREMENTEAZĂ AUTOMAT prin trigger. Pragul Sonnet: 5+ |
| `ai_cost_total` | decimal(10,6) | NU | Suma costuri AI USD. Se ACUMULEAZĂ AUTOMAT. |
| `created_at` | timestamptz | NU | Start conversație (primul mesaj). |
| `updated_at` | timestamptz | NU | Ultima activitate. |
| `closed_at` | timestamptz | *DA* | Când s-a închis. NULL = încă deschisă. Durata = `closed_at - created_at` |

### Enums & Valori

**`tunnel`:**  `sales` · `support`  
**`mode`:**  `ai` · `human` · `waiting_for_agent`  
**`status`:**  `active` · `pending` · `closed`

### Reguli de Business

- Tunelul NU se schimbă în timpul conversației
- `visitor_phone` = cel mai important pentru sales
- `message_count` și `ai_cost_total` se actualizează DOAR prin trigger
- Conversație se închide automat după 30 min inactivitate
- Datele de contact (name, email, phone) trăiesc DOAR aici

---

## 3. ✉️ messages

**Fiecare mesaj individual din conversație. Atât mesajele vizitatorului cât și răspunsurile AI/agent.**

Se salvează **SINCRON** în Step 1 pipeline — nu pierdem NICIODATĂ un mesaj, chiar dacă pipeline-ul AI se blochează ulterior.

### Schema Câmpuri

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic. |
| 🔵 `conversation_id` | uuid FK → conversations.id | NU | CASCADE delete — ștergerea conversației șterge și mesajele. |
| `role` | varchar(10) | NU | Cine trimise: `user`, `ai`, `agent`, `system` |
| `content` | text | NU | Textul exact. Pentru AI: răspur generat. Pentru user: exact ce a scris. |
| `model_used` | varchar(20) | *DA* | Model AI: `template` ($0), `haiku` (~$0.003), `sonnet` (~$0.015), `template_fallback` ($0). NULL pt. user/agent. |
| `cost` | decimal(10,6) | NU | Cost USD. 0 pt. user & template-uri. |
| `created_at` | timestamptz | NU | Când trimis/primit. Ordine mesaje = `ORDER BY created_at ASC` |

### Enums & Valori

**`role`:**  `user` · `ai` · `agent` · `system`  
**`model_used`:**  `template` · `haiku` · `sonnet` · `template_fallback` · `NULL`

### Reguli de Business

- INSERT-ul mesajului este **SINCRON** — Step 1 pipeline, NICIODATĂ async
- `model_used` și `cost` sunt backup-uri intenționate ale pipeline_runs
- CASCADE delete: ștergerea conversației șterge automat mesajele

---

# 📚 SECȚIUNEA 2: KNOWLEDGE BASE

Baza de cunoștințe cu categorii și articole pe care AI-ul le folosește pentru context.

## 4. 📂 kb_categories

**Dosare ce organizează articolele KB pe categorii și tunel.**

Categorii sales: Rute, Companii Aeriene, Prețuri, Promoții.  
Categorii support: Modificări Booking, Bagaje, Rambursări.

### Schema Câmpuri

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic. |
| `name` | varchar(255) | NU | Ex: `Rute și Destinații`, `Modificări Booking` |
| `tunnel` | varchar(10) | NU | `sales` sau `support` |
| `icon` | varchar(50) | NU | Icon Lucide: `Plane`, `DollarSign`, `RefreshCw`, `Luggage`. Default: `FileText` |
| `sort_order` | int | NU | Ordinea afișare. Mic = první. Permite drag-and-drop. |
| `created_at` | timestamptz | NU | Creare. |
| `updated_at` | timestamptz | NU | Ultima modificare. |

### Reguli de Business

- CASCADE delete: ștergerea categoriei șterge articolele
- `sort_order` se actualizează în batch la reordonare

---

## 5. 📄 kb_entries

**Articole individuale din baza de cunoștințe. Text scurt (max 500 char recomandat) folosit ca context AI.**

Pipeline-ul AI caută prin keyword (V1 ILIKE) sau vector (V2 Qdrant).

### Schema Câmpuri

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic al articolului. |
| 🔵 `category_id` | uuid FK → kbc.id | NU | Din ce categorie face parte. CASCADE delete. |
| `title` | varchar(255) | NU | Titlul articolului: `NYC to London`, `Politica de Schimbare Dată`, `Promoții Curente`. Folosit în admin panel și ca boost la căutare. |
| `content` | text | NU | Corpul articolului. Se injectează în prompt-ul AI ca context. **Recomandare: maxim 500 caractere** — text mai lung = mai mulți tokeni = cost mai mare. |
| `tunnel` | varchar(10) | NU | Denormalizat din categoria părinte pentru performanță la căutare. Pipeline-ul face: `WHERE tunnel='sales' AND search_vector @@ query`. Evită JOIN cu kb_categories. |
| `is_active` | boolean | NU | Ștergere logică. `false` = ascuns din căutarea AI, nu este folosit de pipeline. Default: `true`. |
| `view_count` | int | NU | De câte ori pipeline-ul a folosit acest articol ca context. Se incrementează la Step 5 din pipeline. Dashboard: "Cele mai folosite articole KB". |
| `created_at` | timestamptz | NU | Când a fost creat articolul. |
| `updated_at` | timestamptz | NU | Ultima editare. Dacă `updated_at` este vechi → articolul poate avea prețuri expirate. Admin: avertisment "Ultima actualizare acum 3 luni". |

**Reguli de business:**

- `tunnel` este DENORMALIZAT din kb_categories — actualizarea tunnel-ului categoriei trebuie propagată
- Conținutul ideal: 200-500 caractere. Peste 500 = cost suplimentar la fiecare utilizare
- `view_count = 0` la creare. Se incrementează doar când pipeline-ul folosește articolul efectiv
- `search_vector` (tsvector) se generează automat prin trigger din `title + content` — nu e în QuickDBD dar TREBUIE în SQL migration

---

## 6. 🎯 leads

**Lead-urile de vânzări capturate din conversațiile de chat. Un lead per conversație de vânzări (FK UNIQUE 1:1). Conține intenția de călătorie, scoring și tracking de status. Datele de contact ale vizitatorului (nume, email, telefon) trăiesc pe conversația părinte, NU aici — se accesează prin JOIN. Aceste date se sincronizează în CRM.**

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic al lead-ului. |
| 🔵 `conversation_id` | uuid FK → conversations.id UNIQUE | NU | 1:1 — un singur lead per conversație. CASCADE delete. Prin aceasta accesăm datele de contact: `JOIN conversations` → visitor_name, visitor_email, visitor_phone. |
| `trip_type` | varchar(20) | NU | Tipul călătoriei solicitate. Determină structura segmentelor de rută. Extras progresiv de AI din conversație. |
| `cabin_class` | varchar(20) | NU | Clasa de zbor PREFERATĂ de client pentru călătoria generală: `business` (default BBC), `first`, `economy` (rar), `mixed` (business transatlantic + economy hopuri scurte). Fiecare segment poate avea cabină diferită. |
| `passengers` | int | *DA* | Numărul de călători. Extras din chat: "My wife and I" = 2. NULL dacă nu a fost menționat. |
| `flexible_dates` | boolean | NU | Dacă vizittatorul este flexibil cu datele. "Give or take a few days" = `true`. Default: `true`. Important pentru agent la căutarea tarifelor. |
| 🔄 `origin_code` | varchar(10) | *DA* | **SINCRONIZAT AUTOMAT** din `segment[1].origin_code`. Aeroportul de origine al primului segment: `JFK`. Indexat pentru GROUP BY și filtrare admin. |
| 🔄 `destination_code` | varchar(10) | *DA* | **SINCRONIZAT AUTOMAT** din `segment[1].destination_code`. Prima destinație: `LHR`. Dashboard: "Top Destinations" = `GROUP BY destination_code`. |
| 🔄 `departure_date` | date | *DA* | **SINCRONIZAT AUTOMAT** din `segment[1].departure_date`. Data de plecare. CRM export, admin column "Date plecării", dashboard "Lead-uri pe lună". |
| 🔄 `return_date` | date | *DA* | **SINCRONIZAT AUTOMAT** din `segment[ultimul].departure_date`. Data de întoarcere. NULL pentru one-way. |
| 🔄 `total_nights` | int | *DA* | **SINCRONIZAT AUTOMAT** = `SUM(route_segments.stay_nights)`. Exemplu: 3 nopți Londra + 2 nopți Paris + 3 nopți Roma = 8 nopți. Admin column: "8 nopți". |
| 🔄 `route_display` | text | *DA* | **CALCULAT AUTOMAT** din segmente. Exemple: `JFK → LHR` (round-trip), `JFK → LHR → CDG → JFK (multi-city)`, `LAX → NRT (one-way)`. |
| `score` | int | NU | Scor calitate 0-100. **CALCULAT ÎN PYTHON** la fiecare actualizare. Formula: +20 nume, +15 telefon, +10 email, +15 rută, +10 date, +10 pasageri, +5 cabină, +15 intenție. CHECK: 0-100. |
| `tier` | varchar(10) | NU | Derivat din scor: `bronze` (0-49), `silver` (50-79), `gold` (80-100). Se actualizează întotdeauna împreună cu score. Folosit pentru prioritizare și badge-uri. |
| `status` | varchar(20) | NU | Ciclul de viață al lead-ului. Mașină de stare — merge DOAR înainte. Agentul schimbă din admin panel. |
| `intent_signals` | jsonb | NU | Array cuvinte-cheie intenție: `["anniversary","lie-flat","urgent","price-sensitive","corporate"]`. Extrase de AI. Folosite pentru boost scor și pregătirea agentului. |
| `status_history` | jsonb | NU | Jurnal audit: `[{from:"new", to:"contacted", at:"2026-03-02T10:00:00Z", by:"user_id"}]`. Se append-ează, nu se suprascrie. |
| `notes` | text | NU | Note text liber. AI scrie inițial din conversație. Agent adaugă manual. Exemplu: "Anniversary trip, vrea lie-flat, buget ~$4k, preferă BA". |
| `created_at` | timestamptz | NU | Când a fost creat lead-ul (prima entitate extrasă). |
| `updated_at` | timestamptz | NU | Ultima actualizare (entitate nouă, scor recalculat, status, notă). |
| `contacted_at` | timestamptz | *DA* | Când agentul a sunat/emailed prima oară. Setat MANUAL de agent. SLA: trebuie în maxim `lead_callback_sla_minutes` (default 2h) de la `created_at`. |
| `converted_at` | timestamptz | *DA* | Când lead-ul s-a transformat în booking. Setat de agent. Analytics: rata conversie, atribuire venituri. |

**Valori posibile (enums):**

- `trip_type`: `one_way` (A→B), `round_trip` (A→B→A, 90% cazuri), `multi_city` (A→B→C→A), `open_jaw` (A→B, C→A), `tour` (A→B→C→D→A cu opriri)
- `cabin_class`: `business` (default BBC), `first`, `economy`, `mixed` (cabine diferite pe segmente)
- `tier`: `bronze` (0-49), `silver` (50-79), `gold` (80-100)
- `status`: `new` (tocmai capturat), `contacted` (agent a sunat), `qualified` (confirmat interes), `converted` (booking!), `lost` (pierdut)

**Reguli de business:**

- Un lead = o conversație (UNIQUE FK). NU pot exista două lead-uri din aceeași conversație
- Datele de contact (name, email, phone) sunt pe **CONVERSATIONS**, nu pe leads — JOIN obligatoriu
- 7 câmpuri derived (🔄) se sincronizează AUTOMAT prin `sync_lead_derived()` din pipeline
- `score` se recalculează la FIECARE modificare a lead-ului sau segmentelor
- `status` merge doar înainte: new → contacted → qualified → converted/lost
- CRM export = `JOIN leads + conversations (contact info) + route_segments (itinerariu)`

---

## 7. ✈️ route_segments (alias: rs)

**Segmente individuale de zbor/transport din itinerariul unui lead. Fiecare rând = o etapă a călătoriei. Un round-trip JFK→LHR are 2 segmente. Un tur European are 4-6+ segmente. Sursa de date EXACTE, pregătite pentru CRM. Se extrag progresiv de AI din chat, se confirmă de agent.**

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic al segmentului. |
| 🔵 `lead_id` | uuid FK → leads.id | NU | CASCADE delete. Un lead poate avea 1-6+ segmente. |
| `segment_order` | int | NU | Secvența: 1 = primul zbor, 2 = al doilea, etc. Round-trip: 1 = outbound (dus), 2 = return (întors). |
| `origin_code` | varchar(10) | NU | Codul IATA al aeroportului de plecare: `JFK`, `LAX`, `LHR`. Poate fi cod de oraș dacă aeroportul exact nu se cunoaște: `NYC` → agentul rezolvă în JFK/EWR/LGA. |
| `origin_city` | varchar(100) | NU | Orașul de plecare în format lizibil: `New York`, `Los Angeles`, `Londra`. Pentru CRM display. |
| `destination_code` | varchar(10) | NU | Codul IATA al aeroportului de destinație. |
| `destination_city` | varchar(100) | NU | Orașul de destinație în format lizibil. |
| `departure_date` | date | *DA* | Data de plecare pentru acest segment. NULL dacă vizittatorul a spus "undeva prin martie" — agentul confirmă data exactă. |
| `arrival_date` | date | *DA* | Data de sosire. NULL inițial — agentul completează la confirmare. Important pentru zboruri overnight: plecare JFK 10 Mar → sosire LHR **11 Mar**. |
| `cabin` | varchar(20) | NU | Clasa de cabină pentru **ACEST** segment specific: `business`, `first`, `economy`. Segmente DIFERITE pot avea cabine DIFERITE: business transatlantic + economy Londra→Edinburgh. |
| `airline_pref` | varchar(255) | *DA* | Preferințe companie aeriană: "BA or Virgin Atlantic", "ANA", "anything with lie-flat". NULL = fără preferință. |
| `stay_nights` | int | *DA* | Câte nopți stă clientul la destinație ÎNAINTE de următorul segment. `0` = tranzit/conexiune. `3` = stă 3 nopți. NULL = nu s-a specificat. `SUM` pe toate = `leads.total_nights`. |
| `is_stopover` | boolean | NU | `true` = oprire turistică pe drum, NU destinație principală. Exemplu: 2 nopți în Reykjavik pe drumul JFK→LHR = stopover. `false` = destinație principală. Admin: linie punctată vs. solidă. |
| `transport_mode` | varchar(20) | NU | Modul de transport: `flight` (zbor ✈️), `train` (tren 🚂 — Eurostar), `bus` (🚌), `ferry` (⛴️), `car` (🚗). |
| `is_confirmed` | boolean | NU | `false` = extras de AI din chat (aproximativ). `true` = confirmat de agent după apelul telefonic (exact, verificat). |
| `notes` | text | *DA* | Note specifice: "Vrea stopover în Reykjavik", "Necesită scaun rulant", "Zbor conectare spre Edinburgh". |
| `created_at` | timestamptz | NU | Când a fost extras acest segment din conversație. |
| `updated_at` | timestamptz | NU | Ultima actualizare — AI a rafinat sau agentul a confirmat/modificat. |

**Valori posibile (enums):**

- `cabin`: `business` (default BBC), `first`, `economy`
- `transport_mode`: `flight` (✈️), `train` (🚂), `bus` (🚌), `ferry` (⛴️), `car` (🚗)

**Reguli de business:**

- Pattern actualizare: `DELETE ALL` segmente pentru lead → `INSERT` set complet nou. Fără UPSERT
- După INSERT/DELETE → se apelează `sync_lead_derived()` pe lead (origin_code, destination_code, departure_date, return_date, total_nights, route_display)
- `segment_order` trebuie continuu: 1,2,3,4 — fără goluri
- `is_confirmed = false` pentru tot ce vine din chatbot. Agent schimbă în `true` după verificare
- `stay_nights` pe ULTIMUL segment = de obicei `0` (se întoarce acasă) sau NULL

**Exemple complete:**

**Round-trip simplu (90% cazuri):** JFK → LHR, March 15-22

| # | origin | destination | date | cabin | stay | stopover | transport |
|---|--------|-------------|------|-------|------|----------|-----------|
| 1 | JFK New York | LHR Londra | Mar 15 | business | 7 | false | flight |
| 2 | LHR Londra | JFK New York | Mar 22 | business | 0 | false | flight |

**Tur Europa 10 zile:** NYC → London (3n) → tren Paris (2n) → zbor Roma (3n) → NYC

| # | origin | destination | date | cabin | stay | stopover | transport |
|---|--------|-------------|------|-------|------|----------|-----------|
| 1 | JFK New York | LHR Londra | Mar 10 | business | 3 | false | flight |
| 2 | LHR Londra | CDG Paris | Mar 13 | — | 2 | false | train |
| 3 | CDG Paris | FCO Roma | Mar 15 | economy | 3 | false | flight |
| 4 | FCO Roma | JFK New York | Mar 18 | business | 0 | false | flight |

**Round-trip cu stopover Iceland:** JFK → KEF (2n stopover) → LHR (5n) → JFK

| # | origin | destination | date | cabin | stay | stopover | transport |
|---|--------|-------------|------|-------|------|----------|-----------|
| 1 | JFK New York | KEF Reykjavik | Mar 10 | business | 2 | **true** | flight |
| 2 | KEF Reykjavik | LHR Londra | Mar 12 | business | 5 | false | flight |
| 3 | LHR Londra | JFK New York | Mar 17 | business | 0 | false | flight |

---

## 8. ⚡ pipeline_runs (alias: pr)

**Jurnalul fiecărei execuții a pipeline-ului AI. Un rând per mesaj generat de AI. Conține: ce model s-a folosit, cât a costat, cât a durat, ce intenție s-a detectat, dacă s-a folosit KB. Se inserează ASINCRON — NU blochează răspunsul chat-ului. Folosit pentru: tracking costuri, performanță model, acuratețe intenție, eficacitate KB.**

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | Identificator unic al execuției. |
| 🔵 `message_id` | uuid FK → messages.id | *DA* | Leagă de mesajul AI generat. NULL dacă INSERT-ul async a avut loc după ce mesajul a fost șters (edge case). |
| 🔵 `conversation_id` | uuid FK → conversations.id | NU | **Denormalizat** — s-ar putea obține din message→conversation, dar necesar pentru analytics directe fără double JOIN. |
| `tunnel` | varchar(10) | NU | **Denormalizat** din conversație. Dashboard: "Cost AI Sales vs Support" = `GROUP BY tunnel`. |
| `intent_detected` | varchar(50) | *DA* | Ce intenție a clasificat AI-ul. Sales: `NEW_BOOKING`, `PRICE_INQUIRY`, `ROUTE_INFO`. Support: `BOOKING_CHANGE`, `REFUND_REQUEST`, `BAGGAGE_INFO`. Universal: `GREETING`, `CLOSING`, `TALK_TO_AGENT`. NULL dacă detecția a eșuat. |
| `intent_confidence` | real | *DA* | Cât de sigur a fost clasificatorul. 0.0-1.0. V1: NULL (regex fără confidence). V2: Haiku returnează confidence. |
| `intent_method` | varchar(10) | *DA* | Cum s-a detectat intenția: `regex` (gratuit, instant) sau `haiku` (plătit, clasificator AI). Regex ~30% din intenții (salutări, închideri). |
| `model_used` | varchar(20) | NU | Ce model a generat răspunsul: `template` ($0), `haiku` (~$0.003), `sonnet` (~$0.015), `template_fallback` ($0). **SURSA DE ADEVĂR** pentru analytics cost. |
| `cost` | decimal(10,6) | NU | Costul exact API în USD. 0 pentru template-uri. Agregat pentru rapoarte lunare. |
| `latency_ms` | int | *DA* | Milisecunde de la mesaj primit la răspuns trimis. Include: detecție intenție + extracție entități + căutare KB + generare + validare. **Țintă:** <2000ms template, <5000ms Haiku, <8000ms Sonnet. |
| `kb_hit` | boolean | NU | `true` = KB a găsit articole relevante ca context AI. `false` = nicio potrivire. Dashboard: rata acoperire KB. |
| 🔵 `kb_entry_id` | uuid FK → kbe.id | *DA* | Ce articol KB a fost top match. NULL dacă `kb_hit=false`. Raport: "Cele mai folosite articole KB". |
| `route_card_shown` | boolean | NU | `true` = răspunsul a inclus card vizual de rută (cu preț, companii). Doar sales. Dashboard: rata conversie card rută. |
| `had_fallback` | boolean | NU | `true` = AI a eșuat (timeout, eroare), s-a folosit template fallback. Trebuie <5%. **ALERTĂ** dacă >10%. |
| `entities_extracted` | jsonb | NU | Array entități extrase: `["name","phone","destination","dates","passengers"]`. Analytics: "AI extrage telefonul în 62% din conversații". Default: `[]`. |
| `created_at` | timestamptz | NU | Când s-a finalizat execuția (async, poate fi ușor după `message.created_at`). |

**Reguli de business:**

- INSERT-ul este **ASINCRON** — nu blochează niciodată răspunsul chat-ului
- `conversation_id` și `tunnel` sunt DENORMALIZATE intenționat pentru performanță analytics
- Dacă `had_fallback > 10%` = **ALERTĂ** — pipeline-ul are probleme
- Latency target: template <2s, haiku <5s, sonnet <8s

---

## 9. ⚙️ app_settings

**Tabelă singleton — conține exact UN SINGUR rând, întotdeauna. Configurarea globală pentru întregul sistem de chatbot. Editabilă din pagina Settings din admin panel. Modificările intră în efect IMEDIAT (fără restart).**

| Câmp | Tip | Null? | Descriere |
|------|-----|-------|-----------|
| 🔴 `id` | uuid PK | NU | ID-ul singurului rând. Index UNIQUE pe `(true)` asigură un singur rând. |
| `company_name` | varchar(255) | NU | Numele companiei în header-ul widget-ului și salutări. Default: `Buy Business Class`. |
| `widget_position` | varchar(20) | NU | Unde apare widget-ul: `bottom-right` (default) sau `bottom-left`. |
| `sales_greeting` | text | NU | Primul mesaj în tunelul sales. Default: "Welcome! Where are you looking to fly in business class?" |
| `support_greeting` | text | NU | Primul mesaj în tunelul support. Default: "Hi! I can help with booking changes, cancellations, or questions about your trip." |
| `business_hours_start` | time | NU | Când încep agenții: `09:00`. |
| `business_hours_end` | time | NU | Când termină agenții: `18:00`. |
| `business_timezone` | varchar(50) | NU | Fusul orar: `America/New_York` (EST). Toate comparațiile de timp folosesc acest fus. |
| `auto_reply_after_hours` | boolean | NU | Dacă `true`: în afara programului, bot-ul trimite `after_hours_message`. Default: `true`. |
| `after_hours_message` | text | NU | Mesajul trimis în afara programului. Default: "Our specialists are available 9 AM - 6 PM EST. Leave your number and we will reach out first thing tomorrow." |
| `max_ai_messages_per_conv` | int | NU | Limită siguranță: max răspunsuri AI per conversație. Previne bucle infinite. Default: `20`. |
| `pipeline_timeout_sec` | int | NU | Max secunde așteptare răspuns AI → fallback template. Default: `10`. Se mărește dacă Sonnet face timeout. |
| `enable_lead_notifications` | boolean | NU | Dacă `true`: notifică agentul la lead nou. V1: console log, V2: Slack. Default: `true`. |
| `enable_slack_notifications` | boolean | NU | Dacă `true` ȘI `slack_webhook_url` setat: trimite pe Slack. Default: `false`. |
| `slack_webhook_url` | varchar(500) | *DA* | URL webhook Slack: `https://hooks.slack.com/services/T.../B.../xxx`. NULL = Slack dezactivat. |
| `lead_callback_sla_minutes` | int | NU | SLA callback lead-uri noi, în minute. Default: `120` (2 ore). Agentul trebuie să sune în acest interval. Dashboard: rata conformitate SLA. |
| `updated_at` | timestamptz | NU | Ultima modificare a oricărei setări. Auto-actualizat prin trigger. |

**Reguli de business:**

- **EXACT UN RÂND** — niciodată zero, niciodată mai mult de unu
- Modificările intră în efect **IMEDIAT** — pipeline-ul citește settings la fiecare request
- Singleton pattern: INSERT la seed, doar UPDATE ulterior
- `lead_callback_sla_minutes` = SLA-ul principal (tickets au fost eliminate din schema)

---

## Funcția sync_lead_derived()

Când segmentele unui lead se modifică (INSERT/DELETE), pipeline-ul apelează această funcție care actualizează **ATOMIC** toate câmpurile derived de pe lead:

```python
def sync_lead_derived(lead_id):
    segments = db.query(RouteSegment).filter_by(lead_id=lead_id).order_by("segment_order").all()
    
    if not segments:
        return  # niciun segment încă
    
    lead.origin_code       = segments[0].origin_code
    lead.destination_code  = segments[0].destination_code
    lead.departure_date    = segments[0].departure_date
    lead.return_date       = segments[-1].departure_date if len(segments) > 1 else None
    lead.total_nights      = sum(s.stay_nights or 0 for s in segments)
    lead.route_display     = build_route_display(segments, lead.trip_type)
    lead.score             = calculate_score(lead)
    lead.tier              = "gold" if lead.score >= 80 else "silver" if lead.score >= 50 else "bronze"
    
    db.commit()  # ONE atomic UPDATE
```

---

## Changelog

| Versiune | Data | Schimbări |
|----------|------|-----------|
| V1-V4 | Feb 2026 | Schema inițială 12 tabele → optimizare 9 tabele |
| V5 | Mar 2026 | Adăugat route_segments cu stay_nights, is_stopover, transport_mode |
| V6 | Mar 2026 | Eliminat tickets (V1 fără support workflow) |
| V7 | Mar 2026 | Eliminat departure_date/return_date de pe leads (duplicate cu segments) |
| **V8** | **Mar 2026** | **Audit complet 5-agenți. +5 derived fields pe leads (origin_code, destination_code, departure_date, return_date, total_nights). -segment_type de pe route_segments. +arrival_date, +entities_extracted. Redenumit SLA.** |