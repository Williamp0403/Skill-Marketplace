# AGENTS.md

## Commands

### Frontend (`client/`)
```bash
npm run dev         # Dev server :5173
npm run build       # tsc -b && vite build (type-check + bundle)
npm run lint        # ESLint
```

### Backend (`server/`)
```bash
npm run dev         # Dev server :3000 (tsx watch)
npm run build       # prisma generate + tsc
npm run seed        # Seed database
npx prisma migrate dev   # Create/run migrations
npx prisma generate      # Regenerate client after schema changes (required before build)
npx prisma studio        # Visual DB browser
```

**Run order:** Start backend (`server/`) first, then frontend (`client/`).

**Always run `npx prisma generate` after editing `schema.prisma` before building or running the server.**

## Auth (Clerk + dual-ID)

Two user IDs: `clerkUserId` (Clerk's) used only during onboarding; `userId` (internal DB `cuid`) used for all Prisma relations. `authMiddleware` resolves both onto `req.auth`. On first login, `userId` is `null` until user completes onboarding at `/select-role`.

Clerk webhooks at `/api/webhooks/clerk` — must be registered **before** `express.json()` (needs raw body for Svix signature verification).

## Backend (`server/src/modules/`)

Each domain: `<entity>.route.ts`, `.controller.ts`, `.service.ts`, `.schema.ts`. Middleware chain: `authMiddleware → roleMiddleware("ROLE") → validateData(schema) → controller`.

Registered routes (all under `/api`): `users`, `jobs`, `profiles`, `professional-profiles`, `client-profiles`, `applications`, `invitations`.

## Frontend (`client/src/`)

- **`store/Auth.tsx`** — `AuthProvider` + `useAppAuth()`. Wraps Clerk hooks, fetches internal user from `/api/users/me`. Exposes `{ user, loading, needsOnboarding, isAuthenticated, refreshUser }`. Registers Clerk's `getToken` into Axios.
- **`lib/axios.ts`** — Single Axios instance at `VITE_BACKEND_URL`. Token injected via interceptor.
- **`routes/index.tsx`** — Three layout groups: public (`RootLayout`), `/professional/*` (`ProfessionalLayout`), `/client/*` (`ClientLayout`).
- **`services/`** — One file per domain, plain async functions over `axiosInstance`.
- **`components/ui/`** — Shadcn/Radix UI primitives.
- Role-based dashboards under `pages/client/` and `pages/professional/`.

## Deployment

- **Frontend**: Netlify (`client/`)
- **Backend**: Vercel Serverless — `vercel-build` runs `prisma generate` only (no `tsc`)
- **DB**: Neon (serverless PostgreSQL)

## Roadmap

See `implementation_plan.md` (Phases 1–4): job status tracking, invitations, notifications, chat, reviews, bookmarks.

## Env Files

**`server/.env`**: `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`

**`client/.env`**: `VITE_BACKEND_URL`, `VITE_CLERK_PUBLISHABLE_KEY`
