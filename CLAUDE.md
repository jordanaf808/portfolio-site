# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at localhost:4321
pnpm build        # production build to ./dist/
pnpm preview      # preview built site
pnpm type-check   # TypeScript strict check (astro check)
pnpm lint         # ESLint — add script once ESLint is configured
```

Pre-commit: `pnpm type-check`, `pnpm lint`, and `pnpm build` must all pass. The `lint` script needs to be added to `package.json` once ESLint is configured.

## Architecture

Astro 6.3.1 with hybrid output — all pages statically generated except `/api/contact` (SSR). Deployed to Cloudflare Pages; the Cloudflare adapter is required before adding any SSR or API routes.

### Planned source structure

```text
src/
  components/    # .astro components; React only for interactive islands
  data/          # Static project data as named TS exports (no fetch needed)
  layouts/       # Layout.astro — 40/60 grid wrapper with global styles
  pages/
    index.astro              # Lookbook home
    archive.astro            # Project index table
    projects/[slug].astro    # Product detail
    api/contact.ts           # SSR contact endpoint (Resend)
  types/
    index.ts     # Shared interfaces (used in 3+ files); co-locate otherwise
  styles/
    global.css   # CSS custom properties, font faces, reset
```

### Page layout pattern

Two-column split: left 40% fixed bento identity grid, right 60% scrollable surface with hard drop shadow. Product detail uses 50/50 with sticky image gallery on the left. The Archive page is a full-width dense table.

### Data flow

Project data lives in `src/data/projects.ts` as a typed array — imported directly by pages, no fetching. The only runtime endpoint is `POST /api/contact`, which validates inputs server-side and calls Resend.

## Design Guide

See detailed design and build guide in ./DESIGN.md

## Design tokens (no CSS written yet — reference for implementation)

| Token             | Value                 |
| ----------------- | --------------------- |
| Background        | `#F4F4F0`             |
| Surface           | `#FFFFFF`             |
| Text              | `#222222`             |
| Muted             | `#888888`             |
| Accent            | `#C8B6A6`             |
| Border            | `1px solid #111111`   |
| Border radius     | `0` (zero everywhere) |
| Container padding | `48px`                |
| Bento gap         | `0px`                 |

Fonts: **Newsreader** (display/headings), **Work Sans** (body/UI), **Space Grotesk** (monospace labels). Load via Google Fonts in the Layout head.

## Key constraints not obvious from code

- Zero border radius everywhere — intentional, must not be "fixed"
- Project cards are grayscale by default, full color on hover (400ms transition)
- The Cart Drawer (contact form) is a slide-in overlay, not a page
- `RESEND_API_KEY` is server-only — never reference it in `.astro` templates (it would bundle into client JS)
- Security headers go in `public/_headers` (Cloudflare Pages static header injection)
