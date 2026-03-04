-- ============================================================
-- BBC AI CHATBOT — SEED DATA V1
-- 5 scenarii business reale + KB + app_settings
-- IMPORTANT: Rulează DUPĂ 002_functions.sql
-- NOTE: Fiecare scenariu e un bloc CTE independent
-- ============================================================

-- ============================================================
-- APP SETTINGS (singleton)
-- ============================================================
INSERT INTO app_settings (id, company_name, support_email, sales_email)
VALUES (1, 'Buy Business Class', 'support@buybusinessclass.com', 'sales@buybusinessclass.com')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- USERS (agents demo)
-- ============================================================
INSERT INTO users (id, email, name, role, tunnel_scope) VALUES
    ('a0000001-0000-0000-0000-000000000001', 'maria@buybusinessclass.com', 'Maria Ionescu', 'sales', 'sales'),
    ('a0000001-0000-0000-0000-000000000002', 'ion@buybusinessclass.com', 'Ion Popescu', 'support', 'support'),
    ('a0000001-0000-0000-0000-000000000003', 'dan@buybusinessclass.com', 'Dan Directoru', 'owner', 'all')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- KB CATEGORIES
-- ============================================================
INSERT INTO kb_categories (id, name, tunnel, icon, sort_order) VALUES
    ('b0000001-0000-0000-0000-000000000001', 'Routes & Destinations', 'sales', 'Plane', 1),
    ('b0000001-0000-0000-0000-000000000002', 'Pricing & Promotions', 'sales', 'DollarSign', 2),
    ('b0000001-0000-0000-0000-000000000003', 'Booking Process', 'sales', 'ClipboardList', 3),
    ('b0000001-0000-0000-0000-000000000004', 'Changes & Cancellations', 'support', 'RefreshCw', 1),
    ('b0000001-0000-0000-0000-000000000005', 'Baggage & Policies', 'support', 'Luggage', 2)
ON CONFLICT DO NOTHING;

