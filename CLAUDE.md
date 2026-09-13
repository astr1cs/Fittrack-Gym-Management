# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo (despite the folder name `fittrack-backend`) with two independent projects, each with its own `node_modules`, lockfile, and package.json:

- `backend/` — NestJS + TypeORM + PostgreSQL REST API (port 3001)
- `frontend/` — Next.js (App Router) + React 19 + Tailwind v4 client (port 3000)

There is no root package.json / workspace config — run commands from inside `backend/` or `frontend/` respectively.

**Known repo quirk:** `frontend/src/` contains a stray, partially-diverged copy of the NestJS backend source tree (controllers/services/entities under `frontend/src/announcements`, `frontend/src/members`, etc.). It is not imported by the Next.js app (which lives under `frontend/app`, `frontend/components`, `frontend/context`, `frontend/lib`) and is not part of the Next.js build. Treat `frontend/src` as dead/accidental duplication, not a second source of truth — real backend changes belong only in `backend/src`.

## Commands

### Backend (`cd backend`)

- `npm run start:dev` — start Nest with watch mode (requires Postgres + `.env`, see below)
- `npm run build` — `nest build`
- `npm run lint` — oxlint over `src/` and `test/`
- `npm run format` — prettier write on `src/**/*.ts` and `test/**/*.ts`
- `npm test` — run unit tests once (vitest, matches `**/*.spec.ts`)
- `npm run test:watch` — vitest watch mode
- `npm run test:cov` — unit tests with coverage
- `npm run test:e2e` — e2e tests (separate config `vitest.config.e2e.ts`, matches `**/*.e2e-spec.ts`)
- Single test file: `npx vitest run src/auth/auth.service.spec.ts`
- Single test by name: `npx vitest run -t "test name"`

Local Postgres for development: `docker-compose up -d` (from `backend/`) starts a `postgres:16` container matching the `.env.example` defaults (db `fittrack`, user `postgres`). Copy `.env.example` to `.env` and fill in `JWT_SECRET` and Pusher credentials before starting the app.

### Frontend (`cd frontend`)

- `npm run dev` — Next.js dev server (Turbopack default in Next 16)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — eslint

Requires `.env.local` with `NEXT_PUBLIC_API_URL`, `API_URL`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`.

## Architecture

### Backend: NestJS module-per-domain

`backend/src/app.module.ts` wires together one feature module per domain: `auth`, `members`, `trainers`, `memberships`, `classes`, `enrollments`, `announcements`, `notifications`, plus `pusher` (shared realtime service). Each feature module follows the same shape: `*.module.ts` (TypeORM `forFeature` + DI wiring), `*.controller.ts`, `*.service.ts`, `dto/*.dto.ts` for request validation. All entities live centrally in `backend/src/entities/` (not per-module) — `user`, `member`, `trainer`, `membership-plan`, `member-membership`, `class`, `enrollment`, `announcement`, `notification`.

Domain model: a `User` has a role (`admin` | `member` | `trainer`) and an optional 1:1 `Member` or `Trainer` profile. A `Member` has many `MemberMembership` rows (linking to a `MembershipPlan`, with `start_date`/`end_date`/`status`) and many `Enrollment` rows (linking to a `Class`). `synchronize: true` is enabled in `TypeOrmModule.forRootAsync` (`app.module.ts`) — schema is derived from entities automatically in dev, there are no migrations to run.

**Auth flow:** JWT is issued on login/register and set as an httpOnly cookie (`auth.controller.ts`), not returned in the response body. `JwtStrategy` (`auth/jwt.strategy.ts`) extracts the token from `req.cookies.token` (not the `Authorization` header) and loads the `User` by `payload.sub`. Protected routes use `@UseGuards(JwtAuthGuard, RolesGuard)` at the controller level plus `@Roles(UserRole.ADMIN)` (from `auth/roles.decorator.ts`) per-handler; `RolesGuard` allows the request through when a handler has no `@Roles` metadata. `main.ts` enables global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` and CORS restricted to `http://localhost:3000` with `credentials: true` — any new frontend origin needs to be added there.

**Realtime notifications:** `PusherService` (`pusher/pusher.service.ts`) wraps the `pusher` server SDK and is injected wherever a domain event should push a realtime update (e.g. new announcement/notification). The frontend subscribes via `pusher-js` through `frontend/lib/pusher.ts` (a lazily-created singleton client).

### Frontend: Next.js App Router with route groups

- `frontend/app/(main)/...` — authenticated app shell (dashboard, members, trainers, classes, memberships, announcements, notifications), wrapped by `app/(main)/layout.tsx`
- `frontend/app/auth/...` — login/register, wrapped by `app/auth/layout.tsx`
- Top-level `frontend/app/login`, `frontend/app/register` also exist alongside `frontend/app/auth/login`, `frontend/app/auth/register` — check which is actually linked/used before assuming duplication is dead code.

**Auth/session model on the frontend is cookie-based, not token-based in JS**: `frontend/context/AuthContext.tsx` calls `GET /auth/me` (via `frontend/lib/axios.ts`, an axios instance with `withCredentials: true` pointing at `NEXT_PUBLIC_API_URL`) on mount to hydrate the current user; there is no client-side JWT storage. `frontend/middleware.ts` does route protection at the edge purely by checking for the presence of a `token` cookie (it does not verify/decode it) — `adminOnlyRoutes` is defined there but currently unused in the redirect logic, so role-based route gating is not actually enforced by the middleware today; real authorization still relies on the backend's `RolesGuard`.

Dashboards are role-specific components (`AdminDashboard.tsx`, `MemberDashboard.tsx`, `TrainerDashboard.tsx`). `app/(main)/dashboard/page.tsx` is a server component that reads the `token` cookie directly via `next/headers`, calls the backend's `/auth/me` itself (server-side `fetch`, not `frontend/lib/axios.ts`), and picks which dashboard to render based on `user.role` — this bypasses `AuthContext`/`useAuth()` entirely, so the two auth mechanisms (server-side cookie fetch here vs. client-side `AuthContext`) coexist and should be kept in sync when changing auth logic.
