# AGENTS.md

## Commands

### Frontend
```bash
cd client && npm run dev    # Dev server :5173
npm run build            # Production build
npm run lint             # ESLint
```

### Backend
```bash
cd server && npm run dev  # Dev server :3000
npx prisma migrate dev  # Create/run migrations
npx prisma generate    # Generate Prisma client
```

## Setup

**server/.env:**
```
DATABASE_URL="postgresql://..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
```

**client/.env:**
```
VITE_BACKEND_URL="http://localhost:3000/api"
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

## Architecture

- **Backend**: Modular under `server/src/modules/` (user, job, application, professionalProfile, clientProfile, profile)
- **Client**: Role-based layouts (ClientLayout, ProfessionalLayout) with routes under `/client/*` and `/professional/*`
- **API**: Routes at `/api` prefix; Prisma client auto-generated to `server/src/generated/prisma`
- **Database**: Prisma with PostgreSQL (Neon); run `npx prisma generate` after schema changes before building

## Run Order

1. Start backend first: `cd server && npm run dev`
2. Then frontend: `cd client && npm run dev`
