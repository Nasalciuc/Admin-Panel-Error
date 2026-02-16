import type {
  Conversation,
  Lead,
  KBCategory,
  KBHealth,
  DashboardStats,
  Settings,
} from '../types'

// ── Dashboard Stats ────────────────────────────────────────────────

export const dashboardStats: DashboardStats = {
  totalConversations: 247,
  conversationsTrend: 12,
  leadsCaptures: 38,
  leadsTrend: 23,
  avgResponse: '1.8s',
  kbCoverage: 94,
}

// ── Conversations ──────────────────────────────────────────────────

export const conversations: Conversation[] = [
  {
    id: '1',
    sessionId: 'a3f9c2',
    visitor: { name: 'Danni Gher', email: 'danni.g@email.com', initials: 'DG', avatarColor: 'bg-blue-100 text-blue-600' },
    messages: [
      { id: 'm1', role: 'visitor', content: 'Hi, I\'m looking for business class flights from NYC to London next month. Can you help?', timestamp: '2:34 PM' },
      { id: 'm2', role: 'ai', content: 'Hello! Absolutely, I can assist with that. Could you please specify your preferred travel dates?', timestamp: '2:34 PM' },
      { id: 'm3', role: 'visitor', content: 'Around the 15th of October for about a week.', timestamp: '2:35 PM' },
    ],
    messageCount: 3,
    intent: 'Booking Inquiry',
    status: 'active',
    duration: '4m 32s',
    timeAgo: '2m ago',
    isLeadCaptured: true,
  },
  {
    id: '2',
    sessionId: 'b7e4d1',
    visitor: { name: 'Amoa Smiler', email: 'amoa.s@email.com', initials: 'AS', avatarColor: 'bg-orange-100 text-orange-600' },
    messages: [
      { id: 'm4', role: 'visitor', content: 'What are the prices for business class to Tokyo?', timestamp: '2:30 PM' },
      { id: 'm5', role: 'ai', content: 'Business class fares to Tokyo typically range from $3,200 to $5,800 depending on dates and airline.', timestamp: '2:30 PM' },
    ],
    messageCount: 2,
    intent: 'Booking Inquiry',
    status: 'pending',
    duration: '2m 10s',
    timeAgo: '2m ago',
    isLeadCaptured: false,
  },
  {
    id: '3',
    sessionId: 'c9f2a8',
    visitor: { name: 'Annory Schrinm', email: 'annory.s@email.com', initials: 'AS', avatarColor: 'bg-green-100 text-green-600' },
    messages: [
      { id: 'm6', role: 'visitor', content: 'Do you have direct routes from Chicago to Paris?', timestamp: '2:20 PM' },
      { id: 'm7', role: 'ai', content: 'Yes! We have several direct routes from ORD to CDG. Would you like to see available options?', timestamp: '2:20 PM' },
      { id: 'm8', role: 'visitor', content: 'Yes please, for November.', timestamp: '2:21 PM' },
      { id: 'm9', role: 'ai', content: 'I found 3 excellent options for November. Let me share the details...', timestamp: '2:21 PM' },
    ],
    messageCount: 4,
    intent: 'Booking Inquiry',
    status: 'active',
    duration: '6m 15s',
    timeAgo: '5m ago',
    isLeadCaptured: true,
  },
  {
    id: '4',
    sessionId: 'd4e1b3',
    visitor: { name: 'Danni Scaler', email: 'danni.sc@email.com', initials: 'DS', avatarColor: 'bg-purple-100 text-purple-600' },
    messages: [
      { id: 'm10', role: 'visitor', content: 'I need help with my existing booking.', timestamp: '2:15 PM' },
    ],
    messageCount: 1,
    intent: 'Support',
    status: 'closed',
    duration: '1m 05s',
    timeAgo: '5m ago',
    isLeadCaptured: false,
  },
]

// ── John Thompson conversation detail ──────────────────────────────

export const johnThompsonConversation: Conversation = {
  id: '5',
  sessionId: 'a3f9c2',
  visitor: {
    name: 'John Thompson',
    email: 'john.thompson@email.com',
    initials: 'JT',
    avatarColor: 'bg-blue-100 text-blue-600',
  },
  messages: [
    { id: 'jt1', role: 'visitor', content: 'Hi, I\'m looking for business class flights from NYC to London next month. Can you help?', timestamp: '2:34 PM' },
    { id: 'jt2', role: 'ai', content: 'Hello! Absolutely, I can assist with that. Could you please specify your preferred travel dates?', timestamp: '2:34 PM' },
    { id: 'jt3', role: 'visitor', content: 'Around the 15th of October for about a week.', timestamp: '2:35 PM' },
    { id: 'jt4', role: 'ai', content: 'Thank you, John. I\'ve noted your details. Based on your preferences, here is a popular route option:', timestamp: '2:36 PM' },
  ],
  messageCount: 8,
  intent: 'Flight Booking',
  status: 'active',
  duration: '4m 32s',
  timeAgo: '2m ago',
  isLeadCaptured: true,
}

// ── Leads ──────────────────────────────────────────────────────────

