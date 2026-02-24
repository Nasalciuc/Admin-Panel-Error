# BBC Admin Panel

Professional admin dashboard for the **BuyBusinessClass** AI chatbot. Manage conversations, leads, knowledge base, and team with role-based access control.

**Tech Stack:** React 19 + TypeScript + TanStack Router + shadcn/ui + Tailwind CSS + Vite

---

## ✨ Features

- 📊 **Dashboard** — Real-time metrics and activity overview
- 💬 **Conversations** — Browse and manage chat sessions
- 👥 **Leads** — Track captured leads with scoring and status
- 📚 **Knowledge Base** — Separate Sales/Support KB with CRUD ready
- 👤 **Users** — Team management with RBAC roles
- 📋 **Tasks** — Task management system
- ⚙️ **Settings** — Profile, account, appearance, notifications
- 🔐 **RBAC** — Owner, Admin, Sales Agent, Support Agent roles
- 🌓 **Dark Mode** — System theme support
- 🔍 **Global Search** — Command palette (⌘K / Ctrl+K)
- 📱 **Responsive** — Desktop, tablet, mobile ready
- ✅ **Type-Safe** — Zero TypeScript errors

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Components** | shadcn/ui (Radix UI + Tailwind CSS) |
| **Routing** | TanStack Router (file-based) |
| **State Management** | Zustand + React Hooks |
| **Build Tool** | Vite |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS 4 |
| **Form Handling** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Code Quality** | ESLint + Prettier |

---

## Project Structure

```
src/
├── lib/bbc/                      # BBC Business Logic
│   ├── types.ts                 # Types: Lead, Conversation, KB, RBAC
│   ├── store.ts                 # Mock data (8 leads, 5 conversations)
│   ├── hooks.ts                 # useAuth(), usePermissions()
│   └── index.ts                 # Barrel export
│
├── features/                     # Feature pages
│   ├── dashboard/               # Dashboard page
│   ├── leads/                   # Leads management
│   ├── knowledge-base/          # KB with Sales/Support toggle
│   ├── users/                   # User management
│   ├── chats/                   # Conversations
│   ├── tasks/                   # Task management
│   └── settings/                # Settings pages
│
├── components/                   # Reusable components
│   ├── layout/                  # Sidebar, header, main layout
│   ├── data-table/              # DataTable component
│   ├── ui/                      # shadcn/ui components
│   └── search.tsx               # Global search
│
├── routes/                       # TanStack Router
│   ├── _authenticated/          # Protected routes
│   ├── (auth)/                  # Auth pages
│   └── (errors)/                # Error pages
│
└── styles/                       # Global CSS & theme
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Installation & Run

```bash
# Clone repository
git clone https://github.com/Nasalciuc/BBC-AI-Chatbot-Admin-Frontend-.git

# Enter directory
cd BBC-AI-Chatbot-Admin-Frontend-/bbc-admin-app

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Visit `http://localhost:5173/`

---

## Pages & Routes

### Main Pages
- `/` — Dashboard with metrics
- `/conversations` — Chat session browser
- `/leads` — Leads management (8 mock leads)
- `/knowledge-base` — Sales/Support KB
- `/users` — Team management
- `/tasks` — Task management
- `/apps` — Integrations

### Settings
- `/settings` — Profile
- `/settings/account` — Account settings
- `/settings/appearance` — Theme & layout
- `/settings/notifications` — Notification preferences
- `/settings/display` — Display options

### Auth Pages
- `/sign-in` — Sign in
- `/sign-up` — Sign up
- `/forgot-password` — Password recovery
- `/otp` — OTP verification

### Error Pages
- `/errors/unauthorized` — 401
- `/errors/forbidden` — 403
- `/errors/not-found` — 404
- `/errors/internal-server-error` — 500
- `/errors/maintenance-error` — Maintenance

---

## Mock Data

