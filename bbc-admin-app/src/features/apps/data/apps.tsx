import { Database, Brain, MessageSquare, Webhook } from 'lucide-react'

// BBC Admin — real integrations (status from backend in V2)

export const apps = [
  {
    name: 'Supabase',
    logo: <Database className='w-10 h-10 text-green-600' />,
    connected: true,
    desc: 'PostgreSQL database with pgvector, RLS, and Realtime.',
  },
  {
    name: 'Qdrant Cloud',
    logo: <Brain className='w-10 h-10 text-purple-600' />,
    connected: true,
    desc: 'Vector search engine for KB semantic search.',
  },
  {
    name: 'Claude API',
    logo: <MessageSquare className='w-10 h-10 text-amber-600' />,
    connected: true,
    desc: 'Anthropic Claude Haiku + Sonnet for AI pipeline.',
  },
  {
    name: 'CRM Webhook',
    logo: <Webhook className='w-10 h-10 text-gray-400' />,
    connected: false,
    desc: 'Sync converted leads to CRM system. Planned for V3.',
  },
]
