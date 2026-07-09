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
npm run build       # npx prisma generate && tsc
npm run seed        # Seed database
npx prisma migrate dev   # Create/run migrations (only if schema changed)
npx prisma generate      # Regenerate client after schema.prisma edits (required before dev/build)
npx prisma studio        # Visual DB browser
```

**Run order:** Start `server/` first, then `client/`.

**Always `npx prisma generate` after editing `schema.prisma`.** Prisma client is output to `server/src/generated/prisma/` (custom path, gitignored). Without it, `server/` won't start.

## Auth: Clerk dual-ID system

Two user IDs:
- **`clerkUserId`** — Clerk's ID, used only during onboarding to create the internal user
- **`userId`** (internal DB `cuid`) — used for all Prisma relations

`authMiddleware` resolves both onto `req.auth`. On first login `userId` is `null` until user completes onboarding at `/select-role`.

**Critical:** Clerk webhook at `/api/webhooks/clerk` uses `raw({ type: "application/json" })` and must be registered **before** `express.json()` in `server/src/index.ts` (already correct — don't reorder).

## Backend architecture

`server/src/modules/<entity>/` — each domain: `.route.ts`, `.controller.ts`, `.service.ts`, `.schema.ts`. Middleware chain:
```
authMiddleware → roleMiddleware("ROLE") → validateData(schema) → controller
```

All routes under `/api`. Prisma client instantiated once in `server/src/lib/prisma.ts` with `@prisma/adapter-pg` + connection pooling.

Route prefixes: `users`, `jobs`, `profiles`, `professional-profiles`, `client-profiles`, `applications`, `invitations`.

## Frontend architecture

- **`store/Auth.tsx`** — `AuthProvider` + `useAppAuth()`. Wraps Clerk hooks, fetches internal user from `/api/users/me`. Exposes `{ user, loading, needsOnboarding, isAuthenticated, refreshUser }`. Registers Clerk's `getToken` into Axios interceptor.
- **`lib/axios.ts`** — Single Axios instance at `VITE_BACKEND_URL`. Token auto-injected.
- **`routes/index.tsx`** — Three layout groups: public (`RootLayout`), `/professional/*` (`ProfessionalLayout`), `/client/*` (`ClientLayout`). `/select-role` gated by `ProtectedRole`.
- **`services/`** — One file per domain, plain async functions over `axiosInstance`, consumed via TanStack Query.
- **`components/ui/`** — Shadcn/Radix UI primitives.
- Path alias `@/` maps to `client/src/`.

## Env files

| File | Variables | Gitignored? |
|------|-----------|-------------|
| `server/.env` | `DATABASE_URL`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` | ✅ Yes |
| `client/.env` | `VITE_BACKEND_URL`, `VITE_CLERK_PUBLISHABLE_KEY` | ✅ Yes (was previously tracked — check `git rm --cached` if it reappears) |

## Deployment

- **Frontend:** Netlify (`client/`)
- **Backend:** Vercel Serverless — `vercel-build` runs `prisma generate` only (no `tsc`)
- **DB:** Neon (serverless PostgreSQL)
