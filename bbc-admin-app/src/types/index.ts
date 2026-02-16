// ── Conversation Types ──────────────────────────────────────────────

export type ConversationStatus = 'active' | 'pending' | 'closed'
export type IntentTag = 'Booking Inquiry' | 'Price Inquiry' | 'Route Information' | 'Support' | 'Flight Booking' | 'General'

export interface Message {
  id: string
  role: 'visitor' | 'ai'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  sessionId: string
  visitor: {
    name: string
    email?: string
    initials: string
    avatarColor: string
  }
  messages: Message[]
  messageCount: number
  intent: IntentTag
  status: ConversationStatus
  duration: string
  timeAgo: string
  isLeadCaptured: boolean
}

// ── Lead Types ─────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  initials: string
  avatarColor: string
  route: string
  intent: IntentTag
  score: number
  isGold: boolean
  status: LeadStatus
  timeAgo: string
  dates?: string
}

// ── Knowledge Base Types ───────────────────────────────────────────

export interface KBCategory {
  id: string
  name: string
  icon: string
  articleCount: number
  lastUpdated: string
  description: string
}

export interface KBArticle {
  id: string
  categoryId: string
  title: string
  content: string
  lastUpdated: string
}

export interface KBHealth {
  category: string
  percentage: number
}

// ── Dashboard Stats ────────────────────────────────────────────────

export interface DashboardStats {
  totalConversations: number
  conversationsTrend: number
  leadsCaptures: number
  leadsTrend: number
  avgResponse: string
  kbCoverage: number
}

// ── Settings Types ─────────────────────────────────────────────────

export interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}

export interface LeadCaptureSettings {
  enabled: boolean
  captureEmail: boolean
  captureName: boolean
  capturePhone: boolean
  captureRoute: boolean
  minScoreForGold: number
}

export interface AppearanceSettings {
  primaryColor: string
  accentColor: string
  chatPosition: 'bottom-right' | 'bottom-left'
  welcomeMessage: string
}

export interface Settings {
  ai: AISettings
  leadCapture: LeadCaptureSettings
  appearance: AppearanceSettings
  apiKey: string
  webhookUrl: string
}