-- ============================================================
-- KB ENTRIES (15 articole)
-- ============================================================
INSERT INTO kb_entries (category_id, title, content, tunnel) VALUES
    -- Sales: Routes
    ('b0000001-0000-0000-0000-000000000001', 'NYC to London Business Class',
     'JFK to LHR business class: British Airways, Virgin Atlantic, Delta One. Duration 7h20m nonstop. Fares typically $2,800-$4,500 round trip. Best booking window: 3-6 months ahead. Peak season: June-September. Best fares: January-February.',
     'sales'),
    ('b0000001-0000-0000-0000-000000000001', 'NYC to Paris Business Class',
     'JFK to CDG: Air France, United Polaris, American. Duration 7h50m nonstop. Fares typically $2,600-$4,200 round trip. Air France La Premiere first class available. Best fares: November-January.',
     'sales'),
    ('b0000001-0000-0000-0000-000000000001', 'NYC to Dubai Business Class',
     'JFK to DXB: Emirates (nonstop 12h, exceptional Business class with bar), Etihad via AUH. Fares $3,200-$5,500 round trip. Emirates Business = lie-flat + lounge access. Peak: November-April.',
     'sales'),
    ('b0000001-0000-0000-0000-000000000001', 'European Multi-City Tours',
     'Popular: London → Paris → Rome → home. Train connections Paris-Rome available. Buy Business Class handles mixed airline + rail itineraries. Planning window: 4-8 months. Average saving vs direct booking: 35-55%.',
     'sales'),
    -- Sales: Pricing
    ('b0000001-0000-0000-0000-000000000002', 'How BBC Saves You Money',
     'Buy Business Class uses consolidator fares and airline partnerships to offer 30-70% savings vs published prices. We access inventory not visible on public booking sites. Savings are real — your ticket is fully valid and appears in airline system.',
     'sales'),
    ('b0000001-0000-0000-0000-000000000002', 'Business Class Price Ranges 2025',
     'Typical round-trip business class: NYC-London $2,800-4,500 | NYC-Paris $2,600-4,200 | NYC-Tokyo $3,500-6,000 | NYC-Dubai $3,200-5,500 | NYC-Singapore $3,800-6,200. First class adds 60-120%. Prices exclude taxes.',
     'sales'),
    ('b0000001-0000-0000-0000-000000000002', 'Corporate & Group Bookings',
     'Groups of 4+ passengers qualify for additional discounts (typically 10-20% extra). Corporate accounts get dedicated specialist, priority callback (1h vs standard 2h), monthly invoicing available. Contact sales@buybusinessclass.com.',
     'sales'),
    -- Sales: Booking
    ('b0000001-0000-0000-0000-000000000003', 'How the Booking Process Works',
     '1. Tell us your route, dates, passengers. 2. Specialist finds best options within 2 hours (1h for corporate). 3. You review and select. 4. Payment processed securely. 5. E-ticket sent within 30 minutes. All major cards, wire transfer, FlexPay installments accepted.',
     'sales'),
    ('b0000001-0000-0000-0000-000000000003', 'Booking Timeline & Best Practices',
     'Recommended booking window: 3-6 months for best availability and price. Last-minute (under 2 weeks) is possible but options are limited. Flexible dates (±3 days) can save 15-25%. Tuesdays and Wednesdays typically have better availability.',
     'sales'),
    -- Support: Changes
    ('b0000001-0000-0000-0000-000000000004', 'How to Change Your Booking Date',
     'Contact support@buybusinessclass.com with booking reference and new preferred dates. Date changes: most business class tickets allow 1 free change (airline fees may apply, fare difference may apply). Contact at least 48h before departure. We handle the rebooking.',
     'support'),
    ('b0000001-0000-0000-0000-000000000004', 'Cancellation Policy',
     'Cancellation depends on airline fare rules. Most business class tickets: refundable minus $150-300 service fee. Non-refundable tickets: credit/voucher towards future booking. Cancel as early as possible — penalties increase within 24h of departure. Contact us immediately.',
     'support'),
    ('b0000001-0000-0000-0000-000000000004', 'Name Change Policy',
     'Passenger name changes: most airlines prohibit full name changes. Minor corrections (typos up to 3 chars) usually free. Full name change = typically requires cancel + rebook. Contact us before attempting name change directly with airline.',
     'support'),
    -- Support: Baggage
    ('b0000001-0000-0000-0000-000000000005', 'Business Class Baggage Allowance',
     'Standard business class baggage: 2 checked bags (32kg/70lb each) + 1 carry-on + 1 personal item. First class: 3 checked bags. Emirates: unlimited baggage on some routes. Always verify with specific airline — allowances vary by route and ticket type.',
     'support'),
    ('b0000001-0000-0000-0000-000000000005', 'Seat Selection & Upgrades',
     'Business class seat selection: usually free during booking or 24-72h before departure depending on airline. Upgrade from economy: contact us — we have access to upgrade inventory. Bid upgrades (airlines direct): we can assist with the process.',
     'support'),
    ('b0000001-0000-0000-0000-000000000005', 'Special Requests & Accessibility',
     'Special meals: request when booking (kosher, halal, vegan, medical diets). Wheelchair/accessibility: request 72h in advance. Traveling with infant: different rules per airline — contact us for options. Extra legroom requests available for most airlines.',
     'support');

-- ============================================================
-- SCENARIU 1: Round-trip Gold Lead (JFK → LHR)
-- ============================================================
DO $$
DECLARE
    v_conv_id   uuid := 'c1000001-0000-0000-0000-000000000001';
    v_msg1_id   uuid := 'd1000001-0000-0000-0000-000000000001';
    v_msg2_id   uuid := 'd1000001-0000-0000-0000-000000000002';
    v_msg3_id   uuid := 'd1000001-0000-0000-0000-000000000003';
    v_msg4_id   uuid := 'd1000001-0000-0000-0000-000000000004';
    v_msg5_id   uuid := 'd1000001-0000-0000-0000-000000000005';
    v_msg6_id   uuid := 'd1000001-0000-0000-0000-000000000006';
    v_msg7_id   uuid := 'd1000001-0000-0000-0000-000000000007';
    v_msg8_id   uuid := 'd1000001-0000-0000-0000-000000000008';
    v_lead_id   uuid := 'e1000001-0000-0000-0000-000000000001';
