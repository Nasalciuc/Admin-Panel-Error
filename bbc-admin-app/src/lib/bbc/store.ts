// ── BBC Admin — Mock Data Store ──────────────────────────────────
// V1: static mock. V2: swap to API calls. Hooks don't change.

import type {
  Lead, Conversation, KBCategory, DashboardStats, BBCUser
} from './types'

// ── SEED LEADS (8 realistic BBC leads) ────────────────────────────

const SEED_LEADS: Lead[] = [
  { id: 'lead_01', name: 'John Thompson', initials: 'JT', email: 'john.thompson@email.com', phone: '+1 (212) 555-0147', route: 'JFK → LHR', intent: 'Flight Booking', score: 92, status: 'New', capturedAt: '2026-02-22T10:30:00Z', avatarColor: 'bg-blue-100 text-blue-700', notes: 'Interested in business class, March travel', leadSource: 'chat_sales' },
  { id: 'lead_02', name: 'Sarah Chen', initials: 'SC', email: 'sarah.chen@email.com', phone: '', route: 'LAX → NRT', intent: 'Price Inquiry', score: 78, status: 'Contacted', capturedAt: '2026-02-21T14:15:00Z', avatarColor: 'bg-emerald-100 text-emerald-700', notes: '', leadSource: 'chat_sales' },
  { id: 'lead_03', name: 'Michael Davis', initials: 'MD', email: 'michael.davis@email.com', phone: '+1 (312) 555-0283', route: 'ORD → CDG', intent: 'Route Information', score: 84, status: 'New', capturedAt: '2026-02-21T09:00:00Z', avatarColor: 'bg-purple-100 text-purple-700', notes: 'Comparing airlines', leadSource: 'chat_sales' },
  { id: 'lead_04', name: 'Emily Wilson', initials: 'EW', email: 'emily.wilson@email.com', phone: '+1 (305) 555-0391', route: 'MIA → DXB', intent: 'Flight Booking', score: 89, status: 'Converted', capturedAt: '2026-02-20T16:45:00Z', avatarColor: 'bg-amber-100 text-amber-700', notes: 'Booked through agent', leadSource: 'chat_sales' },
  { id: 'lead_05', name: 'David Lee', initials: 'DL', email: 'david.lee@email.com', phone: '', route: 'SFO → HKG', intent: 'Price Inquiry', score: 75, status: 'Contacted', capturedAt: '2026-02-20T11:20:00Z', avatarColor: 'bg-rose-100 text-rose-700', notes: '', leadSource: 'chat_sales' },
  { id: 'lead_06', name: 'Jennifer Garcia', initials: 'JG', email: 'jennifer.garcia@email.com', phone: '+1 (415) 555-0562', route: 'SFO → SIN', intent: 'Flight Booking', score: 95, status: 'New', capturedAt: '2026-02-23T08:00:00Z', avatarColor: 'bg-cyan-100 text-cyan-700', notes: 'VIP repeat customer', leadSource: 'chat_sales' },
  { id: 'lead_07', name: 'Robert Martinez', initials: 'RM', email: 'robert.martinez@email.com', phone: '+1 (713) 555-0734', route: 'IAH → FRA', intent: 'Route Information', score: 62, status: 'Lost', capturedAt: '2026-02-19T13:30:00Z', avatarColor: 'bg-indigo-100 text-indigo-700', notes: 'Went with competitor', leadSource: 'chat_sales' },
  { id: 'lead_08', name: 'Amanda Brown', initials: 'AB', email: 'amanda.brown@email.com', phone: '', route: 'BOS → FCO', intent: 'Price Inquiry', score: 81, status: 'New', capturedAt: '2026-02-23T15:00:00Z', avatarColor: 'bg-teal-100 text-teal-700', notes: 'Summer travel planning', leadSource: 'chat_sales' },
]

