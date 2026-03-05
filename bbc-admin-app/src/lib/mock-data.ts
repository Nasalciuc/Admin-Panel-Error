import type { Lead, Conversation, Message, KBCategory, KBEntry, DashboardStats } from './types'

// ── Leads ─────────────────────────────────────────────────────
export const MOCK_LEADS: Lead[] = [
  {
    id: 'e1000001-0000-0000-0000-000000000001',
    conversation_id: 'c1000001-0000-0000-0000-000000000001',
    trip_type: 'round_trip', cabin_class: 'business', passengers: 1, flexible_dates: true,
    origin_code: 'JFK', destination_code: 'LHR', departure_date: '2026-03-15', return_date: '2026-03-22',
    route_display: 'JFK → LHR (round-trip)',
    score: 85, tier: 'gold', status: 'contacted',
    intent_signals: ['corporate', 'flexible', 'phone_provided'],
    notes: 'Corporate traveler, requires business class per company policy.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    contacted_at: new Date(Date.now() - 86400000).toISOString(), converted_at: null,
    visitor_name: 'John Thompson', visitor_email: 'john.thompson@email.com', visitor_phone: '+1-212-555-0187',
  },
  {
    id: 'e2000001-0000-0000-0000-000000000001',
    conversation_id: 'c2000001-0000-0000-0000-000000000001',
    trip_type: 'tour', cabin_class: 'mixed', passengers: 2, flexible_dates: false,
    origin_code: 'JFK', destination_code: 'LHR', departure_date: '2026-06-10', return_date: '2026-06-24',
    route_display: 'JFK → LHR → CDG → FCO → JFK (tour)',
    score: 65, tier: 'silver', status: 'new',
    intent_signals: ['couple', 'budget_stated', 'june'], notes: 'European tour. 2 pax, $8k budget.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    contacted_at: null, converted_at: null,
    visitor_name: 'Sarah Miller', visitor_email: 'sarah.miller@gmail.com', visitor_phone: '+1-310-555-0293',
  },
  {
    id: 'e3000001-0000-0000-0000-000000000001',
    conversation_id: 'c3000001-0000-0000-0000-000000000001',
    trip_type: 'open_jaw', cabin_class: 'business', passengers: 1, flexible_dates: true,
    origin_code: 'JFK', destination_code: 'CDG', departure_date: '2026-04-05', return_date: '2026-04-15',
    route_display: 'JFK → LHR … CDG → JFK (open-jaw)',
    score: 35, tier: 'bronze', status: 'new',
    intent_signals: [], notes: 'No phone provided. Email-only lead.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    contacted_at: null, converted_at: null,
    visitor_name: null, visitor_email: 'anon.lead@email.com', visitor_phone: null,
  },
]

// ── Conversations ─────────────────────────────────────────────
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1000001-0000-0000-0000-000000000001',
    tunnel: 'sales', mode: 'ai', status: 'closed',
    visitor_name: 'John Thompson', visitor_email: 'john.thompson@email.com', visitor_phone: '+1-212-555-0187',
    assigned_agent_id: 'a0000001-0000-0000-0000-000000000001',
    message_count: 6, ai_cost_total: 0.006,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000 + 600000).toISOString(),
    closed_at: new Date(Date.now() - 2 * 86400000 + 600000).toISOString(),
  },
  {
    id: 'c4000001-0000-0000-0000-000000000001',
    tunnel: 'support', mode: 'human', status: 'closed',
    visitor_name: 'Mike Chen', visitor_email: 'mike.chen@corp.com', visitor_phone: null,
    assigned_agent_id: 'a0000001-0000-0000-0000-000000000002',
    message_count: 3, ai_cost_total: 0.003,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000 + 300000).toISOString(),
    closed_at: new Date(Date.now() - 3 * 86400000 + 300000).toISOString(),
  },
  {
    id: 'c5000001-0000-0000-0000-000000000001',
    tunnel: 'sales', mode: 'ai', status: 'closed',
    visitor_name: null, visitor_email: null, visitor_phone: null,
    assigned_agent_id: null, message_count: 3, ai_cost_total: 0,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000 + 90000).toISOString(),
    closed_at: new Date(Date.now() - 6 * 3600000 + 90000).toISOString(),
  },
]

