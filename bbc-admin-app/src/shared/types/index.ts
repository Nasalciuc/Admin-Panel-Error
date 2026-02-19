// ── BBC Admin — Type Definitions ─────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  route: string;
  intent: 'Flight Booking' | 'Price Inquiry' | 'Route Information';
  score: number;
  status: 'New' | 'Contacted' | 'Converted' | 'Lost';
  capturedAt: string;
  avatarColor: string;
  notes: string;
  leadSource?: 'chat_sales' | 'chat_support' | 'manual' | 'import';
  tags?: string[];
}

export interface RouteCard {
  route: string;
  originCode: string;
  destinationCode: string;
  duration: string;
  airlines: string[];
  dates: string;
  priceRange: string;
  isNonStop: boolean;
}

export interface Message {
  id: string;
  role: 'visitor' | 'ai' | 'agent';
  content: string;
  timestamp: string;
  isLeadCapture?: boolean;
  routeCard?: RouteCard;
}

export interface Conversation {
  id: string;
  type: 'SALES' | 'SUPPORT';
  visitorName: string;
  visitorEmail: string;
  messages: Message[];
  intent: string;
  intentType: 'primary' | 'secondary';
  status: 'Active' | 'Pending' | 'Closed';
  duration: string;
  leadCaptured: boolean;
  createdAt: string;
}

export interface KBEntry {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface KBCategory {
  id: string;
  name: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  entries: KBEntry[];
}

// ── Agent (V2 human handoff prep) ────────────────────────────────

export interface Agent {
  id: string;
  name: string;
  initials: string;
  email: string;
  status: 'online' | 'offline' | 'busy';
  tunnel: 'sales' | 'support' | 'both';
  activeConversations: number;
  lastActive: string;
  avatarColor: string;
}

// ── Dashboard Stats Extended ─────────────────────────────────────

export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  leadsCount: number;
  leadsThisWeek: number;
  avgResponse: string;
  kbCoverage: string;
  conversionRate: string;
  topRoute: string;
  leadsByDay: { day: string; count: number }[];       // last 7 days
  tunnelSplit: { sales: number; support: number };
}

// ── Settings ─────────────────────────────────────────────────────

export interface AppSettings {
  companyName: string;
  widgetPosition: 'bottom-right' | 'bottom-left';
  salesGreeting: string;
  supportGreeting: string;
  businessHoursStart: string;   // "09:00"
  businessHoursEnd: string;     // "18:00"
  businessTimezone: string;     // "America/New_York"
  autoReplyAfterHours: boolean;
  afterHoursMessage: string;
  maxAIMessagesPerConv: number;
  aiModel: 'haiku' | 'sonnet';
  enableLeadNotifications: boolean;
  enableSlackNotifications: boolean;
  slackWebhookUrl: string;
}

// ── Metrics Event ────────────────────────────────────────────────

export interface MetricEvent {
  id: string;
  type: 'chat_response' | 'lead_captured' | 'handoff' | 'fallback';
  model: 'template' | 'haiku' | 'sonnet' | 'template_fallback';
  cost: number;
  latencyMs: number;
  intent: string;
  tunnel: 'sales' | 'support';
  kbHit: boolean;
  timestamp: string;
}