// ── SEED CONVERSATIONS (5: 2 Sales, 2 Support, 1 abandoned) ──────

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_01', type: 'SALES', visitorName: 'John Thompson', visitorEmail: 'john.thompson@email.com',
    intent: 'Flight Booking', intentType: 'primary', status: 'Active', duration: '4m 32s', leadCaptured: true,
    createdAt: '2026-02-23T10:30:00Z', assignedAgentId: 'agent_sales_01',
    messages: [
      { id: 'm1', role: 'visitor', content: 'Hi, I need a business class flight from JFK to London Heathrow for March 15th.', timestamp: '10:30 AM' },
      { id: 'm2', role: 'ai', content: "Welcome to BuyBusinessClass! I'd be happy to help you find business class flights from JFK to LHR for March 15th. Let me check available options for you.", timestamp: '10:30 AM' },
      { id: 'm3', role: 'visitor', content: 'I prefer non-stop flights. What airlines fly that route in business class?', timestamp: '10:31 AM' },
      { id: 'm4', role: 'ai', content: 'Great choice! For JFK → LHR non-stop business class, you have excellent options: British Airways (Club World), American Airlines (Flagship Business), Virgin Atlantic (Upper Class), and Delta One. Prices typically range from $3,200–$5,800 round trip. Would you like me to get specific quotes?', timestamp: '10:31 AM' },
      { id: 'm5', role: 'visitor', content: 'Yes, please check British Airways and Virgin Atlantic. My email is john.thompson@email.com', timestamp: '10:33 AM', isLeadCapture: true },
    ]
  },
  {
    id: 'conv_02', type: 'SALES', visitorName: 'Sarah Chen', visitorEmail: 'sarah.chen@email.com',
    intent: 'Price Inquiry', intentType: 'primary', status: 'Closed', duration: '2m 15s', leadCaptured: true,
    createdAt: '2026-02-22T14:15:00Z', assignedAgentId: 'agent_sales_01',
    messages: [
      { id: 'm6', role: 'visitor', content: 'How much does business class from LA to Tokyo cost?', timestamp: '2:15 PM' },
      { id: 'm7', role: 'ai', content: 'Business class flights from LAX to NRT (Tokyo Narita) typically range from $4,500–$8,200 round trip depending on airline and season. Airlines include ANA, JAL, Singapore Airlines, and United. When are you looking to travel?', timestamp: '2:15 PM' },
      { id: 'm8', role: 'visitor', content: 'Sometime in April. Thanks for the info!', timestamp: '2:17 PM' },
    ]
  },
  {
    id: 'conv_03', type: 'SUPPORT', visitorName: 'Carlos Rivera', visitorEmail: 'carlos.r@email.com',
    intent: 'Booking Issue', intentType: 'primary', status: 'Active', duration: '6m 48s', leadCaptured: false,
    createdAt: '2026-02-23T09:00:00Z', assignedAgentId: 'agent_support_01',
    messages: [
      { id: 'm9', role: 'visitor', content: 'I booked a flight last week (booking #BBC-2847) but I need to change the date. Is that possible?', timestamp: '9:00 AM' },
      { id: 'm10', role: 'ai', content: "I'd be happy to help you with your booking change! Let me look up booking #BBC-2847. Could you confirm your full name and email address for verification?", timestamp: '9:00 AM' },
      { id: 'm11', role: 'visitor', content: 'Carlos Rivera, carlos.r@email.com', timestamp: '9:01 AM' },
      { id: 'm12', role: 'ai', content: 'Thank you, Carlos. I found your booking: MIA → MAD (Madrid), departing March 5th, Iberia Business Class. Change fees vary by fare class. Let me connect you with our support team for the specific change options.', timestamp: '9:02 AM' },
    ]
  },
  {
    id: 'conv_04', type: 'SUPPORT', visitorName: 'Lisa Wang', visitorEmail: 'lisa.wang@email.com',
    intent: 'Baggage Inquiry', intentType: 'secondary', status: 'Closed', duration: '3m 10s', leadCaptured: false,
    createdAt: '2026-02-22T16:30:00Z', assignedAgentId: 'agent_support_01',
    messages: [
      { id: 'm13', role: 'visitor', content: 'What is the baggage allowance for business class on Emirates?', timestamp: '4:30 PM' },
      { id: 'm14', role: 'ai', content: 'Emirates Business Class passengers are allowed: 2 checked bags at 32kg (70lbs) each, 1 carry-on at 7kg (15lbs), plus 1 personal item. Total checked allowance: 64kg.', timestamp: '4:30 PM' },
      { id: 'm15', role: 'visitor', content: 'Perfect, thanks!', timestamp: '4:31 PM' },
    ]
  },
  {
    id: 'conv_05', type: 'SALES', visitorName: 'Anonymous Visitor', visitorEmail: '',
    intent: 'General Inquiry', intentType: 'secondary', status: 'Closed', duration: '0m 45s', leadCaptured: false,
    createdAt: '2026-02-21T20:00:00Z',
    messages: [
      { id: 'm16', role: 'visitor', content: 'Do you sell economy tickets too?', timestamp: '8:00 PM' },
      { id: 'm17', role: 'ai', content: "We specialize exclusively in business class and first class flights. This allows us to negotiate the best premium cabin rates for our clients. If you're interested in upgrading to business class, I'd be happy to show you some great value options!", timestamp: '8:00 PM' },
    ]
  },
]

