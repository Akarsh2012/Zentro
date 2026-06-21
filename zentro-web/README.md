# zentro-web

Frontend monorepo for the Zentro web platform — built with **pnpm + Turborepo**.

## Surfaces (`apps/`)

| App | Domain (planned) | Purpose |
|-----|------------------|---------|
| `web` | `zentro.com` | Marketing/landing **+** customer app |
| `partner` | `partner.zentro.com` | Provider portal (onboarding, leads, earnings) |
| `admin` | `admin.zentro.com` | Admin / ops console (isolated origin) |

## Shared (`packages/`)

| Package | Purpose |
|---------|---------|
| `@zentro/ui` | Design system: Tailwind preset + tokens + shadcn/ui |
| `@zentro/api-client` | Typed client for `zentro-api` + TanStack Query + Zustand |
| `@zentro/types` | Shared TS types (later generated from OpenAPI) |
| `@zentro/config` | Shared tsconfig / eslint / tailwind / prettier |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query · Zustand.

## Getting started

```bash
corepack enable           # makes pnpm available (Node ships with corepack)
pnpm install
pnpm dev                  # runs all apps via turbo
```

> Apps under `apps/*` are scaffolded with `pnpm create next-app` — starting with `apps/web`.