BEGIN
    -- Conversation
    INSERT INTO conversations (id, tunnel, status, visitor_name, visitor_email, visitor_phone, assigned_agent_id, created_at)
    VALUES (v_conv_id, 'sales', 'closed', 'John Thompson', 'john.thompson@email.com', '+1-212-555-0187',
            'a0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days');

    -- Messages
    INSERT INTO messages (id, conversation_id, role, content, model_used, cost, created_at) VALUES
        (v_msg1_id, v_conv_id, 'user', 'Hi, I need business class flights from New York to London for March 15, returning March 22.', NULL, 0, NOW() - INTERVAL '2 days' + INTERVAL '0 min'),
        (v_msg2_id, v_conv_id, 'ai', 'Welcome to Buy Business Class! NYC to London is one of our most popular routes. For March 15-22, we have excellent options with British Airways Club World, Virgin Atlantic Upper Class, and Delta One. Typically $2,800-$4,200 round trip. May I ask how many passengers?', 'template', 0, NOW() - INTERVAL '2 days' + INTERVAL '1 min'),
        (v_msg3_id, v_conv_id, 'user', 'Just me, business class. My wife might join too, not sure yet.', NULL, 0, NOW() - INTERVAL '2 days' + INTERVAL '3 min'),
        (v_msg4_id, v_conv_id, 'ai', 'No problem, I can check options for 1 or 2 passengers. British Airways nonstop JFK-LHR is excellent — 7h20m with fully lie-flat seats. Are you flexible by a day or two? We sometimes find better fares ±2 days.', 'haiku', 0.003, NOW() - INTERVAL '2 days' + INTERVAL '4 min'),
        (v_msg5_id, v_conv_id, 'user', 'I could do March 14 or 15. Yes flexible. Business class only, my company requires it.', NULL, 0, NOW() - INTERVAL '2 days' + INTERVAL '6 min'),
        (v_msg6_id, v_conv_id, 'ai', 'Perfect. With flexibility, I can often find 15-25% better rates. For a corporate traveler, British Airways Club Suite is particularly popular — direct aisle access, privacy screen, excellent for working. Shall I have a specialist prepare a quote to your email?', 'haiku', 0.003, NOW() - INTERVAL '2 days' + INTERVAL '7 min'),
        (v_msg7_id, v_conv_id, 'user', 'Yes please. john.thompson@email.com, phone +1-212-555-0187.', NULL, 0, NOW() - INTERVAL '2 days' + INTERVAL '9 min'),
        (v_msg8_id, v_conv_id, 'ai', 'All captured! Our specialist will contact you within 2 hours at john.thompson@email.com with 2-3 options including our best rate. Have a great flight, John!', 'template', 0, NOW() - INTERVAL '2 days' + INTERVAL '10 min');

    -- Update visitor info on conversation
    UPDATE conversations SET visitor_email = 'john.thompson@email.com', visitor_phone = '+1-212-555-0187' WHERE id = v_conv_id;

    -- Lead
    INSERT INTO leads (id, conversation_id, trip_type, cabin_class, passengers, flexible_dates, score, tier, status,
                       intent_signals, notes, contacted_at)
    VALUES (v_lead_id, v_conv_id, 'round_trip', 'business', 1, true, 85, 'gold', 'contacted',
            '["corporate","flexible","specific_dates","phone_provided"]',
            'Corporate traveler, requires business class per company policy. Flexible ±2 days March 14-15. Wife may join = check 2pax pricing too.',
            NOW() - INTERVAL '2 days' + INTERVAL '1 hour');

    -- Route segments
    INSERT INTO route_segments (lead_id, segment_order, origin_code, origin_city, destination_code, destination_city,
                                 departure_date, airline_code, cabin_class, segment_type, stay_nights)
    VALUES
        (v_lead_id, 1, 'JFK', 'New York', 'LHR', 'London', '2026-03-15', 'BA', 'business', 'flight', 7),
        (v_lead_id, 2, 'LHR', 'London', 'JFK', 'New York', '2026-03-22', 'BA', 'business', 'flight', 0);

    -- Pipeline runs
    INSERT INTO pipeline_runs (message_id, conversation_id, step_name, intent_detected, kb_entries_used, model_used, cost, latency_ms, status)
    VALUES
        (v_msg2_id, v_conv_id, 'orchestrator_v1', 'booking_inquiry', 2, 'template', 0, 45, 'success'),
        (v_msg4_id, v_conv_id, 'orchestrator_v1', 'booking_inquiry', 3, 'haiku', 0.003, 1240, 'success'),
        (v_msg6_id, v_conv_id, 'orchestrator_v1', 'booking_inquiry', 2, 'haiku', 0.003, 980, 'success'),
        (v_msg8_id, v_conv_id, 'orchestrator_v1', 'lead_captured', 0, 'template', 0, 35, 'success');
