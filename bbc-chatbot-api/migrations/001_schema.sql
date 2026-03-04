-- ============================================================
-- BBC AI CHATBOT — SCHEMA V10
-- 9 tabele · 120+ câmpuri · Martie 2026
-- COMPATIBIL: PostgreSQL 15+ (inclusiv Supabase PG15/PG17)
-- IMPORTANT: Executa in ordine FK — ALTER ORDINEA = FK ERRORS
-- ============================================================

-- Extensions (ÎNAINTE de CREATE TABLE)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ============================================================
-- 1. USERS — root table, fără FK externe
-- ============================================================
CREATE TABLE users (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    email           varchar(255) NOT NULL UNIQUE,
    name            varchar(255) NOT NULL,
    role            varchar(20)  NOT NULL DEFAULT 'sales'
                    CHECK (role IN ('owner', 'admin', 'sales', 'support')),
    tunnel_scope    varchar(20)  NOT NULL DEFAULT 'sales'
                    CHECK (tunnel_scope IN ('sales', 'support', 'all')),
    avatar_url      varchar(500),
    is_active       boolean      NOT NULL DEFAULT true,
    last_seen_at    timestamptz,
    created_at      timestamptz  NOT NULL DEFAULT NOW(),
    updated_at      timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. CONVERSATIONS — FK → users (optional)
-- ============================================================
CREATE TABLE conversations (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    tunnel              varchar(10)  NOT NULL
                        CHECK (tunnel IN ('sales', 'support')),
    mode                varchar(20)  NOT NULL DEFAULT 'ai'
                        CHECK (mode IN ('ai', 'human', 'waiting_for_agent')),
    status              varchar(10)  NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'pending', 'closed')),
    visitor_name        varchar(255),
    visitor_email       varchar(255),
    visitor_phone       varchar(50),
    metadata            jsonb        NOT NULL DEFAULT '{}',
    assigned_agent_id   uuid         REFERENCES users(id) ON DELETE SET NULL,
    message_count       int          NOT NULL DEFAULT 0,
    ai_cost_total       decimal(10,6) NOT NULL DEFAULT 0,
    created_at          timestamptz  NOT NULL DEFAULT NOW(),
    updated_at          timestamptz  NOT NULL DEFAULT NOW(),
    closed_at           timestamptz
);