// ── SEED KB — Separate per tunnel ────────────────────────────────

const SEED_KB_SALES: KBCategory[] = [
  {
    id: 'kb_s1', name: 'Routes & Destinations', icon: 'Plane', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', tunnel: 'sales',
    entries: [
      { id: 'kbe_s1', categoryId: 'kb_s1', title: 'Popular Transatlantic Routes', content: 'JFK-LHR, LAX-CDG, ORD-FRA, MIA-MAD, BOS-DUB. Average business class: $3,200-$6,500 RT.', lastUpdated: '2026-02-20' },
      { id: 'kbe_s2', categoryId: 'kb_s1', title: 'Asia Pacific Routes', content: 'LAX-NRT, SFO-HKG, JFK-SIN, ORD-ICN. Average business class: $4,500-$9,000 RT.', lastUpdated: '2026-02-18' },
      { id: 'kbe_s3', categoryId: 'kb_s1', title: 'Middle East Routes', content: 'JFK-DXB, IAH-DOH, LAX-AUH. Average business class: $4,000-$7,500 RT.', lastUpdated: '2026-02-15' },
    ]
  },
  {
    id: 'kb_s2', name: 'Airline Comparisons', icon: 'Scale', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', tunnel: 'sales',
    entries: [
      { id: 'kbe_s4', categoryId: 'kb_s2', title: 'Best Business Class 2026', content: 'Qatar QSuites, Singapore Airlines, ANA The Room, Emirates, Cathay Pacific.', lastUpdated: '2026-02-22' },
      { id: 'kbe_s5', categoryId: 'kb_s2', title: 'Lie-Flat Seat Guide', content: 'All modern business class offers lie-flat seats. Key differentiators: door (Qatar, Delta One), window access (ANA), suite privacy (Singapore).', lastUpdated: '2026-02-19' },
    ]
  },
  {
    id: 'kb_s3', name: 'Pricing & Promotions', icon: 'DollarSign', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', tunnel: 'sales',
    entries: [
      { id: 'kbe_s6', categoryId: 'kb_s3', title: 'Current Promotions', content: 'BA: 15% off LHR routes through March. Emirates: companion fare DXB. Qatar: student discount 10%.', lastUpdated: '2026-02-23' },
      { id: 'kbe_s7', categoryId: 'kb_s3', title: 'Price Match Policy', content: 'We match any published business class fare + beat it by $50. Must be same airline, date, cabin.', lastUpdated: '2026-02-20' },
    ]
  },
]

const SEED_KB_SUPPORT: KBCategory[] = [
  {
    id: 'kb_t1', name: 'Booking Changes', icon: 'RefreshCw', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', tunnel: 'support',
    entries: [
      { id: 'kbe_t1', categoryId: 'kb_t1', title: 'Date Change Policy', content: 'Most business class tickets allow free date change within same cabin class. Fare difference may apply. 24hr free cancellation on all bookings.', lastUpdated: '2026-02-22' },
      { id: 'kbe_t2', categoryId: 'kb_t1', title: 'Name Correction', content: 'Minor name corrections (typos, missing middle name) are free. Full name change requires reissue — $150 fee + fare difference.', lastUpdated: '2026-02-18' },
    ]
  },
  {
    id: 'kb_t2', name: 'Baggage & Lounge', icon: 'Luggage', iconBg: 'bg-rose-50', iconColor: 'text-rose-600', tunnel: 'support',
    entries: [
      { id: 'kbe_t3', categoryId: 'kb_t2', title: 'Business Class Baggage', content: 'Standard: 2x32kg checked + 1x7kg carry-on. Exceptions: US domestic (1x32kg), some LCCs.', lastUpdated: '2026-02-21' },
      { id: 'kbe_t4', categoryId: 'kb_t2', title: 'Lounge Access', content: 'Business class ticket includes lounge access at departure airport. Priority Pass NOT needed.', lastUpdated: '2026-02-19' },
    ]
  },
  {
    id: 'kb_t3', name: 'Refunds & Complaints', icon: 'AlertCircle', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', tunnel: 'support',
    entries: [
      { id: 'kbe_t5', categoryId: 'kb_t3', title: 'Refund Process', content: 'Refundable tickets: 5-10 business days. Non-refundable: airline credit. BBC processing fee: $0 refundable, $75 non-refundable.', lastUpdated: '2026-02-20' },
    ]
  },
]