END $$;

-- ============================================================
-- SCENARIU 2: European Tour Silver Lead (multi-city)
-- ============================================================
DO $$
DECLARE
    v_conv_id   uuid := 'c2000001-0000-0000-0000-000000000001';
    v_msg1_id   uuid := 'd2000001-0000-0000-0000-000000000001';
    v_msg2_id   uuid := 'd2000001-0000-0000-0000-000000000002';
    v_msg3_id   uuid := 'd2000001-0000-0000-0000-000000000003';
    v_msg4_id   uuid := 'd2000001-0000-0000-0000-000000000004';
    v_lead_id   uuid := 'e2000001-0000-0000-0000-000000000001';
BEGIN
    INSERT INTO conversations (id, tunnel, status, visitor_name, visitor_email, visitor_phone, created_at)
    VALUES (v_conv_id, 'sales', 'closed', 'Sarah Miller', 'sarah.miller@gmail.com', '+1-310-555-0293', NOW() - INTERVAL '5 days');

    INSERT INTO messages (id, conversation_id, role, content, model_used, cost, created_at) VALUES
        (v_msg1_id, v_conv_id, 'user', 'We want to do a European tour — London, Paris, Rome — flying business class. 2 passengers, June.', NULL, 0, NOW() - INTERVAL '5 days'),
        (v_msg2_id, v_conv_id, 'ai', 'A European tour sounds wonderful! For 2 passengers in June, we can arrange: NYC→London (fly business), train London→Paris (Eurostar), Paris→Rome (fly or train), Rome→NYC (fly business). June is peak season, typical investment $6,000-8,500 for 2 passengers total. When in June?', 'haiku', 0.004, NOW() - INTERVAL '5 days' + INTERVAL '2 min'),
        (v_msg3_id, v_conv_id, 'user', 'June 10-25. We want 4-5 nights each city. Budget around $8000 for both of us.', NULL, 0, NOW() - INTERVAL '5 days' + INTERVAL '4 min'),
        (v_msg4_id, v_conv_id, 'ai', 'June 10-25 with 4-5 nights per city: London (June 10-14), Paris (June 14-19), Rome (June 19-24), return June 24. That works perfectly for your $8,000 budget — we often come in under. Email for the detailed quote?', 'haiku', 0.005, NOW() - INTERVAL '5 days' + INTERVAL '6 min');

    INSERT INTO leads (id, conversation_id, trip_type, cabin_class, passengers, flexible_dates, score, tier, status, intent_signals)
    VALUES (v_lead_id, v_conv_id, 'tour', 'mixed', 2, false, 65, 'silver', 'contacted',
            '["anniversary","couple","budget_stated","june"]');

    INSERT INTO route_segments (lead_id, segment_order, origin_code, origin_city, destination_code, destination_city,
                                 departure_date, cabin_class, segment_type, stay_nights, transport_mode)
    VALUES
        (v_lead_id, 1, 'JFK', 'New York', 'LHR', 'London',   '2026-06-10', 'business', 'flight',  4, 'flight'),
        (v_lead_id, 2, 'LHR', 'London',   'CDG', 'Paris',    '2026-06-14', 'economy',  'ground',  5, 'train'),
        (v_lead_id, 3, 'CDG', 'Paris',    'FCO', 'Rome',     '2026-06-19', 'economy',  'ground',  5, 'train'),
        (v_lead_id, 4, 'FCO', 'Rome',     'JFK', 'New York', '2026-06-24', 'business', 'flight',  0, 'flight');

    INSERT INTO pipeline_runs (message_id, conversation_id, step_name, intent_detected, kb_entries_used, model_used, cost, latency_ms, status)
    VALUES
        (v_msg2_id, v_conv_id, 'orchestrator_v1', 'booking_inquiry', 3, 'haiku', 0.004, 1450, 'success'),
        (v_msg4_id, v_conv_id, 'orchestrator_v1', 'booking_inquiry', 2, 'haiku', 0.005, 1680, 'success');