### Leads (V1 - Production Ready)
- 8 realistic leads with diverse intents
- Includes: name, email, phone, route, intent, score, status
- Sources: Chat sales capture, chat support, manual, import
- Statuses: New, Contacted, Converted, Lost

### Conversations (V1)
- 5 conversations (2 SALES, 2 SUPPORT, 1 abandoned)
- Full message threads with timestamps
- Lead capture indicators
- Agent assignment

### Knowledge Base (V1)
- 6 categories (3 Sales, 3 Support)
- 11 total KB entries
- Categories: Routes, Airlines, Pricing, Booking Changes, Baggage, Refunds

### Users (4 Roles)
- **Owner** — All permissions
- **Admin** — All permissions
- **Sales Agent** — Leads, KB view, propose KB changes
- **Support Agent** — KB view, propose KB changes

---

## RBAC Permissions

| Feature | Owner | Admin | Sales | Support |
|---------|-------|-------|-------|---------|
| View Dashboard | ✅ | ✅ | ❌ | ❌ |
| View Leads | ✅ | ✅ | ✅ | ❌ |
| Edit Leads | ✅ | ✅ | ❌ | ❌ |
| View All Conversations | ✅ | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| View KB | ✅ | ✅ | ✅ | ✅ |
| Edit KB | ✅ | ✅ | ❌ | ❌ |
| Propose KB Changes | ✅ | ✅ | ✅ | ✅ |
| Edit Settings | ✅ | ✅ | ❌ | ❌ |

---

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server with HMR

# Build & Deployment
pnpm build            # Build for production (tsc + vite)
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Check for ESLint errors
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without changes
pnpm knip             # Find unused imports/exports

# Type Checking
npx tsc --noEmit      # Type check without emitting
```

---

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t bbc-admin .
docker run -p 5173:5173 bbc-admin
```

### Manual (Any Host)
```bash
pnpm build
# Upload dist/ to your hosting
```

---

## Next Steps (V2 Roadmap)

- [ ] Replace mock data with Supabase database
- [ ] Integrate FastAPI backend for real API calls
- [ ] Supabase Auth integration (replace mock auth)
- [ ] Real-time updates with Supabase subscriptions
- [ ] Dark mode persistence to localStorage
- [ ] SMS/Email notifications
- [ ] Lead export (CSV, PDF, Excel)
- [ ] Advanced search & filtering
- [ ] Analytics dashboard
- [ ] CRM integrations (HubSpot, Pipedrive)
- [ ] Team collaboration features
- [ ] Webhook support

---

## Troubleshooting

### Dev server won't start
```bash
pnpm install --force
pnpm dev
```

### TypeScript errors
```bash
pnpm install
npx tsc --noEmit
```

### Build fails
```bash
rm -rf dist node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Port 5173 already in use
```bash
pnpm dev -- --port 5174
```

---

## Customization

### Change Sidebar Navigation
Edit: `src/components/layout/data/sidebar-data.ts`

### Change Theme Colors
Edit: `src/styles/theme.css`

### Add New Page
1. Create route file: `src/routes/_authenticated/mypage/index.tsx`
2. Create feature: `src/features/mypage/index.tsx`
3. Add to sidebar in `sidebar-data.ts`

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## License

MIT License — Free to use in personal and commercial projects.

---

## Support & Contact

- 📧 **Email:** alex@buybusinessclass.com
- 🐙 **GitHub:** [Nasalciuc/BBC-AI-Chatbot-Admin-Frontend-](https://github.com/Nasalciuc/BBC-AI-Chatbot-Admin-Frontend-)
- 💬 **Issues:** [Report bugs here](https://github.com/Nasalciuc/BBC-AI-Chatbot-Admin-Frontend-/issues)

---

**Built with ❤️ for BuyBusinessClass**

Part of the [BBC AI Chatbot](https://github.com/Nasalciuc/BBC-AI-Chatbot) ecosystem
