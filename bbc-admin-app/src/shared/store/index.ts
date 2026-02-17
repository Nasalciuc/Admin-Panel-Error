// ── BBC Admin — localStorage CRUD Store ──────────────────────────
// Single persistence layer. Swap to API calls in V2.

import type { Lead, Conversation, Message, KBCategory, KBEntry } from '../types';

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
    { id: uid(), name: 'John Thompson', initials: 'JT', email: 'john.thompson@email.com', phone: '', route: 'NYC → LHR', intent: 'Flight Booking', score: 92, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-blue-100 text-blue-700', notes: '' },
    { id: uid(), name: 'Sarah Chen', initials: 'SC', email: 'sarah.chen@email.com', phone: '', route: 'LAX → NRT', intent: 'Price Inquiry', score: 78, status: 'Contacted', capturedAt: new Date().toISOString(), avatarColor: 'bg-emerald-100 text-emerald-700', notes: '' },
    { id: uid(), name: 'Michael Davis', initials: 'MD', email: 'michael.davis@email.com', phone: '', route: 'ORD → CDG', intent: 'Route Information', score: 84, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-purple-100 text-purple-700', notes: '' },
    { id: uid(), name: 'Emily Wilson', initials: 'EW', email: 'emily.wilson@email.com', phone: '', route: 'MIA → DXB', intent: 'Flight Booking', score: 89, status: 'Contacted', capturedAt: new Date().toISOString(), avatarColor: 'bg-amber-100 text-amber-700', notes: '' },
    { id: uid(), name: 'David Lee', initials: 'DL', email: 'david.lee@email.com', phone: '', route: 'SFO → HKG', intent: 'Price Inquiry', score: 75, status: 'Contacted', capturedAt: new Date().toISOString(), avatarColor: 'bg-rose-100 text-rose-700', notes: '' },
    { id: uid(), name: 'Jennifer Garcia', initials: 'JG', email: 'jennifer.garcia@email.com', phone: '', route: 'ATL → AMS', intent: 'Flight Booking', score: 86, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-cyan-100 text-cyan-700', notes: '' },
    { id: uid(), name: 'Robert Kim', initials: 'RK', email: 'robert.kim@email.com', phone: '', route: 'DFW → FRA', intent: 'Route Information', score: 72, status: 'Contacted', capturedAt: new Date().toISOString(), avatarColor: 'bg-indigo-100 text-indigo-700', notes: '' },
    { id: uid(), name: 'Amanda White', initials: 'AW', email: 'amanda.white@email.com', phone: '', route: 'SEA → SYD', intent: 'Flight Booking', score: 90, status: 'New', capturedAt: new Date().toISOString(), avatarColor: 'bg-teal-100 text-teal-700', notes: '' },
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

export function getDashboardStats() {
  const convs = getConversations();
  const leads = getLeads();
  const kb = getKBCategories();
  const totalEntries = kb.reduce((sum, c) => sum + c.entries.length, 0);
  const maxEntries = kb.length * 5;

  return {
    totalConversations: convs.length,
    leadsCount: leads.length,
    avgResponse: '1.8s',
    kbCoverage: maxEntries > 0 ? `${Math.round((totalEntries / maxEntries) * 100)}%` : '0%',
  };
}