END $$;

-- ============================================================
-- SCENARIU 3: Open-jaw Bronze Lead
-- ============================================================
DO $$
DECLARE
    v_conv_id   uuid := 'c3000001-0000-0000-0000-000000000001';
    v_msg1_id   uuid := 'd3000001-0000-0000-0000-000000000001';
    v_msg2_id   uuid := 'd3000001-0000-0000-0000-000000000002';
    v_msg3_id   uuid := 'd3000001-0000-0000-0000-000000000003';
    v_lead_id   uuid := 'e3000001-0000-0000-0000-000000000001';
BEGIN
    INSERT INTO conversations (id, tunnel, status, visitor_email, created_at)
    VALUES (v_conv_id, 'sales', 'closed', 'anon.lead@email.com', NOW() - INTERVAL '1 day');

    INSERT INTO messages (id, conversation_id, role, content, model_used, cost, created_at) VALUES
        (v_msg1_id, v_conv_id, 'user', 'I fly NYC to London, but come back from Paris. Business class. April.', NULL, 0, NOW() - INTERVAL '1 day'),
        (v_msg2_id, v_conv_id, 'ai', 'That is an open-jaw itinerary — very common for European trips! NYC→London outbound, Paris→NYC return. Great option with Eurostar between London-Paris (2h15m). For April, business class open-jaw typically $2,400-3,800. Any specific dates?', 'haiku', 0.003, NOW() - INTERVAL '1 day' + INTERVAL '1 min'),
        (v_msg3_id, v_conv_id, 'user', 'Maybe April 5-15. I am alone. Can you send info to anon.lead@email.com?', NULL, 0, NOW() - INTERVAL '1 day' + INTERVAL '3 min');

    UPDATE conversations SET visitor_email = 'anon.lead@email.com' WHERE id = v_conv_id;

    INSERT INTO leads (id, conversation_id, trip_type, cabin_class, passengers, flexible_dates, score, tier, status, notes)
    VALUES (v_lead_id, v_conv_id, 'open_jaw', 'business', 1, true, 35, 'bronze', 'new',
            'Open-jaw JFK→LHR, CDG→JFK. No phone provided. Email only lead.');

    INSERT INTO route_segments (lead_id, segment_order, origin_code, origin_city, destination_code, destination_city,
                                 departure_date, cabin_class, segment_type, stay_nights)
    VALUES
        (v_lead_id, 1, 'JFK', 'New York', 'LHR', 'London', '2026-04-05', 'business', 'flight', 10),
        (v_lead_id, 2, 'CDG', 'Paris',    'JFK', 'New York', '2026-04-15', 'business', 'flight', 0);

    INSERT INTO pipeline_runs (message_id, conversation_id, step_name, intent_detected, kb_entries_used, model_used, cost, latency_ms, status)
    VALUES (v_msg2_id, v_conv_id, 'orchestrator_v1', 'booking_inquiry', 1, 'haiku', 0.003, 890, 'success');