-- ============================================================
-- 3. MESSAGES — FK → conversations (CASCADE)
-- ============================================================
CREATE TABLE messages (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid        NOT NULL
                    REFERENCES conversations(id) ON DELETE CASCADE,
    role            varchar(10)  NOT NULL
                    CHECK (role IN ('user', 'ai', 'agent', 'system')),
    content         text         NOT NULL,
    model_used      varchar(30),
    cost            decimal(10,6) NOT NULL DEFAULT 0,
    created_at      timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. KB_CATEGORIES — independent (fără FK externe)
-- ============================================================
CREATE TABLE kb_categories (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        varchar(255) NOT NULL,
    tunnel      varchar(10)  NOT NULL
                CHECK (tunnel IN ('sales', 'support')),
    icon        varchar(50)  NOT NULL DEFAULT 'FileText',
    sort_order  int          NOT NULL DEFAULT 0,
    created_at  timestamptz  NOT NULL DEFAULT NOW(),
    updated_at  timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. KB_ENTRIES — FK → kb_categories (CASCADE)
-- ============================================================
CREATE TABLE kb_entries (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     uuid        NOT NULL
                    REFERENCES kb_categories(id) ON DELETE CASCADE,
    title           varchar(255) NOT NULL,
    content         text         NOT NULL DEFAULT '',
    tunnel          varchar(10)  NOT NULL
                    CHECK (tunnel IN ('sales', 'support')),
    is_active       boolean      NOT NULL DEFAULT true,
    view_count      int          NOT NULL DEFAULT 0,
    search_vector   tsvector     GENERATED ALWAYS AS (
                        to_tsvector('english',
                            coalesce(title, '') || ' ' || coalesce(content, ''))
                    ) STORED,
    created_at      timestamptz  NOT NULL DEFAULT NOW(),
    updated_at      timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. LEADS — FK → conversations (CASCADE + UNIQUE 1:1)
-- ============================================================
CREATE TABLE leads (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     uuid        NOT NULL UNIQUE
                        REFERENCES conversations(id) ON DELETE CASCADE,
    trip_type           varchar(20)  NOT NULL DEFAULT 'round_trip'
                        CHECK (trip_type IN ('one_way','round_trip','multi_city','open_jaw','tour')),
    cabin_class         varchar(20)  NOT NULL DEFAULT 'business'
                        CHECK (cabin_class IN ('business','first','economy','mixed')),
    passengers          int,
    flexible_dates      boolean      NOT NULL DEFAULT true,
    -- SYNC câmpuri (calculate automat din route_segments via trigger)
    origin_code         varchar(10),
    destination_code    varchar(10),
    departure_date      date,
    return_date         date,
    total_nights        int,
    route_display       text,
    -- Scoring
    score               int          NOT NULL DEFAULT 0
                        CHECK (score >= 0 AND score <= 100),
    tier                varchar(10)  NOT NULL DEFAULT 'bronze'
                        CHECK (tier IN ('bronze', 'silver', 'gold')),
    -- Status
    status              varchar(20)  NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new','contacted','qualified','converted','lost')),
    -- Metadata
    intent_signals      jsonb        NOT NULL DEFAULT '[]',
    status_history      jsonb        NOT NULL DEFAULT '[]',
    notes               text         NOT NULL DEFAULT '',
    -- Timestamps
    created_at          timestamptz  NOT NULL DEFAULT NOW(),
    updated_at          timestamptz  NOT NULL DEFAULT NOW(),
    contacted_at        timestamptz,
    converted_at        timestamptz
);

-- ============================================================
-- 7. ROUTE_SEGMENTS — FK → leads (CASCADE)
-- ============================================================
CREATE TABLE route_segments (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id             uuid        NOT NULL
                        REFERENCES leads(id) ON DELETE CASCADE,
    segment_order       int          NOT NULL,
    origin_code         varchar(10)  NOT NULL,
    origin_city         varchar(100) NOT NULL DEFAULT '',
    destination_code    varchar(10)  NOT NULL,
    destination_city    varchar(100) NOT NULL DEFAULT '',
    departure_date      date,
    departure_time      time,
    arrival_date        date,
    arrival_time        time,
    airline_code        varchar(10),
    flight_number       varchar(20),
    cabin_class         varchar(20)  NOT NULL DEFAULT 'business'
                        CHECK (cabin_class IN ('business','first','economy','mixed')),
    segment_type        varchar(20)  NOT NULL DEFAULT 'flight'
                        CHECK (segment_type IN ('flight','ground')),
    stay_nights         int          NOT NULL DEFAULT 0,
    is_stopover         boolean      NOT NULL DEFAULT false,
    transport_mode      varchar(20)  NOT NULL DEFAULT 'flight'
                        CHECK (transport_mode IN ('flight','train','bus','ferry','car'))
);

-- ============================================================
-- 8. PIPELINE_RUNS — FK → messages (CASCADE)
-- ============================================================
CREATE TABLE pipeline_runs (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id          uuid        NOT NULL
                        REFERENCES messages(id) ON DELETE CASCADE,
    conversation_id     uuid        NOT NULL
                        REFERENCES conversations(id) ON DELETE CASCADE,
    step_name           varchar(50)  NOT NULL,
    intent_detected     varchar(50),
    kb_entries_used     int          NOT NULL DEFAULT 0,
    kb_entry_ids        jsonb        NOT NULL DEFAULT '[]',
    model_used          varchar(30),
    prompt_tokens       int          NOT NULL DEFAULT 0,
    completion_tokens   int          NOT NULL DEFAULT 0,
    cost                decimal(10,6) NOT NULL DEFAULT 0,
    latency_ms          int          NOT NULL DEFAULT 0,
    status              varchar(20)  NOT NULL DEFAULT 'success'
                        CHECK (status IN ('success','error','timeout','fallback')),
    error_message       text,
    entities_extracted  jsonb        NOT NULL DEFAULT '{}',
    created_at          timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 9. APP_SETTINGS — singleton (1 rând, id=1 forțat)
-- ============================================================
CREATE TABLE app_settings (
    id                      int         PRIMARY KEY DEFAULT 1
                            CHECK (id = 1),
    company_name            varchar(255) NOT NULL DEFAULT 'Buy Business Class',
    support_email           varchar(255) NOT NULL DEFAULT 'support@buybusinessclass.com',
    sales_email             varchar(255) NOT NULL DEFAULT 'sales@buybusinessclass.com',
    widget_greeting_sales   text         NOT NULL DEFAULT 'Looking for premium business class flights? Tell us your route and dates!',
    widget_greeting_support text         NOT NULL DEFAULT 'How can we help you today?',
    max_conversation_length int          NOT NULL DEFAULT 50,
    auto_close_minutes      int          NOT NULL DEFAULT 30,
    lead_sla_hours          int          NOT NULL DEFAULT 2,
    score_weight_name       int          NOT NULL DEFAULT 20,
    score_weight_phone      int          NOT NULL DEFAULT 15,
    score_weight_email      int          NOT NULL DEFAULT 10,
    score_weight_route      int          NOT NULL DEFAULT 15,
    score_weight_dates      int          NOT NULL DEFAULT 10,
    score_weight_passengers int          NOT NULL DEFAULT 10,
    score_threshold_gold    int          NOT NULL DEFAULT 80,
    score_threshold_silver  int          NOT NULL DEFAULT 50,
    created_at              timestamptz  NOT NULL DEFAULT NOW(),
    updated_at              timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 10. SCHEMA_VERSION — tracking
-- ============================================================
CREATE TABLE schema_version (
    version     varchar(20)  PRIMARY KEY,
    description text,
    applied_at  timestamptz  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES (22 total)
-- ============================================================

-- conversations
CREATE INDEX idx_conv_tunnel           ON conversations(tunnel);
CREATE INDEX idx_conv_status           ON conversations(status);
CREATE INDEX idx_conv_tunnel_status    ON conversations(tunnel, status);
CREATE INDEX idx_conv_created          ON conversations(created_at DESC);
CREATE INDEX idx_conv_agent            ON conversations(assigned_agent_id) WHERE assigned_agent_id IS NOT NULL;

-- messages
CREATE INDEX idx_msg_conv_id           ON messages(conversation_id);
CREATE INDEX idx_msg_conv_created      ON messages(conversation_id, created_at ASC);

-- kb_entries
CREATE INDEX idx_kb_entries_tunnel     ON kb_entries(tunnel, is_active);
CREATE INDEX idx_kb_entries_category   ON kb_entries(category_id);
CREATE INDEX idx_kb_entries_vector     ON kb_entries USING GIN(search_vector);
CREATE INDEX idx_kb_entries_trgm_title ON kb_entries USING GIN(title gin_trgm_ops);

-- leads
CREATE INDEX idx_leads_conv_id         ON leads(conversation_id);
CREATE INDEX idx_leads_status          ON leads(status);
CREATE INDEX idx_leads_tier            ON leads(tier);
CREATE INDEX idx_leads_score           ON leads(score DESC);
CREATE INDEX idx_leads_status_tier     ON leads(status, tier);
CREATE INDEX idx_leads_departure       ON leads(departure_date) WHERE departure_date IS NOT NULL;
CREATE INDEX idx_leads_origin          ON leads(origin_code) WHERE origin_code IS NOT NULL;

-- route_segments
CREATE INDEX idx_segments_lead_id      ON route_segments(lead_id, segment_order ASC);

-- pipeline_runs
CREATE INDEX idx_pipeline_message      ON pipeline_runs(message_id);
CREATE INDEX idx_pipeline_conv         ON pipeline_runs(conversation_id, created_at DESC);
CREATE INDEX idx_pipeline_model        ON pipeline_runs(model_used) WHERE model_used IS NOT NULL;

-- ============================================================
-- SCHEMA VERSION INSERT
-- ============================================================
INSERT INTO schema_version (version, description)
VALUES ('V10', 'Initial schema — 9 tabele, 120+ câmpuri, BBC AI Chatbot Martie 2026');

COMMENT ON DATABASE bbc_chatbot IS 'BBC AI Chatbot — Schema V10 — Martie 2026';
