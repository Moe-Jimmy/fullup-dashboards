# FullUp Dashboards — Monorepo

pnpm workspace holding all FullUp dashboards + one shared Nuxt layer.

## Structure

```
packages/base   → shared Nuxt layer (layout, global components, composables, css, i18n, types)
apps/superadmin → holding company (owns the platform)
apps/admin      → country franchise (manages FullUp within one country)
apps/company    → companies subscribing to FullUp services in a country
apps/provider   → service providers in a country
```

`packages/base` is **auth-agnostic** — no login/token/role logic lives here. Each app owns its own auth + API scope.

## Setup

```bash
pnpm install          # once, at root — links base into every app
```

## Run a dashboard

```bash
pnpm dev:superadmin
pnpm dev:admin
pnpm dev:company
pnpm dev:provider
```

## Shared code rule

- Used by 2+ dashboards → put it in `packages/base`
- Used by one dashboard → put it in that app

Edit anything in `packages/base` → all dashboards get it live.