END $$;

-- ============================================================
-- SCENARIU 4: Support Conversation (fără lead)
-- ============================================================
DO $$
DECLARE
    v_conv_id   uuid := 'c4000001-0000-0000-0000-000000000001';
    v_msg1_id   uuid := 'd4000001-0000-0000-0000-000000000001';
    v_msg2_id   uuid := 'd4000001-0000-0000-0000-000000000002';
    v_msg3_id   uuid := 'd4000001-0000-0000-0000-000000000003';
BEGIN
    INSERT INTO conversations (id, tunnel, status, visitor_name, visitor_email, assigned_agent_id, created_at)
    VALUES (v_conv_id, 'support', 'closed', 'Mike Chen', 'mike.chen@corp.com',
            'a0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days');

    INSERT INTO messages (id, conversation_id, role, content, model_used, cost, created_at) VALUES
        (v_msg1_id, v_conv_id, 'user', 'I need to change my flight date. Booking #BBC-29481, flying London next Tuesday, want Thursday instead.', NULL, 0, NOW() - INTERVAL '3 days'),
        (v_msg2_id, v_conv_id, 'ai', 'I can help with date changes for booking #BBC-29481. For British Airways business class, one free date change is typically included. Let me connect you with our specialist who has access to your booking details. Can you confirm your email?', 'haiku', 0.003, NOW() - INTERVAL '3 days' + INTERVAL '1 min'),
        (v_msg3_id, v_conv_id, 'agent', 'Hi Mike, I am Ion from the support team. I have pulled up booking #BBC-29481. Thursday option is available, no change fee applies. Sending confirmation email now.', NULL, 0, NOW() - INTERVAL '3 days' + INTERVAL '8 min');

    -- No lead for support conversations
    INSERT INTO pipeline_runs (message_id, conversation_id, step_name, intent_detected, kb_entries_used, model_used, cost, latency_ms, status)
    VALUES (v_msg2_id, v_conv_id, 'orchestrator_v1', 'change_request', 2, 'haiku', 0.003, 760, 'success');
END $$;

-- ============================================================
-- SCENARIU 5: Abandoned Sales Conversation (fără lead)
-- ============================================================
DO $$
DECLARE
    v_conv_id   uuid := 'c5000001-0000-0000-0000-000000000001';
    v_msg1_id   uuid := 'd5000001-0000-0000-0000-000000000001';
    v_msg2_id   uuid := 'd5000001-0000-0000-0000-000000000002';
    v_msg3_id   uuid := 'd5000001-0000-0000-0000-000000000003';
BEGIN
    INSERT INTO conversations (id, tunnel, status, created_at)
    VALUES (v_conv_id, 'sales', 'closed', NOW() - INTERVAL '6 hours');

    INSERT INTO messages (id, conversation_id, role, content, model_used, cost, created_at) VALUES
        (v_msg1_id, v_conv_id, 'user', 'hello', NULL, 0, NOW() - INTERVAL '6 hours'),
        (v_msg2_id, v_conv_id, 'ai', 'Welcome to Buy Business Class! Looking for premium business class flights? I can help you find the best rates for your route. Where are you flying to?', 'template', 0, NOW() - INTERVAL '6 hours' + INTERVAL '30 sec'),
        (v_msg3_id, v_conv_id, 'user', 'just checking', NULL, 0, NOW() - INTERVAL '6 hours' + INTERVAL '1 min');

    -- No lead — insufficient data
    INSERT INTO pipeline_runs (message_id, conversation_id, step_name, intent_detected, kb_entries_used, model_used, cost, latency_ms, status)
    VALUES (v_msg2_id, v_conv_id, 'orchestrator_v1', 'greeting', 0, 'template', 0, 12, 'success');
END $$;

-- ============================================================
-- SCHEMA VERSION
-- ============================================================
INSERT INTO schema_version (version, description)
VALUES ('V10-seed', 'Seed data — 5 scenarii business, 15 KB articles, 3 users, app_settings')
ON CONFLICT (version) DO NOTHING;