export const MOCK_MESSAGES: Record<string, Message[]> = {
  'c1000001-0000-0000-0000-000000000001': [
    { id: 'd1', conversation_id: 'c1000001-0000-0000-0000-000000000001', role: 'user',
      content: 'Hi, I need business class flights from New York to London for March 15, returning March 22.',
      model_used: null, cost: 0, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'd2', conversation_id: 'c1000001-0000-0000-0000-000000000001', role: 'ai',
      content: 'Welcome to Buy Business Class! NYC to London is one of our most popular routes. For March 15–22, we have excellent options with British Airways Club World, Virgin Atlantic Upper Class, and Delta One. Typically $2,800–$4,200 round trip. May I ask how many passengers?',
      model_used: 'template', cost: 0, created_at: new Date(Date.now() - 2 * 86400000 + 60000).toISOString() },
    { id: 'd3', conversation_id: 'c1000001-0000-0000-0000-000000000001', role: 'user',
      content: 'Just me. Business class only — my company requires it.',
      model_used: null, cost: 0, created_at: new Date(Date.now() - 2 * 86400000 + 180000).toISOString() },
    { id: 'd4', conversation_id: 'c1000001-0000-0000-0000-000000000001', role: 'ai',
      content: 'Perfect. British Airways Club Suite is particularly popular for corporate travelers — direct aisle access, privacy screen, great for working. Shall I have a specialist prepare a quote to your email?',
      model_used: 'haiku', cost: 0.003, created_at: new Date(Date.now() - 2 * 86400000 + 420000).toISOString() },
    { id: 'd5', conversation_id: 'c1000001-0000-0000-0000-000000000001', role: 'user',
      content: 'Yes please. john.thompson@email.com, phone +1-212-555-0187.',
      model_used: null, cost: 0, created_at: new Date(Date.now() - 2 * 86400000 + 540000).toISOString() },
    { id: 'd6', conversation_id: 'c1000001-0000-0000-0000-000000000001', role: 'ai',
      content: 'All captured! Our specialist will contact you within 2 hours at john.thompson@email.com with the best options. Have a great flight, John!',
      model_used: 'template', cost: 0, created_at: new Date(Date.now() - 2 * 86400000 + 600000).toISOString() },
  ],
  'c4000001-0000-0000-0000-000000000001': [
    { id: 's1', conversation_id: 'c4000001-0000-0000-0000-000000000001', role: 'user',
      content: 'I need to change my flight date. Booking #BBC-29481, flying to London next Tuesday, want Thursday instead.',
      model_used: null, cost: 0, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 's2', conversation_id: 'c4000001-0000-0000-0000-000000000001', role: 'ai',
      content: 'I can help with date changes for booking #BBC-29481. Let me connect you with our specialist who has access to your booking details.',
      model_used: 'haiku', cost: 0.003, created_at: new Date(Date.now() - 3 * 86400000 + 60000).toISOString() },
    { id: 's3', conversation_id: 'c4000001-0000-0000-0000-000000000001', role: 'agent',
      content: 'Hi Mike, Ion from support here. I pulled up booking #BBC-29481. Thursday is available with no change fee. Sending confirmation now.',
      model_used: null, cost: 0, created_at: new Date(Date.now() - 3 * 86400000 + 480000).toISOString() },
  ],
}

// ── KB ────────────────────────────────────────────────────────
export const MOCK_KB_CATEGORIES: KBCategory[] = [
  { id: 'b0000001-0000-0000-0000-000000000001', name: 'Routes & Destinations', tunnel: 'sales',   icon: 'Plane',         sort_order: 1, entry_count: 4 },
  { id: 'b0000001-0000-0000-0000-000000000002', name: 'Pricing & Promotions',  tunnel: 'sales',   icon: 'DollarSign',    sort_order: 2, entry_count: 3 },
  { id: 'b0000001-0000-0000-0000-000000000003', name: 'Booking Process',       tunnel: 'sales',   icon: 'ClipboardList', sort_order: 3, entry_count: 2 },
  { id: 'b0000001-0000-0000-0000-000000000004', name: 'Changes & Cancellations', tunnel: 'support', icon: 'RefreshCw',   sort_order: 1, entry_count: 3 },
  { id: 'b0000001-0000-0000-0000-000000000005', name: 'Baggage & Policies',    tunnel: 'support', icon: 'Luggage',       sort_order: 2, entry_count: 3 },
]

export const MOCK_KB_ENTRIES: KBEntry[] = [
  { id: 'kbe-001', category_id: 'b0000001-0000-0000-0000-000000000001',
    title: 'NYC to London Business Class',
    content: 'JFK to LHR: British Airways, Virgin Atlantic, Delta One. 7h20m nonstop. Fares $2,800–$4,500 round trip. Best booking window: 3–6 months ahead.',
    tunnel: 'sales', is_active: true, view_count: 47,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(), updated_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'kbe-002', category_id: 'b0000001-0000-0000-0000-000000000001',
    title: 'NYC to Dubai Business Class',
    content: 'JFK to DXB: Emirates nonstop 12h, exceptional Business class with onboard bar. Fares $3,200–$5,500 round trip. Peak season: November–April.',
    tunnel: 'sales', is_active: true, view_count: 31,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(), updated_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'kbe-003', category_id: 'b0000001-0000-0000-0000-000000000002',
    title: 'How BBC Saves You Money',
    content: 'Buy Business Class uses consolidator fares and airline partnerships to offer 30–70% savings vs published prices. Your ticket is fully valid in the airline system.',
    tunnel: 'sales', is_active: true, view_count: 89,
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(), updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'kbe-004', category_id: 'b0000001-0000-0000-0000-000000000004',
    title: 'How to Change Your Booking',
    content: 'Contact support with your booking reference and new preferred dates. Most business class tickets allow 1 free date change (fare difference may apply). Contact at least 48h before departure.',
    tunnel: 'support', is_active: true, view_count: 23,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(), updated_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'kbe-005', category_id: 'b0000001-0000-0000-0000-000000000005',
    title: 'Business Class Baggage Allowance',
    content: 'Standard business class: 2 checked bags (32kg each) + 1 carry-on + 1 personal item. First class: 3 checked bags. Emirates: unlimited baggage on some routes.',
    tunnel: 'support', is_active: true, view_count: 18,
    // Updated 95 days ago — will trigger the stale warning (>90 days)
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(), updated_at: new Date(Date.now() - 95 * 86400000).toISOString() },
]

