# BBC AI Chatbot — Admin Frontend

A modern React + TypeScript admin dashboard for managing AI-powered conversations, leads, and knowledge base for the BBC (Business Bureau of Change) chatbot platform.

## 📋 Project Overview

**BBC AI Chatbot** is a conversational AI system designed to capture leads and manage conversations for travel/business services. This repository contains the **admin frontend** — a full-featured dashboard for:

- 📊 **Dashboard** — Real-time metrics and conversation overview
- 💬 **Conversations** — Browse and manage individual chat sessions
- 👥 **Leads** — Track captured leads with scoring and CRM sync status
- 📚 **Knowledge Base** — Manage KB entries used for semantic search
- ⚙️ **Settings** — Configuration and system settings

**Current Version:** v0.1 (MVP - Local Storage, No Backend)

## 🏗️ Tech Stack

### Frontend (This Repository)
- **React 18** + **TypeScript** — Type-safe component architecture
- **Vite** — Lightning-fast build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **Lucide Icons** — Minimal, clean icon set

### Backend (Planned — Separate Repository)
- **FastAPI** (Python) on Railway Pro
- **Supabase PostgreSQL** with pgvector
- **Qdrant Cloud** (vector DB) + fallback pgvector
- **Claude Haiku + GPT-4o-mini** (LLM failover chain)

### Infrastructure
- **Vercel** — Admin frontend hosting ($0)
- **CloudFlare Pages** — Widget hosting ($0)
- **Railway Pro** — Backend + cron jobs ($7/mo)
- **Supabase Pro** — PostgreSQL + Auth + Realtime ($25/mo)
- **Qdrant Cloud** — Vector search ($0-25/mo)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for detailed tech stack decisions and [`docs/INFRASTRUCTURE-TCO.md`](docs/INFRASTRUCTURE-TCO.md) for 3-year cost analysis.

## 📁 Project Structure

```
bbc-admin-app/                    # React admin frontend
├── src/
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles
│   ├── modules/
│   │   └── admin/
│   │       ├── layout/           # Sidebar, header components
│   │       │   ├── AdminLayout.tsx
│   │       │   ├── BBCLogo.tsx
│   │       │   └── Sidebar.tsx
│   │       └── pages/            # Page components
│   │           ├── Dashboard.tsx
│   │           ├── Conversations.tsx
│   │           ├── ConversationDetail.tsx
│   │           ├── Leads.tsx
│   │           ├── KnowledgeBase.tsx
│   │           └── Settings.tsx
│   ├── shared/
│   │   ├── components/           # Reusable components
│   │   │   ├── Badge.tsx         # Status badges
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── StatCard.tsx
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useConversations.ts
│   │   │   ├── useKB.ts
│   │   │   └── useLeads.ts
│   │   ├── store/                # Local state/storage
│   │   │   └── index.ts
│   │   └── types/                # TypeScript types & interfaces
│   │       └── index.ts
│   └── public/
│       ├── favicon.png
│       └── Logo.png
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

docs/                             # Documentation
├── ARCHITECTURE.md               # Tech stack debate & decisions
└── INFRASTRUCTURE-TCO.md         # 3-year cost analysis
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (check with `node --version`)
- **npm** or **pnpm** (comes with Node)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/Nasalciuc/BBC-AI-Chatbot.git
cd "BBC ai chatbot frontend"

# Install dependencies
cd bbc-admin-app
npm install

# Start development server
npm run dev
```

The app will start at `http://localhost:5173` with hot module replacement (HMR).

### Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 📊 Current Features (v0.1)

### ✅ Implemented
- **Dashboard** — Conversation metrics, lead summary, weekly trends
- **Conversations List** — Browse all conversations with filters
- **Conversation Detail** — View individual chat messages (mock SSE)
- **Leads List** — Lead table with status, score, action tracking
- **Lead Form** — Add new leads manually
- **KB Viewer** — Browse knowledge base entries by category
- **Responsive Design** — Works on desktop, tablet, mobile
- **Type Safety** — Full TypeScript coverage

### 🚧 To Do (MVP Phase 2)
- Backend API integration
- Real SSE (Server-Sent Events) for live chat
- Database sync (Supabase)
- Vector search integration
- CRM webhook sync
- User authentication
- Role-based access control

### 📋 Known Limitations
- **No Backend** — Uses mock localStorage data (currently 8 seed leads + 3 conversations)
- **No Persistence** — Data resets on page reload
- **Mock SSE** — Simulated chat streaming (not real backend)
- **No Real-time** — Admin updates don't sync across instances

## 🎨 Design System

### Color Palette
```
Primary:   #0B1829 (Dark navy)
Accent:    #C9A54E (Gold)
Success:   #10B981 (Emerald)
Warning:   #F59E0B (Amber)
Error:     #EF4444 (Red)
Neutral:   #6B7280 (Gray)
```

### Typography
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Headings:** 600-700 weight
- **Body:** 400 weight, 14-16px

### Components
| Component | Usage |
|-----------|-------|
| `StatCard` | Dashboard metrics |
| `Badge` | Status indicators (Converted, Lost, Active, etc.) |
| `Modal` | Dialogs and confirmations |
| `EmptyState` | No-data screens |

## 🔌 API Integration (Future)

When backend is ready, replace localStorage calls in `shared/store/index.ts` with:

```typescript
// Example future API call
const getConversations = async () => {
  const res = await fetch('/api/conversations', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};
```

## 📖 Documentation

- **[Architecture Decisions](docs/ARCHITECTURE.md)** — Why we chose each tech component (5-expert debate format, all alternatives evaluated)
- **[Infrastructure TCO](docs/INFRASTRUCTURE-TCO.md)** — 3-year cost projections, failure modes, scaling strategy
- **[TypeScript](bbc-admin-app/tsconfig.json)** — Strict type checking enabled

## 🐛 Debugging

### Dev Tools
```bash
# Run TypeScript check
npm run type-check

# Run ESLint
npm run lint

# Format code
npm run format
```

### Common Issues

**Port 5173 already in use?**
```bash
# Vite will auto-increment port (5174, 5175, etc.)
# Or manually free the port on Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Module not found errors?**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

## 🤝 Contributing

### Branch Strategy
- `master` — Production-ready code
- `feature/*` — New features
- `bugfix/*` — Bug fixes
- `docs/*` — Documentation updates

### Commit Convention
```
type(scope): description

Examples:
- feat(leads): add lead scoring filter
- fix(sidebar): fix border-left pixel width
- docs: update README with new components
- refactor(store): extract lead validation logic
```

## 📝 License

BBC AI Chatbot © 2026. All rights reserved.

---

## 🚢 Deployment

### Frontend Hosting
- **Vercel** (Recommended) — $0/mo
  ```bash
  npm install -g vercel
  vercel
  ```

### Widget (Separate Bundle)
- **CloudFlare Pages** — $0/mo, edge cached

### Backend (Separate repo)
- **Railway** — $7/mo for always-on FastAPI

## 📞 Support

**Issues?** Check:
1. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Tech stack rationale
2. [`docs/INFRASTRUCTURE-TCO.md`](docs/INFRASTRUCTURE-TCO.md) — Infrastructure decisions
3. Git history — See what changed with `git log --oneline`

**Questions on infrastructure costs, scaling, or architecture decisions?** See the docs above — they contain exhaustive analysis of every alternative evaluated.

---

**Last Updated:** February 19, 2026  
**Current Commit:** Check GitHub for latest  
**Team:** Vladimir Nasalciuc, Dan, + Backend team
