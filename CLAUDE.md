# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow Rules

- **Do NOT edit, create, or delete any files without explicit user permission.** Always present proposed changes for review first and wait for approval before applying them.

## Project Overview

FullUp Dashboards — a pnpm-workspace **monorepo** holding every FullUp dashboard plus one shared Nuxt layer. Bilingual (Arabic default/RTL, English/LTR). Built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, @nuxt/ui 4.

The dashboards (all extend the shared `@fullup/base` layer):

- **superadmin** — the holding company that owns the FullUp platform
- **admin** — a per-country franchise managing FullUp within one country/region
- **company** — a business subscribing to FullUp services within a country
- **provider** — a service provider serving FullUp within a country

## Structure

```
packages/base   → shared Nuxt layer (layout, global components, svg, composables,
                  utils, css theme, i18n, sidebar types). AUTH-AGNOSTIC.
apps/superadmin → holding company        (extends @fullup/base)
apps/admin      → country franchise      (extends @fullup/base)
apps/company    → subscriber             (extends @fullup/base)
apps/provider   → service provider       (extends @fullup/base)
```

**Shared-code rule:** used by 2+ dashboards → `packages/base`. Used by one → that app.

**Base is auth-agnostic** — no login/token/role logic in `packages/base`. Each app owns its own auth (middleware, `runtimeConfig.public.apiBase`).

## Commands

Requires **pnpm** (`npm i -g pnpm`). Run from the repo root.

```bash
pnpm install            # once — links base into every app, runs nuxt prepare
pnpm dev:superadmin     # run one dashboard (also: dev:admin, dev:company, dev:provider)
pnpm build:superadmin   # production build one dashboard
pnpm lint               # eslint
pnpm --filter @fullup/superadmin exec nuxt prepare   # regenerate one app's .nuxt types
```

## Architecture

### Stack

- **Nuxt 4** with Vue 3 Composition API (`<script setup lang="ts">`), Nuxt Layers for sharing
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **@nuxt/ui 4** (UDashboardGroup/Sidebar/Panel/Navbar, UButton, UIcon, etc.)
- **@nuxtjs/i18n** — ar (default, RTL) / en (LTR), strategy `prefix_except_default`
- **@nuxtjs/color-mode** — `.dark` class toggling

### How layers work

Each app's `nuxt.config.ts` has `extends: ["@fullup/base"]`. Nuxt auto-merges the layer's `components/`, `layouts/`, `composables/`, `utils/`, `assets/`, `i18n/`, and `nuxt.config`. An app can override any of these by defining a same-named file — the app layer wins.

### Per-dashboard sidebar

`LayoutDashboardSidebar` (in base) is a generic shell (collapse, tooltips, logo, profile footer, scroll styling). The **menu data is per-app**: each app defines `app/composables/useDashboardNav.ts` which overrides the empty base version. Use the shared `useSidebarLink()` helper; labels resolve from the i18n namespace `dashboard.sidebar.items.*`.

### TypeScript Interfaces

- All `interface` definitions live in `shared/types/`, grouped by module in one file per module (e.g. `branchs.ts`). Do not declare interfaces inline in components/pages/composables.
- **Shared types** live in `packages/base/shared/types/` and are exposed to apps via the package export `@fullup/base/types` (because `#shared` does NOT merge across layers). Base's own files import these by relative path.
- **App-specific types** live in that app's `shared/types/` and are imported via `#shared/types/...` within the app.

### Theming System

Colors are CSS custom properties in `packages/base/app/assets/css/main.css` with light/dark variants, mapped via `@theme inline`. Semantic tokens:

- Backgrounds: `bg-bg-screen`, `bg-bg-pages`, `bg-surface-dark`
- Text: `text-t-white`, `text-t-sec`, `text-t-brand`, `text-t-primary-gray`
- Brand: `bg-primary` (#f2562d), `text-t-brand`
- Custom buttons: `.primary-btn`, `.outline-btn`

### i18n Conventions

- `useI18n()` + `$t('key')`; `useLocalePath()` / `<NuxtLinkLocale>` for locale-aware paths
- Default locale Arabic (RTL); English routes prefixed `/en/`
- Shared/common keys live in base i18n; app-specific keys in the app's `i18n/locales/` (layers merge by locale code)

### Icons

Icons are bundled locally (offline) via per-collection `@iconify-json/*` packages in base: `lucide`, `heroicons`, `codicon`, `lets-icons`, `logos`, `bi`, `arcticons`, `skill-icons`. Prefer these existing sets before adding a new one. Tree-shaken to only used icons.

## Monorepo Gotchas (all currently solved — keep these in mind)

- **Tailwind 4 + symlinked layer:** base is a workspace symlink → Tailwind skips it like node_modules. `main.css` has `@source "../../**/*.{vue,js,ts}"` so shared components' classes aren't purged. Removing it makes shared components render unstyled/invisible.
- **`#shared` does not cross layers:** share types via the `@fullup/base/types` package export, not `#shared`.
- **pnpm + Nuxt:** root `.npmrc` has `shamefully-hoist=true` to resolve Nuxt's transitive imports (`@tanstack/vue-table`, `@internationalized/date`, etc.). Don't remove it.
- **Base has no standalone `.nuxt/`:** editing files in `packages/base` shows IDE errors like "Cannot find name `ref`/`computed`/`useI18n`" and unresolved auto-imports. This is expected — they resolve when compiled inside an app. Base `tsconfig.json` must NOT `extends "./.nuxt/tsconfig.json"`.
- **Sidebar collapse:** `UDashboardGroup` has `:persistent="false"` so collapse state is never restored from storage — the sidebar always mounts expanded (avoids reload-while-collapsed hydration mismatch). Collapse is controlled via `v-model:collapsed` on `UDashboardSidebar`.

## Nuxt UI Reference

This project uses **Nuxt UI v4**.

- Full docs: https://ui.nuxt.com/llms-full.txt
- Component doc pattern: `https://ui.nuxt.com/raw/docs/components/{component-name}.md`
- Composable doc pattern: `https://ui.nuxt.com/raw/docs/composables/{composable-name}.md`

Components are customized via the `:ui` prop (Tailwind Variants API). When working with a Nuxt UI component, fetch its doc from the URL pattern above for full props/slots/events.