export const leads: Lead[] = [
  {
    id: '1',
    name: 'John Thompson',
    email: 'john.t...@email.com',
    phone: '+1 555-0192',
    initials: 'JT',
    avatarColor: 'bg-amber-100 text-amber-700',
    route: 'NYC → LHR',
    intent: 'Flight Booking',
    score: 92,
    isGold: true,
    status: 'new',
    timeAgo: '2 min ago',
    dates: 'Oct 15 - Oct 22',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.c...@email.com',
    phone: '+1 555-1234',
    initials: 'SC',
    avatarColor: 'bg-teal-100 text-teal-700',
    route: 'LAX → NRT',
    intent: 'Price Inquiry',
    score: 78,
    isGold: false,
    status: 'contacted',
    timeAgo: '15 min ago',
  },
  {
    id: '3',
    name: 'Michael Davis',
    email: 'michael.d...@email.com',
    phone: '+1 555-9876',
    initials: 'MD',
    avatarColor: 'bg-blue-100 text-blue-700',
    route: 'ORD → CDG',
    intent: 'Route Information',
    score: 84,
    isGold: true,
    status: 'new',
    timeAgo: '1 hr ago',
  },
  {
    id: '4',
    name: 'Emily Wilson',
    email: 'emily.w...@email.com',
    phone: '+1 555-5678',
    initials: 'EW',
    avatarColor: 'bg-purple-100 text-purple-700',
    route: 'MIA → DXB',
    intent: 'Flight Booking',
    score: 89,
    isGold: true,
    status: 'contacted',
    timeAgo: '3 hrs ago',
  },
  {
    id: '5',
    name: 'David Lee',
    email: 'david.l...@email.com',
    phone: '+1 555-2345',
    initials: 'DL',
    avatarColor: 'bg-rose-100 text-rose-700',
    route: 'SFO → HKG',
    intent: 'Price Inquiry',
    score: 75,
    isGold: false,
    status: 'contacted',
    timeAgo: '5 hrs ago',
  },
  {
    id: '6',
    name: 'Jennifer Garcia',
    email: 'jennifer.g...@email.com',
    phone: '+1 555-8901',
    initials: 'JG',
    avatarColor: 'bg-emerald-100 text-emerald-700',
    route: 'ATL → AMS',
    intent: 'Flight Booking',
    score: 86,
    isGold: true,
    status: 'new',
    timeAgo: '1 day ago',
  },
  {
    id: '7',
    name: 'Robert Kim',
    email: 'robert.k...@email.com',
    phone: '+1 555-3456',
    initials: 'RK',
    avatarColor: 'bg-sky-100 text-sky-700',
    route: 'DFW → FRA',
    intent: 'Route Information',
    score: 72,
    isGold: false,
    status: 'contacted',
    timeAgo: '2 days ago',
  },
  {
    id: '8',
    name: 'Amanda White',
    email: 'amanda.w...@email.com',
    phone: '+1 555-6789',
    initials: 'AW',
    avatarColor: 'bg-orange-100 text-orange-700',
    route: 'SEA → SYD',
    intent: 'Flight Booking',
    score: 90,
    isGold: true,
    status: 'new',
    timeAgo: '3 days ago',
  },
]

// ── Knowledge Base ────────────────────────────────────────────────

export const kbCategories: KBCategory[] = [
  { id: '1', name: 'Company Info', icon: 'Building2', articleCount: 12, lastUpdated: '2 days ago', description: 'About the company, contact details, and general information.' },
  { id: '2', name: 'Benefits', icon: 'Star', articleCount: 8, lastUpdated: '1 week ago', description: 'Business class benefits, loyalty programs, and perks.' },
  { id: '3', name: 'Routes', icon: 'Plane', articleCount: 24, lastUpdated: '3 days ago', description: 'Available routes, airlines, and flight schedules.' },
  { id: '4', name: 'Booking', icon: 'CalendarCheck', articleCount: 15, lastUpdated: '1 day ago', description: 'Booking process, payment options, and modifications.' },
  { id: '5', name: 'FAQ', icon: 'HelpCircle', articleCount: 32, lastUpdated: '5 days ago', description: 'Frequently asked questions and common queries.' },
]

export const kbHealth: KBHealth[] = [
  { category: 'FAQ', percentage: 70 },
  { category: 'Booking', percentage: 60 },
  { category: 'Destinations', percentage: 90 },
  { category: 'Policies', percentage: 45 },
]

// ── Settings ──────────────────────────────────────────────────────

export const defaultSettings: Settings = {
  ai: {
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: 'You are a helpful assistant for Buy Business Class, a premium travel service...',
  },
  leadCapture: {
    enabled: true,
    captureEmail: true,
    captureName: true,
    capturePhone: false,
    captureRoute: true,
    minScoreForGold: 80,
  },
  appearance: {
    primaryColor: '#0B1829',
    accentColor: '#C9A54E',
    chatPosition: 'bottom-right',
    welcomeMessage: 'Hello! How can I help you find the perfect business class flight?',
  },
  apiKey: 'sk-••••••••••••••••',
  webhookUrl: 'https://api.buybusinessclass.com/webhook',
}
