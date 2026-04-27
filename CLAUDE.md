# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (`client/`)
```bash
cd client && npm run dev        # Dev server on :5173
npm run build                   # Type-check + Vite build
npm run lint                    # ESLint
```

### Backend (`server/`)
```bash
cd server && npm run dev        # Dev server on :3000 (tsx watch)
npm run build                   # prisma generate + tsc
npm run seed                    # Seed database
```

### Database
```bash
cd server
npx prisma migrate dev          # Create and apply a new migration
npx prisma generate             # Regenerate client after schema changes (required before build)
npx prisma studio               # Visual DB browser
```

**Always run `npx prisma generate` after editing `schema.prisma` before building or running the server.**

## Architecture

### Overview
Full-stack freelance marketplace. Clients post jobs; professionals apply. Two completely separate dashboards under `/client/*` and `/professional/*`.

### Authentication (Clerk + dual-ID system)
Authentication is handled by **Clerk**. The backend uses `@clerk/clerk-sdk-node` to verify JWT tokens sent as `Authorization: Bearer <token>`.

There are **two user IDs** in play:
- `clerkUserId` — Clerk's identifier, used only during onboarding to create the internal user record.
- `userId` (internal DB `cuid`) — used for all Prisma relations after the user exists.

`authMiddleware` resolves both and attaches them to `req.auth`. On first login, `userId` is `null` until the user completes onboarding at `/select-role`.

Clerk webhooks at `/api/webhooks/clerk` sync `name` and `avatarUrl` from Clerk to the DB automatically. The webhook route must be registered **before** `express.json()` because it needs the raw body for Svix signature verification.

### Backend module structure (`server/src/modules/`)
Each domain entity has its own folder with four files:
```
<entity>/
  <entity>.route.ts       # Express router
  <entity>.controller.ts  # Request/response handling, calls service
  <entity>.service.ts     # Business logic + Prisma queries
  <entity>.schema.ts      # Zod schema for request body validation
```

**Middleware chain for protected routes:**
```
authMiddleware → roleMiddleware("CLIENT"|"PROFESSIONAL") → validateData(schema) → controller
```

The Prisma client is instantiated once in `server/src/lib/prisma.ts` using `@prisma/adapter-pg` (connection pooling via `pg.Pool`) and the generated client from `server/src/generated/prisma`.

### API routes
All routes are under `/api` prefix. The main router (`server/src/routes/index.ts`) registers:
- `GET/POST /api/jobs` — public listing + client-only creation
- `GET /api/jobs/me` — client's own jobs
- `GET /api/jobs/me/stats`, `/me/recent-activity` — client dashboard data
- `POST /api/applications` — professional applies to a job
- `GET /api/applications/me`, `/me/stats` — professional's own applications
- `GET /api/applications/job/:jobId` — client sees applicants for their job
- `PATCH /api/applications/:id/status` — client accepts/rejects application
- `GET/POST /api/users/me` — user lookup and creation (onboarding)
- `GET/PUT /api/professional-profiles` — professional profile CRUD
- `GET/PUT /api/client-profiles` — client profile CRUD

### Frontend structure (`client/src/`)
- **`store/Auth.tsx`** — `AuthProvider` + `useAppAuth()`. Wraps Clerk hooks, fetches the internal user from `/api/users/me`, and exposes `{ user, loading, needsOnboarding, isAuthenticated, refreshUser }`. Also registers Clerk's `getToken` into the Axios instance so all requests auto-attach the Bearer token.
- **`lib/axios.ts`** — Single Axios instance pointed at `VITE_BACKEND_URL`. Token injection happens via a request interceptor that calls the stored `getToken` function.
- **`routes/index.tsx`** — Three layout groups: public (`RootLayout`), `/professional/*` (`ProfessionalLayout`), `/client/*` (`ClientLayout`). `/select-role` is only accessible when `needsOnboarding` is true.
- **`services/`** — One file per domain (`jobs.ts`, `applications.ts`, `profiles.ts`, etc.) containing plain async functions over `axiosInstance`. These are called from TanStack Query hooks in pages/components.
- **`schemas/`** — Zod schemas for frontend form validation (React Hook Form + `@hookform/resolvers/zod`).
- **`components/ui/`** — Shadcn/Radix UI primitives (Button, Input, Form, Select, Badge, etc.).

### Database schema (Prisma)
Core models: `User` → `ProfessionalProfile` | `ClientProfile` (one-to-one), `Job` (CLIENT creates), `Application` (PROFESSIONAL submits, unique per professional+job).

Enums: `UserRole` (CLIENT, PROFESSIONAL), `JobStatus` (OPEN, IN_PROGRESS, COMPLETED, CANCELLED), `WorkModel` (REMOTE, HYBRID, ONSITE), `ExperienceLevel`, `JobType`, `ApplicationStatus` (PENDING, ACCEPTED, REJECTED).

### Deployment
- **Frontend**: Netlify (`client/`)
- **Backend**: Vercel Serverless (`server/vercel.json` routes everything to `src/index.ts`). The `vercel-build` script only runs `prisma generate` (no `tsc`).
- **Database**: Neon (serverless PostgreSQL)

## Roadmap
See `implementation_plan.md` for the prioritized feature roadmap (Phases 1–4): job status tracking, invitation system, in-app notifications, post-acceptance chat, reviews, and saved jobs.

### Environment variables
**`server/.env`**: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`

**`client/.env`**: `VITE_BACKEND_URL`, `VITE_CLERK_PUBLISHABLE_KEY`