// ── CRUD Functions ───────────────────────────────────────────────

export function getLeads(): Lead[] { return SEED_LEADS }

export function filterLeads(opts: { search?: string; intent?: string; status?: string }): Lead[] {
  let leads = getLeads()
  if (opts.search) {
    const q = opts.search.toLowerCase()
    leads = leads.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.route.toLowerCase().includes(q))
  }
  if (opts.intent) leads = leads.filter(l => l.intent === opts.intent)
  if (opts.status) leads = leads.filter(l => l.status === opts.status)
  return leads
}

export function getConversations(): Conversation[] { return SEED_CONVERSATIONS }
export function getConversation(id: string): Conversation | undefined { return SEED_CONVERSATIONS.find(c => c.id === id) }
export function getConversationsByTunnel(tunnel: 'sales' | 'support'): Conversation[] {
  return SEED_CONVERSATIONS.filter(c => c.type === tunnel.toUpperCase())
}

export function getKBCategories(tunnel?: 'sales' | 'support'): KBCategory[] {
  const all = [...SEED_KB_SALES, ...SEED_KB_SUPPORT]
  if (tunnel) return all.filter(c => c.tunnel === tunnel)
  return all
}

export function getDashboardStats(): DashboardStats {
  const convs = getConversations()
  const leads = getLeads()
  const kb = getKBCategories()
  const totalEntries = kb.reduce((sum, c) => sum + c.entries.length, 0)
  const weekAgo = Date.now() - 7 * 86400000
  const leadsThisWeek = leads.filter(l => new Date(l.capturedAt).getTime() > weekAgo).length
  const converted = leads.filter(l => l.status === 'Converted').length
  const conversionRate = leads.length > 0 ? `${Math.round((converted / leads.length) * 100)}%` : '0%'
  return {
    totalConversations: convs.length, activeConversations: convs.filter(c => c.status === 'Active').length,
    leadsCount: leads.length, leadsThisWeek, avgResponse: '< 30s', kbCoverage: `${totalEntries} entries`,
    conversionRate, topRoute: 'JFK → LHR',
    leadsByDay: [{ day: 'Mon', count: 2 }, { day: 'Tue', count: 3 }, { day: 'Wed', count: 1 }, { day: 'Thu', count: 4 }, { day: 'Fri', count: 2 }, { day: 'Sat', count: 1 }, { day: 'Sun', count: 0 }],
    tunnelSplit: { sales: convs.filter(c => c.type === 'SALES').length, support: convs.filter(c => c.type === 'SUPPORT').length },
  }
}

// ── Mock Users (4 roles) ─────────────────────────────────────────

export const MOCK_USERS: BBCUser[] = [
  { id: 'user_owner', name: 'Alex Petrov', email: 'alex@buybusinessclass.com', role: 'owner', tunnel: 'all', initials: 'AP', avatarColor: 'bg-amber-100 text-amber-700' },
  { id: 'user_admin', name: 'Scaler', email: 'scaler@buybusinessclass.com', role: 'admin', tunnel: 'all', initials: 'SC', avatarColor: 'bg-blue-100 text-blue-700' },
  { id: 'agent_sales_01', name: 'Maria Santos', email: 'maria@buybusinessclass.com', role: 'sales', tunnel: 'sales', initials: 'MS', avatarColor: 'bg-emerald-100 text-emerald-700' },
  { id: 'agent_support_01', name: 'James Wilson', email: 'james@buybusinessclass.com', role: 'support', tunnel: 'support', initials: 'JW', avatarColor: 'bg-purple-100 text-purple-700' },
]
