# Zentro — Repository Structure

This repo holds the **web platform only** (frontend + backend). The mobile apps
live in a separate repo (`zentro-mobile`, Flutter).

```
zentro/
├── zentro-web/              # FRONTEND — pnpm + Turborepo
│   ├── apps/
│   │   ├── web/             # Next.js — marketing/landing + customer app
│   │   ├── partner/         # Next.js — provider portal
│   │   └── admin/           # Next.js — admin / ops console
│   └── packages/
│       ├── ui/              # design system (Tailwind + shadcn/ui + tokens)
│       ├── api-client/      # typed API client + TanStack Query + Zustand
│       ├── types/           # shared TS types (later from OpenAPI)
│       └── config/          # shared tsconfig / eslint / tailwind / prettier
│
├── zentro-api/              # BACKEND — Spring Boot 3 modular monolith (Java 21, Gradle)
│   └── src/main/java/com/zentro/
│       ├── common/          identity/   catalog/    provider/
│       ├── verification/    discovery/  matching/   booking/
│       ├── payment/         chat/       review/     notification/
│       └── ai/              admin/
│
├── infra/                   # docker-compose (local), Terraform (later)
├── docs/                    # specs (workflow / requirements / implementation)
├── .github/workflows/       # CI (web + api)
├── docker-compose.yml       # local dev: Postgres+PostGIS + Redis
└── PROJECT_STRUCTURE.md
```

## Tech stack

**Frontend:** Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui ·
TanStack Query · Zustand · pnpm + Turborepo.

**Backend:** Java 21 · Spring Boot 3.3 · Spring Security · Spring Data JPA ·
PostgreSQL + PostGIS · Flyway · Redis · Spring Modulith · Gradle (Kotlin DSL).

## Branch workflow

`akarsh` / `aman` → `dev` → `prod` → `main`. Never commit to `main`/`prod`.
See `ZENTRO_DEVELOPMENT_GUIDE/development_guide.md`.

## Bring-up

```bash
# Backend dependencies
docker compose up -d

# Frontend
cd zentro-web && corepack enable && pnpm install && pnpm dev

# Backend (needs JDK 21)
cd zentro-api && gradle wrapper && ./gradlew bootRun
```
