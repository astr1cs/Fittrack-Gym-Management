# FitTrack — Gym Management System

A full-stack gym management platform built with **NestJS** (backend) and **Next.js** (frontend). FitTrack enables gym administrators to manage members, trainers, classes, memberships, and announcements, while providing role-specific dashboards for admins, trainers, and members.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Realtime Notifications](#realtime-notifications)
- [User Roles](#user-roles)
- [Running Tests](#running-tests)
- [License](#license)

---

## Overview

FitTrack is a monorepo containing two independent projects:

| Project | Directory | Port | Description |
|---------|-----------|------|-------------|
| Backend | `backend/` | 3001 | NestJS REST API with PostgreSQL |
| Frontend | `frontend/` | 3000 | Next.js App Router client |

There is no root-level `package.json` — each project manages its own dependencies. Run all commands from inside the respective subdirectory.

---

## Tech Stack

### Backend
- **NestJS** — modular Node.js framework
- **TypeORM** — ORM with `synchronize: true` for schema management in dev
- **PostgreSQL 16** — primary database (Docker Compose provided)
- **JWT** — authentication via httpOnly cookies
- **Pusher** — realtime server-side event publishing
- **Vitest** — unit and e2e testing

### Frontend
- **Next.js 15+** (App Router) — SSR + client components
- **React 19**
- **Tailwind CSS v4**
- **Axios** — all HTTP calls (never native `fetch`)
- **Pusher JS** — realtime subscription on the client
- **TypeScript**

---

## Repository Structure

```
Fittrack-Gym-Management/
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── app.module.ts     # Root module, TypeORM config, CORS
│   │   ├── auth/             # JWT auth, guards, roles
│   │   ├── members/          # Member CRUD
│   │   ├── trainers/         # Trainer CRUD
│   │   ├── memberships/      # Membership plans
│   │   ├── classes/          # Gym classes
│   │   ├── enrollments/      # Class enrollments
│   │   ├── announcements/    # Admin announcements
│   │   ├── notifications/    # Per-user notifications
│   │   ├── pusher/           # Realtime push service
│   │   └── entities/         # All TypeORM entities (central)
│   ├── docker-compose.yml    # PostgreSQL container
│   ├── .env.example
│   └── package.json
│
└── frontend/                 # Next.js client
    ├── app/
    │   ├── (main)/           # Authenticated app shell
    │   │   ├── dashboard/    # Role-based dashboard
    │   │   ├── members/      # Member management pages
    │   │   ├── trainers/     # Trainer management pages
    │   │   ├── classes/      # Class management pages
    │   │   ├── memberships/  # Membership pages
    │   │   ├── announcements/
    │   │   └── notifications/
    │   └── auth/             # Login & Register pages
    ├── components/           # Shared UI components
    ├── context/
    │   ├── AuthContext.tsx   # Current user state
    │   └── NotificationContext.tsx  # Unread badge + Pusher
    ├── lib/
    │   ├── axios.ts          # Client-side axios instance
    │   └── serverApi.ts      # Server-side axios (cookie forwarding)
    ├── middleware.ts          # Edge route protection
    └── package.json
```

---

## Features

### Admin
- Full CRUD for members, trainers, membership plans, and gym classes
- Publish announcements broadcast to all users in realtime
- View and manage all enrollments

### Trainers
- View assigned classes and their enrolled members
- Receive realtime notifications on their dedicated Pusher channel

### Members
- Browse and enroll in available gym classes
- View active membership plans and history
- Receive announcements and personal notifications
- Track class enrollment status

### Shared
- Role-based dashboards with relevant statistics
- Realtime unread notification badge (shared via React Context)
- Cookie-based session — no localStorage token handling

---

## Architecture

### Backend: Module-per-domain

Each feature is a NestJS module: `auth`, `members`, `trainers`, `memberships`, `classes`, `enrollments`, `announcements`, `notifications`, and `pusher` (shared service). All TypeORM entities live centrally in `backend/src/entities/`.

**Domain model relationships:**
- `User` has a role (`admin` | `member` | `trainer`) and an optional 1:1 `Member` or `Trainer` profile
- `Member` → many `MemberMembership` rows (linked to `MembershipPlan`) + many `Enrollment` rows (linked to `Class`)

### Frontend: Next.js App Router with Route Groups

- `(main)/` — authenticated shell with shared layout, `AuthProvider`, `NotificationProvider`
- `auth/` — public login/register pages
- Server components use `createServerApi(token)` (cookie forwarded manually); client components use the shared `api` axios instance with `withCredentials: true`

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for local PostgreSQL)
- A [Pusher](https://pusher.com) account (free tier works)

### Backend Setup

```bash
cd backend

# Start PostgreSQL via Docker
docker-compose up -d

# Copy and fill in environment variables
cp .env.example .env
# Edit .env — set JWT_SECRET and Pusher credentials

# Install dependencies
npm install

# Start in development (watch) mode
npm run start:dev
```

The API will be available at `http://localhost:3001`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local   # or create manually (see below)

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host (default: `localhost`) |
| `DB_PORT` | PostgreSQL port (default: `5432`) |
| `DB_NAME` | Database name (default: `fittrack`) |
| `DB_USER` | Database user (default: `postgres`) |
| `DB_PASS` | Database password |
| `JWT_SECRET` | Secret key for signing JWTs |
| `PUSHER_APP_ID` | Pusher app ID |
| `PUSHER_KEY` | Pusher key |
| `PUSHER_SECRET` | Pusher secret |
| `PUSHER_CLUSTER` | Pusher cluster (e.g. `ap1`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL for client-side calls (e.g. `http://localhost:3001`) |
| `API_URL` | Backend URL for server-side calls (same in local dev) |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher public key |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher cluster |

---

## API Overview

All routes are prefixed relative to `http://localhost:3001`.

| Domain | Base Path | Auth Required | Admin Only |
|--------|-----------|--------------|------------|
| Auth | `/auth` | Varies | No |
| Members | `/members` | Yes | Yes (write) |
| Trainers | `/trainers` | Yes | Yes (write) |
| Membership Plans | `/memberships` | Yes | Yes (write) |
| Classes | `/classes` | Yes | Partially |
| Enrollments | `/enrollments` | Yes | No |
| Announcements | `/announcements` | Yes | Yes (create) |
| Notifications | `/notifications` | Yes | No |

### Auth Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive httpOnly cookie |
| `POST` | `/auth/logout` | Clear auth cookie |
| `GET` | `/auth/me` | Get current authenticated user |

---

## Authentication

Authentication uses **JWT stored in an httpOnly cookie** (`token`). The backend sets this cookie on login/register and reads it in `JwtStrategy` via `req.cookies.token`.

- Protected routes use `@UseGuards(JwtAuthGuard, RolesGuard)` with `@Roles(UserRole.ADMIN)` where needed
- The frontend checks for the cookie's presence in `middleware.ts` for client-side route protection; actual authorization is enforced server-side by `RolesGuard`
- `AuthContext` hydrates the current user by calling `GET /auth/me` on mount

**Important:** always use `axios` with `withCredentials: true` on the frontend — never `fetch` — to ensure cookies are sent cross-origin.

---

## Realtime Notifications

FitTrack uses **Pusher** for realtime events:

- `PusherService` (backend) publishes events when announcements are created or notifications are sent
- The frontend subscribes to the `announcements` channel and the per-trainer `trainer-{id}` channel via `NotificationContext`
- `NotificationContext` owns the shared `unreadCount` state and `refreshUnreadCount()` — the navbar badge reads from context rather than maintaining its own state, preventing badge drift

---

## User Roles

| Role | Access Level |
|------|-------------|
| `admin` | Full access to all management features |
| `trainer` | View assigned classes, receive notifications |
| `member` | Enroll in classes, view memberships, view announcements |

Role is set at registration and stored on the `User` entity. Each role sees a dedicated dashboard component (`AdminDashboard`, `TrainerDashboard`, `MemberDashboard`) selected server-side in `app/(main)/dashboard/page.tsx`.

---

## Running Tests

### Backend

```bash
cd backend

# Unit tests
npm test

# Unit tests in watch mode
npm run test:watch

# Coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e

# Single file
npx vitest run src/auth/auth.service.spec.ts

# Single test by name
npx vitest run -t "should return a user"
```

### Frontend

```bash
cd frontend

# ESLint
npm run lint

# Production build check
npm run build
```

---

## License

This project is for educational and portfolio purposes.
