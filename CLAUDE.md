# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at localhost:4321
pnpm build        # production build to ./dist/
pnpm preview      # preview built site
pnpm type-check   # TypeScript strict check (astro check)
pnpm lint         # ESLint
pnpm test         # vitest run
```

Pre-commit: `pnpm type-check`, `pnpm lint`, and `pnpm build` must all pass.

## Architecture

Astro 6.4.8 with hybrid output — all pages statically generated except `/api/contact` (SSR). Deployed to Cloudflare Workers — the `@astrojs/cloudflare` v13 adapter targets Workers (it no longer supports Cloudflare Pages) and is required before adding any SSR or API routes. Deploy config lives in `wrangler.jsonc` (`nodejs_compat` + compatibility date); deploy via `npx wrangler deploy`. See `BUILD.md` for the full CI/deploy workflow.

### Source structure

```text
src/
  components/    # .astro components; React only for interactive islands
  data/          # Static content as named TS exports (no fetch needed)
    projects.ts    # Project entries
    jobRoles.ts    # Job role entries
    services.ts    # Services page content
                    # projects.ts and jobRoles.ts share a `featured: boolean`
                    # flag (via BaseEntry) that drives the homepage grid
  lib/           # Server-side validation (contactSchema.ts, validateContact.ts)
  utils/         # Small helpers (date.ts)
  layouts/       # Layout.astro — 40/60 grid wrapper with global styles
  pages/
    index.astro              # Lookbook home
    archive.astro            # Project index table
    services.astro           # Services page (bento service grid + tech badges)
    projects/[slug].astro    # Product detail
    api/contact.ts           # SSR contact endpoint (Resend)
  types/
    index.ts     # Shared interfaces (used in 3+ files); co-locate otherwise
  styles/
    global.css   # CSS custom properties (@theme tokens), font faces, reset
```

### Page layout pattern

Two-column split: left 40% fixed bento identity grid, right 60% scrollable surface with hard drop shadow. Product detail shares this same wrapper via `Layout.astro` — a single-column content flow in the right surface (hero, horizontal media gallery, accordions, CTA, footer nav) with the LeftPanel sticky at ≥1000px. The Archive page is a full-width dense table. The Services page reuses the right-surface wrapper for a bento service-cell grid plus a tech-badge grid.

### Data flow

Content lives in `src/data/` as typed arrays (`projects.ts`, `jobRoles.ts`, `services.ts`) — imported directly by pages, no fetching. `projects.ts` and `jobRoles.ts` share a `featured: boolean` field; `getFeaturedProjects()` / `getFeaturedJobRoles()` are what actually populate the homepage grid. The only runtime endpoint is `POST /api/contact`, which enforces same-origin, verifies Cloudflare Turnstile, validates input, then calls Resend — see `.claude/rules/security.md` for the full request flow.

## Design Guide

See detailed design and build guide in ./DESIGN.md. Design tokens themselves live in `src/styles/global.css`'s `@theme` block — that's the source of truth; don't duplicate values here.

Fonts: **Newsreader** (display/headings), **Work Sans** (body/UI), **Space Grotesk** (monospace labels). Load via Google Fonts in the Layout head.

## Key constraints not obvious from code

- Zero border radius everywhere — intentional, must not be "fixed"
- Project cards are grayscale by default, full color on hover (400ms transition)
- The Cart Drawer (contact form) is a slide-in overlay, not a page
- `RESEND_API_KEY` is server-only — never reference it in `.astro` templates (it would bundle into client JS)
- Security headers — see `.claude/rules/security.md` for the `public/_headers` static-asset caveat and the full CSP setup
- The gallery component is `MediaGallery.astro` (renamed from `ImageGallery.astro`) — it interleaves images and optional videos with captions; caption/video content isn't populated in the data yet (see `TODO.md`)
- `featured: boolean` on `BaseEntry` controls homepage grid membership for both projects and job roles — not visible from either data file alone

## Changelog

`CHANGELOG.md` in the project root is the active build log. Update it as part of every commit:

- **When:** Before running the pre-commit checklist, for any commit that changes code, styles, data, or config.
- **Format:** Add an entry under a `## YYYY-MM-DD` heading (or append to today's entry if one exists). Include: what changed, why, files touched, and the commit hash once known.
- **Skip:** `chore:` commits and dependency-only updates do not need changelog entries.
