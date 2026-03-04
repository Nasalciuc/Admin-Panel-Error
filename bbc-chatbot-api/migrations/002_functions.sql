-- ============================================================
-- BBC AI CHATBOT — FUNCTIONS & TRIGGERS V1
-- IMPORTANT: Rulează DUPĂ 001_schema.sql (tabele trebuie să existe)
-- ============================================================

-- ============================================================
-- TRIGGER 1: fn_update_timestamp()
-- Actualizează updated_at la fiecare UPDATE
-- Aplicat pe: users, conversations, kb_categories, kb_entries, leads, app_settings
-- ============================================================
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_kb_categories_updated_at
    BEFORE UPDATE ON kb_categories
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_kb_entries_updated_at
    BEFORE UPDATE ON kb_entries
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ============================================================
-- TRIGGER 2: fn_increment_message_count()
-- Incrementează message_count pe conversations la INSERT messages
-- ============================================================
CREATE OR REPLACE FUNCTION fn_increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET message_count = message_count + 1
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_message_count
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION fn_increment_message_count();

-- ============================================================
-- TRIGGER 3: fn_accumulate_ai_cost()
-- Adaugă costul AI la ai_cost_total pe conversations
-- SAFE: EXCEPTION HANDLER — nu blochează INSERT messages
-- ============================================================
CREATE OR REPLACE FUNCTION fn_accumulate_ai_cost()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cost > 0 THEN
        BEGIN
            UPDATE conversations
            SET ai_cost_total = ai_cost_total + NEW.cost
            WHERE id = NEW.conversation_id;
        EXCEPTION WHEN others THEN
            -- Nu blocăm INSERT-ul messages pentru erori de cost
            RAISE NOTICE 'fn_accumulate_ai_cost error (non-fatal): %', SQLERRM;
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accumulate_ai_cost
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION fn_accumulate_ai_cost();

-- ============================================================
-- TRIGGER 4: fn_sync_lead_derived()
-- Sincronizează câmpuri derived pe leads din route_segments
-- Calculează: origin_code, destination_code, departure_date, return_date
-- NOTE: total_nights și route_display se calculează în Python (lead_service.py)
-- ============================================================
CREATE OR REPLACE FUNCTION fn_sync_lead_derived()
RETURNS TRIGGER AS $$
DECLARE
    v_lead_id       uuid;
    v_first_seg     RECORD;
    v_last_seg      RECORD;
BEGIN
    -- Determină lead_id din trigger
    v_lead_id := CASE
        WHEN TG_OP = 'DELETE' THEN OLD.lead_id
        ELSE NEW.lead_id
    END;

    -- Primul segment (segment_order minim)
    SELECT origin_code, destination_code, departure_date
    INTO v_first_seg
    FROM route_segments
    WHERE lead_id = v_lead_id
    ORDER BY segment_order ASC
    LIMIT 1;

    -- Ultimul segment (segment_order maxim)
    SELECT departure_date
    INTO v_last_seg
    FROM route_segments
    WHERE lead_id = v_lead_id
    ORDER BY segment_order DESC
    LIMIT 1;

    -- Update leads cu datele sincronizate
    UPDATE leads SET
        origin_code      = v_first_seg.origin_code,
        destination_code = v_first_seg.destination_code,
        departure_date   = v_first_seg.departure_date,
        return_date      = CASE
            WHEN (SELECT COUNT(*) FROM route_segments WHERE lead_id = v_lead_id) > 1
            THEN v_last_seg.departure_date
            ELSE NULL
        END
    WHERE id = v_lead_id;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_lead_derived
    AFTER INSERT OR UPDATE OR DELETE ON route_segments
    FOR EACH ROW EXECUTE FUNCTION fn_sync_lead_derived();
