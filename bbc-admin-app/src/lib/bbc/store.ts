// ── BBC Admin — Mock Data Store ──────────────────────────────────
// V1: static mock. V2: swap to API calls. Hooks don't change.

import type { BBCUser } from './types'

// ── Mock Users (4 roles) ─────────────────────────────────────────

export const MOCK_USERS: BBCUser[] = [
  { id: 'user_owner', name: 'Alex Petrov', email: 'alex@buybusinessclass.com', role: 'owner', tunnel: 'all', initials: 'AP', avatarColor: 'bg-amber-100 text-amber-700' },
  { id: 'user_admin', name: 'Scaler', email: 'scaler@buybusinessclass.com', role: 'admin', tunnel: 'all', initials: 'SC', avatarColor: 'bg-blue-100 text-blue-700' },
  { id: 'agent_sales_01', name: 'Maria Santos', email: 'maria@buybusinessclass.com', role: 'sales', tunnel: 'sales', initials: 'MS', avatarColor: 'bg-emerald-100 text-emerald-700' },
  { id: 'agent_support_01', name: 'James Wilson', email: 'james@buybusinessclass.com', role: 'support', tunnel: 'support', initials: 'JW', avatarColor: 'bg-purple-100 text-purple-700' },
]
