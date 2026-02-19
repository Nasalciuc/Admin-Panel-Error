// ── BBC Admin — localStorage CRUD Store ──────────────────────────
// Single persistence layer. Swap to API calls in V2.

import type { Lead, Conversation, Message, KBCategory, KBEntry, Agent, AppSettings, DashboardStats } from '../types';

const KEYS = {
  leads: 'bbc_leads',
  conversations: 'bbc_conversations',
  kb: 'bbc_kb',
  seeded: 'bbc_seeded',
};

// ── Helpers ──────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function initialsFrom(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
];

function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

// ── Seed Data ────────────────────────────────────────────────────

function seed(): void {
  if (localStorage.getItem(KEYS.seeded)) return;

  const leads: Lead[] = [
    { id: uid(), name: 'John Thompson', initials: 'JT', email: 'john.thompson@email.com', phone: '+1 (212) 555-0147', route: 'NYC → LHR', intent: 'Flight Booking', score: 92, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-blue-100 text-blue-700', notes: '' },
    { id: uid(), name: 'Sarah Chen', initials: 'SC', email: 'sarah.chen@email.com', phone: '', route: 'LAX → NRT', intent: 'Price Inquiry', score: 78, status: 'Contacted', capturedAt: new Date().toISOString(), avatarColor: 'bg-emerald-100 text-emerald-700', notes: '' },
    { id: uid(), name: 'Michael Davis', initials: 'MD', email: 'michael.davis@email.com', phone: '+1 (312) 555-0283', route: 'ORD → CDG', intent: 'Route Information', score: 84, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-purple-100 text-purple-700', notes: '' },
    { id: uid(), name: 'Emily Wilson', initials: 'EW', email: 'emily.wilson@email.com', phone: '+1 (305) 555-0391', route: 'MIA → DXB', intent: 'Flight Booking', score: 89, status: 'Converted', capturedAt: new Date().toISOString(), avatarColor: 'bg-amber-100 text-amber-700', notes: '' },
    { id: uid(), name: 'David Lee', initials: 'DL', email: 'david.lee@email.com', phone: '', route: 'SFO → HKG', intent: 'Price Inquiry', score: 75, status: 'Contacted', capturedAt: new Date().toISOString(), avatarColor: 'bg-rose-100 text-rose-700', notes: '' },
    { id: uid(), name: 'Jennifer Garcia', initials: 'JG', email: 'jennifer.garcia@email.com', phone: '+1 (404) 555-0512', route: 'ATL → AMS', intent: 'Flight Booking', score: 86, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-cyan-100 text-cyan-700', notes: '' },
    { id: uid(), name: 'Robert Kim', initials: 'RK', email: 'robert.kim@email.com', phone: '', route: 'DFW → FRA', intent: 'Route Information', score: 72, status: 'Lost', capturedAt: new Date().toISOString(), avatarColor: 'bg-indigo-100 text-indigo-700', notes: '' },
    { id: uid(), name: 'Amanda White', initials: 'AW', email: 'amanda.white@email.com', phone: '+1 (206) 555-0678', route: 'SEA → SYD', intent: 'Flight Booking', score: 90, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-teal-100 text-teal-700', notes: '' },
  ];

  const conversations: Conversation[] = [
    {
      id: uid(), type: 'SALES', visitorName: 'John Thompson', visitorEmail: 'john.thompson@email.com',
      intent: 'Flight Booking', intentType: 'primary', status: 'Active', duration: '4m 32s', leadCaptured: true,
      createdAt: new Date().toISOString(),
      messages: [
        { id: uid(), role: 'visitor', content: "Hi, I'm looking for business class flights from NYC to London next month. Can you help?", timestamp: '2:34 PM' },
        { id: uid(), role: 'ai', content: 'Hello! Absolutely. Could you specify your preferred travel dates?', timestamp: '2:34 PM' },
        { id: uid(), role: 'visitor', content: 'Around the 15th of October for about a week.', timestamp: '2:35 PM' },
        { id: uid(), role: 'ai', content: 'Great. We have excellent options. Could you provide your name and email for personalized quotes?', timestamp: '2:35 PM' },
        { id: uid(), role: 'visitor', content: 'Sure, John Thompson, john.thompson@email.com.', timestamp: '2:36 PM' },
        {
          id: uid(), role: 'ai', content: 'Thank you, John. Here is a popular route option:', timestamp: '2:36 PM',
          isLeadCapture: true,
          routeCard: { route: 'NYC → LON Route', originCode: 'JFK', destinationCode: 'LHR', duration: '~7h 15m', airlines: ['Delta', 'British Airways', 'Virgin Atlantic'], dates: 'Oct 15 - Oct 22', priceRange: '$2,800 - $4,500', isNonStop: true },
        },
        { id: uid(), role: 'visitor', content: "That looks good. I'm interested in Virgin Atlantic. More details?", timestamp: '2:37 PM' },
        { id: uid(), role: 'ai', content: "Virgin Atlantic offers Upper Class suite with lie-flat beds, lounge access, and premium dining. I'll prepare a quote shortly.", timestamp: '2:37 PM' },
      ],
    },
    {
      id: uid(), type: 'SALES', visitorName: 'Amoa Smiler', visitorEmail: 'amoa.smiler@email.com',
      intent: 'Price Inquiry', intentType: 'secondary', status: 'Pending', duration: '1m 12s', leadCaptured: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      messages: [
        { id: uid(), role: 'visitor', content: 'How much for business class LA to Tokyo?', timestamp: '1:22 PM' },
        { id: uid(), role: 'ai', content: 'Business class from LAX to NRT ranges from $3,200 to $5,800 round-trip. Want me to find exact fares?', timestamp: '1:22 PM' },
      ],
    },
    {
      id: uid(), type: 'SALES', visitorName: 'Annory Schrimm', visitorEmail: 'annory.s@email.com',
      intent: 'Route Information', intentType: 'secondary', status: 'Active', duration: '3m 05s', leadCaptured: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      messages: [
        { id: uid(), role: 'visitor', content: 'What routes are available from Chicago to Paris?', timestamp: '11:15 AM' },
        { id: uid(), role: 'ai', content: 'We offer ORD → CDG with Air France, United, and American Airlines. Non-stop and one-stop options.', timestamp: '11:15 AM' },
        { id: uid(), role: 'visitor', content: 'Are there non-stop flights in business class?', timestamp: '11:16 AM' },
        { id: uid(), role: 'ai', content: 'Yes, Air France and United offer non-stop business class from ORD to CDG daily.', timestamp: '11:16 AM' },
      ],
    },
    {
      id: uid(), type: 'SUPPORT', visitorName: 'Danni Scaler', visitorEmail: 'danni.s@email.com',
      intent: 'Support', intentType: 'secondary', status: 'Closed', duration: '0m 45s', leadCaptured: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        { id: uid(), role: 'visitor', content: 'I need help changing my existing booking.', timestamp: '9:10 AM' },
      ],
    },
  ];

  const kb: KBCategory[] = [
    {
      id: uid(), name: 'Company Info', icon: 'Building2', iconBg: 'bg-orange-50', iconColor: 'text-orange-500',
      entries: [
        { id: uid(), categoryId: '', title: 'About Buy Business Class', content: 'Buy Business Class (BuyBusinessClass.com) is a premium travel booking platform specializing in discounted business and first class fares worldwide.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Our Mission', content: 'To make luxury air travel accessible by offering business class fares 30-40% below published prices through our industry relationships.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Contact Information', content: 'Email: support@buybusinessclass.com. Available Mon-Fri 9 AM - 6 PM EST.', lastUpdated: new Date().toISOString() },
      ],
    },
    {
      id: uid(), name: 'Benefits', icon: 'Star', iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500',
      entries: [
        { id: uid(), categoryId: '', title: 'Lie-Flat Seats', content: 'All business class bookings include lie-flat seats for maximum comfort on long-haul flights.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Lounge Access', content: 'Enjoy complimentary airport lounge access with premium dining and spa services.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Flexible Booking', content: 'Business class tickets booked through us include free date changes up to 24 hours before departure.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Priority Boarding', content: 'Skip the queues with priority boarding and fast-track security at major airports.', lastUpdated: new Date().toISOString() },
      ],
    },
    {
      id: uid(), name: 'Routes', icon: 'Plane', iconBg: 'bg-blue-50', iconColor: 'text-blue-500',
      entries: [
        { id: uid(), categoryId: '', title: 'NYC to London', content: 'Our most popular route. JFK/EWR to LHR/LGW with Delta, British Airways, and Virgin Atlantic. Fares from $2,800 RT.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'LAX to Tokyo', content: 'Premium route with ANA, JAL, and United. Non-stop from LAX to NRT. Fares from $3,200 RT.', lastUpdated: new Date().toISOString() },
      ],
    },
    {
      id: uid(), name: 'Booking', icon: 'CalendarCheck', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500',
      entries: [
        { id: uid(), categoryId: '', title: 'How to Book', content: 'Start a conversation with our AI assistant or contact an agent directly. Provide your route, dates, and passenger details.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Payment Options', content: 'We accept all major credit cards, wire transfers, and payment plans for bookings over $5,000.', lastUpdated: new Date().toISOString() },
      ],
    },
    {
      id: uid(), name: 'FAQ', icon: 'HelpCircle', iconBg: 'bg-purple-50', iconColor: 'text-purple-500',
      entries: [
        { id: uid(), categoryId: '', title: 'Cancellation Policy', content: 'Free cancellation within 24 hours of booking. After that, airline cancellation policies apply.', lastUpdated: new Date().toISOString() },
        { id: uid(), categoryId: '', title: 'Baggage Allowance', content: 'Business class typically includes 2 checked bags (32kg each) and 1 carry-on plus personal item.', lastUpdated: new Date().toISOString() },
      ],
    },
  ];

  // Fix categoryId references
  kb.forEach(cat => cat.entries.forEach(e => { e.categoryId = cat.id; }));

  write(KEYS.leads, leads);
  write(KEYS.conversations, conversations);
  write(KEYS.kb, kb);

  // Seed agents
  const agents: Agent[] = [
    {
      id: uid(), name: 'Sarah Mitchell', initials: 'SM', email: 'sarah@buybusinessclass.com',
      status: 'online', tunnel: 'sales', activeConversations: 2, lastActive: new Date().toISOString(),
      avatarColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: uid(), name: 'James Cooper', initials: 'JC', email: 'james@buybusinessclass.com',
      status: 'offline', tunnel: 'support', activeConversations: 0, lastActive: new Date(Date.now() - 3600000).toISOString(),
      avatarColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: uid(), name: 'Maria Rodriguez', initials: 'MR', email: 'maria@buybusinessclass.com',
      status: 'online', tunnel: 'both', activeConversations: 1, lastActive: new Date().toISOString(),
      avatarColor: 'bg-purple-100 text-purple-700',
    },
  ];
  write('bbc_agents', agents);

  // Add phone/tags/source to existing leads (update first 4 leads to have phones)
  const seededLeads = read<Lead[]>(KEYS.leads) || [];
  if (seededLeads.length >= 4) {
    seededLeads[0].phone = '+1-212-555-0147';
    seededLeads[0].tags = ['hot', 'returning'];
    seededLeads[0].leadSource = 'chat_sales';
    seededLeads[1].phone = '+1-310-555-0298';
    seededLeads[1].tags = ['corporate'];
    seededLeads[1].leadSource = 'chat_sales';
    seededLeads[2].phone = '';
    seededLeads[2].tags = ['first-time'];
    seededLeads[2].leadSource = 'chat_support';
    seededLeads[3].phone = '+44-20-7946-0958';
    seededLeads[3].tags = ['vip', 'corporate'];
    seededLeads[3].leadSource = 'chat_sales';
    // Rest default
    seededLeads.forEach(l => {
      if (!l.tags) l.tags = [];
      if (!l.leadSource) l.leadSource = 'manual';
    });
    write(KEYS.leads, seededLeads);
  }

  // Add a conversation with routeCard
  const seededConvs = read<Conversation[]>(KEYS.conversations) || [];
  if (seededConvs.length > 0 && seededConvs[0].messages.length > 1) {
    // Add routeCard to second AI message of first conversation
    const aiMsg = seededConvs[0].messages.find(m => m.role === 'ai' && !m.routeCard);
    if (aiMsg) {
      aiMsg.routeCard = {
        route: 'NYC → London',
        originCode: 'JFK',
        destinationCode: 'LHR',
        duration: '7h 15m',
        airlines: ['British Airways', 'Virgin Atlantic', 'Delta'],
        dates: 'March 15, 2026',
        priceRange: '$2,800 – $5,200',
        isNonStop: true,
      };
      write(KEYS.conversations, seededConvs);
    }
  }

  localStorage.setItem(KEYS.seeded, 'true');
}

// Init on import
seed();

// ── LEADS ────────────────────────────────────────────────────────

export function getLeads(): Lead[] {
  return read<Lead[]>(KEYS.leads) || [];
}

export function addLead(data: Omit<Lead, 'id' | 'initials' | 'avatarColor' | 'capturedAt'>): Lead {
  const leads = getLeads();
  const lead: Lead = {
    ...data,
    id: uid(),
    initials: initialsFrom(data.name),
    avatarColor: randomAvatarColor(),
    capturedAt: new Date().toISOString(),
  };
  leads.unshift(lead);
  write(KEYS.leads, leads);
  return lead;
}

export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex(l => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...updates };
  if (updates.name) leads[idx].initials = initialsFrom(updates.name);
  write(KEYS.leads, leads);
  return leads[idx];
}

export function deleteLead(id: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter(l => l.id !== id);
  if (filtered.length === leads.length) return false;
  write(KEYS.leads, filtered);
  return true;
}

export function filterLeads(opts: { search?: string; intent?: string; status?: string }): Lead[] {
  let leads = getLeads();
  if (opts.search) {
    const q = opts.search.toLowerCase();
    leads = leads.filter(l => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.route.toLowerCase().includes(q));
  }
  if (opts.intent) leads = leads.filter(l => l.intent === opts.intent);
  if (opts.status) leads = leads.filter(l => l.status === opts.status);
  return leads;
}

// ── CONVERSATIONS ────────────────────────────────────────────────

export function getConversations(): Conversation[] {
  return read<Conversation[]>(KEYS.conversations) || [];
}

export function getConversation(id: string): Conversation | undefined {
  return getConversations().find(c => c.id === id);
}

export function addMessageToConversation(convId: string, msg: Omit<Message, 'id'>): Message | null {
  const convs = getConversations();
  const conv = convs.find(c => c.id === convId);
  if (!conv) return null;
  const message: Message = { ...msg, id: uid() };
  conv.messages.push(message);
  write(KEYS.conversations, convs);
  return message;
}

export function createConversation(visitorName: string, visitorEmail: string, type: 'SALES' | 'SUPPORT'): Conversation {
  const convs = getConversations();
  const conv: Conversation = {
    id: uid(),
    type,
    visitorName,
    visitorEmail,
    messages: [],
    intent: type === 'SALES' ? 'New Inquiry' : 'Support Request',
    intentType: 'secondary',
    status: 'Active',
    duration: '0m 0s',
    leadCaptured: false,
    createdAt: new Date().toISOString(),
  };
  convs.unshift(conv);
  write(KEYS.conversations, convs);
  return conv;
}

// ── KNOWLEDGE BASE ───────────────────────────────────────────────

export function getKBCategories(): KBCategory[] {
  return read<KBCategory[]>(KEYS.kb) || [];
}

export function addKBEntry(categoryId: string, title: string, content: string): KBEntry | null {
  const cats = getKBCategories();
  const cat = cats.find(c => c.id === categoryId);
  if (!cat) return null;
  const entry: KBEntry = { id: uid(), categoryId, title, content, lastUpdated: new Date().toISOString() };
  cat.entries.push(entry);
  write(KEYS.kb, cats);
  return entry;
}

export function updateKBEntry(categoryId: string, entryId: string, updates: Partial<KBEntry>): boolean {
  const cats = getKBCategories();
  const cat = cats.find(c => c.id === categoryId);
  if (!cat) return false;
  const idx = cat.entries.findIndex(e => e.id === entryId);
  if (idx === -1) return false;
  cat.entries[idx] = { ...cat.entries[idx], ...updates, lastUpdated: new Date().toISOString() };
  write(KEYS.kb, cats);
  return true;
}

export function deleteKBEntry(categoryId: string, entryId: string): boolean {
  const cats = getKBCategories();
  const cat = cats.find(c => c.id === categoryId);
  if (!cat) return false;
  const before = cat.entries.length;
  cat.entries = cat.entries.filter(e => e.id !== entryId);
  if (cat.entries.length === before) return false;
  write(KEYS.kb, cats);
  return true;
}

// ── DASHBOARD ────────────────────────────────────────────────────

export function getDashboardStats(): DashboardStats {
  const convs = getConversations();
  const leads = getLeads();
  const kb = getKBCategories();
  const totalEntries = kb.reduce((sum, c) => sum + c.entries.length, 0);
  const maxEntries = Math.max(kb.length * 5, 1);

  // Leads this week
  const weekAgo = Date.now() - 7 * 86400000;
  const leadsThisWeek = leads.filter(l => new Date(l.capturedAt).getTime() > weekAgo).length;

  // Conversion rate
  const converted = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = leads.length > 0 ? `${Math.round((converted / leads.length) * 100)}%` : '0%';

  // Top route
  const routeCount: Record<string, number> = {};
  leads.forEach(l => { if (l.route) routeCount[l.route] = (routeCount[l.route] || 0) + 1; });
  const topRoute = Object.entries(routeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  // Leads by day (last 7 days)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const leadsByDay: { day: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 86400000;
    const count = leads.filter(l => {
      const t = new Date(l.capturedAt).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
    leadsByDay.push({ day: dayNames[d.getDay()], count });
  }

  // Tunnel split
  const sales = convs.filter(c => c.type === 'SALES').length;
  const support = convs.filter(c => c.type === 'SUPPORT').length;

  return {
    totalConversations: convs.length,
    activeConversations: convs.filter(c => c.status === 'Active').length,
    leadsCount: leads.length,
    leadsThisWeek,
    avgResponse: '1.8s',
    kbCoverage: `${Math.round((totalEntries / maxEntries) * 100)}%`,
    conversionRate,
    topRoute,
    leadsByDay,
    tunnelSplit: { sales, support },
  };
}

// ── AGENTS ───────────────────────────────────────────────────────

export function getAgents(): Agent[] {
  return read<Agent[]>('bbc_agents') || [];
}

export function getOnlineAgents(tunnel?: string): Agent[] {
  let agents = getAgents().filter(a => a.status === 'online');
  if (tunnel) agents = agents.filter(a => a.tunnel === tunnel || a.tunnel === 'both');
  return agents;
}

export function updateAgentStatus(id: string, status: Agent['status']): boolean {
  const agents = getAgents();
  const idx = agents.findIndex(a => a.id === id);
  if (idx === -1) return false;
  agents[idx] = { ...agents[idx], status, lastActive: new Date().toISOString() };
  write('bbc_agents', agents);
  return true;
}

// ── SETTINGS ─────────────────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  companyName: 'Buy Business Class',
  widgetPosition: 'bottom-right',
  salesGreeting: 'Welcome aboard! Where are you looking to fly in business class?',
  supportGreeting: 'Hi! I can help with booking changes, cancellations, or questions about your trip.',
  businessHoursStart: '09:00',
  businessHoursEnd: '18:00',
  businessTimezone: 'America/New_York',
  autoReplyAfterHours: true,
  afterHoursMessage: 'Our specialists are available 9 AM – 6 PM EST. Leave your number and we\'ll reach out first thing tomorrow.',
  maxAIMessagesPerConv: 20,
  aiModel: 'haiku',
  enableLeadNotifications: true,
  enableSlackNotifications: false,
  slackWebhookUrl: '',
};

export function getSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<AppSettings>>('bbc_settings') };
}

export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const next = { ...current, ...updates };
  write('bbc_settings', next);
  return next;
}

// ── CONVERSATIONS ENHANCED ───────────────────────────────────────

export function closeConversation(id: string): boolean {
  const convs = getConversations();
  const idx = convs.findIndex(c => c.id === id);
  if (idx === -1) return false;
  convs[idx].status = 'Closed';
  write(KEYS.conversations, convs);
  return true;
}

export function getConversationsByStatus(status: string): Conversation[] {
  return getConversations().filter(c => c.status === status);
}

export function getConversationsByType(type: 'SALES' | 'SUPPORT'): Conversation[] {
  return getConversations().filter(c => c.type === type);
}