// ── Dashboard ─────────────────────────────────────────────────
export const MOCK_STATS: DashboardStats = {
  conversations_today: 12, conversations_week: 87, conversations_month: 312, conversations_active: 3,
  leads_total: 48, leads_new: 8, leads_contacted: 18, leads_qualified: 10, leads_converted: 7, leads_lost: 5,
  leads_gold: 12, leads_silver: 21, leads_bronze: 15,
  cost_today: 1.24, cost_week: 8.73, cost_month: 34.21,
  top_routes: [
    { route: 'JFK→LHR', count: 18 }, { route: 'LAX→CDG', count: 11 },
    { route: 'JFK→DXB', count: 9  }, { route: 'ORD→FCO', count: 6  },
    { route: 'JFK→SIN', count: 4  },
  ],
  conversations_trend: [
    { date: '2026-02-26', count: 8  }, { date: '2026-02-27', count: 14 },
    { date: '2026-02-28', count: 11 }, { date: '2026-03-01', count: 16 },
    { date: '2026-03-02', count: 9  }, { date: '2026-03-03', count: 19 },
    { date: '2026-03-04', count: 12 },
  ],
  leads_trend: [
    { date: '2026-02-27', count: 5 }, { date: '2026-02-28', count: 8 },
    { date: '2026-03-01', count: 6 }, { date: '2026-03-02', count: 12 },
    { date: '2026-03-03', count: 9 }, { date: '2026-03-04', count: 7 },
    { date: '2026-03-05', count: 8 },
  ],

  // === V2 ADDITIONS ===
  conversations_yesterday: 10,
  leads_uncalled: 3,
  leads_sla_breach: 1,
  cost_avg_30d: 0.82,
  daily_budget: 50.00,
  latency_median_ms: 1200,
  fallback_rate_percent: 3.2,
  cost_vs_budget_percent: 2.48,
  avg_duration_minutes: 4.5,
  messages_total_month: 1248,

  conversations_trend_v2: [
    { date: '2026-02-20', sales: 18, support: 9 },
    { date: '2026-02-21', sales: 22, support: 11 },
    { date: '2026-02-22', sales: 15, support: 7 },
    { date: '2026-02-23', sales: 25, support: 13 },
    { date: '2026-02-24', sales: 20, support: 10 },
    { date: '2026-02-25', sales: 8, support: 4 },
    { date: '2026-02-26', sales: 6, support: 3 },
    { date: '2026-02-27', sales: 21, support: 12 },
    { date: '2026-02-28', sales: 28, support: 14 },
    { date: '2026-03-01', sales: 24, support: 11 },
    { date: '2026-03-02', sales: 19, support: 8 },
    { date: '2026-03-03', sales: 30, support: 15 },
    { date: '2026-03-04', sales: 12, support: 5 },
    { date: '2026-03-05', sales: 9, support: 4 },
  ],

  hot_leads: [
    { id: 'hl-1', visitor_name: 'John Smith', route: 'JFK → LHR', score: 92, tier: 'gold' as const, minutes_since_created: 180 },
    { id: 'hl-2', visitor_name: 'Maria Garcia', route: 'LAX → CDG', score: 87, tier: 'gold' as const, minutes_since_created: 45 },
    { id: 'hl-3', visitor_name: null, route: 'SFO → NRT', score: 85, tier: 'gold' as const, minutes_since_created: 20 },
    { id: 'hl-4', visitor_name: 'David Wilson', route: 'ORD → LHR', score: 78, tier: 'silver' as const, minutes_since_created: 95 },
    { id: 'hl-5', visitor_name: 'Emma Davis', route: 'MIA → DXB', score: 72, tier: 'silver' as const, minutes_since_created: 10 },
  ],

  leads_sparkline_7d: [5, 8, 6, 12, 9, 7, 8],

  funnel: [
    { name: 'New', count: 8, color: '#3b82f6' },
    { name: 'Contacted', count: 18, color: '#f59e0b' },
    { name: 'Qualified', count: 10, color: '#8b5cf6' },
    { name: 'Converted', count: 7, color: '#22c55e' },
    { name: 'Lost', count: 5, color: '#ef4444' },
  ],
}
