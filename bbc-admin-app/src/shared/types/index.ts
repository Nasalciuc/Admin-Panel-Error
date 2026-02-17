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
