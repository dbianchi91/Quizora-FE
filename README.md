# Quizora — Frontend

React 19 SPA for the Quizora platform: a quiz and exam management system with an integrated AI tutor. Users can take official exams, run simulations, or study with immediate per-answer feedback. Creators can build and publish quizzes; admins have full platform oversight.

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite** — build tool and dev server (proxies `/api` → `http://localhost:5000`)
- **React Router v7** — client-side routing with lazy-loaded pages
- **TanStack Query v5** — server state, caching, and mutations
- **Zustand** — client state (auth, active exam session, AI tutor panel)
- **Tailwind CSS v4** — styling via `@tailwindcss/vite` plugin
- **shadcn/ui** — accessible UI primitives
- **Axios** — HTTP client with automatic token refresh
- **Recharts** — results and leaderboard charts
- **React Compiler** — enabled via `babel-plugin-react-compiler`; avoid manual `useMemo`/`useCallback`

## Features

| Area | Description |
|------|-------------|
| **Auth** | JWT-based login/register with silent token refresh on 401 |
| **Exam session** | Three modes — `Official`, `Simulation`, `Study`; study mode returns per-answer feedback immediately |
| **AI Tutor** | Floating chat panel with SSE streaming; context-aware help during exam sessions |
| **Results** | Score breakdown, charts, and leaderboard |
| **Creator portal** | Quiz and question management (`/creator/*`) |
| **Admin panel** | Platform-level administration (`/admin`) |

## Project Structure

```
src/
├── api/          # Axios functions grouped by domain; exam.ts normalises backend field quirks
├── hooks/        # TanStack Query hooks + query key factories
├── store/        # Zustand stores: authStore, examStore, aiStore
├── types/        # TypeScript DTOs mirroring backend contracts
├── pages/        # Lazy-loaded route components
├── components/
│   ├── layout/   # AppLayout, AuthLayout, RoleGuard
│   ├── ui/       # Shared primitives (cn utility)
│   ├── exam/     # QuestionView, QuestionNavigator, ExamTimer
│   ├── ai/       # AIChatPanel, AITutorBubble, StudyPlanTab
│   └── results/  # ResultsCharts, LeaderboardTable
└── lib/          # Utility functions
```

## Roles and Routes

- **Public** — `/login`, `/register`
- **Authenticated** — all other routes, wrapped in `AppLayout`
- **Creator** (`isCreator || isAdmin`) — `/creator/*`
- **Admin** — `/admin`
- **Exam** — `/exam/:sessionId` renders without the app shell

## Commands

```bash
npm run dev      # Start dev server on localhost:5173
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Serve production build locally
```

## Backend

This app expects the Quizora .NET 9 backend running at `http://localhost:5000`. All `/api` requests are proxied there by Vite in development.
