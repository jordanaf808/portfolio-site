# Jordan A.F. — Portfolio Site

A premium, e-commerce-inspired developer portfolio. Projects and job roles are browsed like a lookbook, and the contact flow is a slide-in Cart Drawer ("checkout") instead of a typical contact page.

**Live:** [jordanaf.com](https://jordanaf.com)

## Stack

- [Astro 6](https://astro.build) — hybrid output, static by default
- React 19 — interactive islands only (Cart Drawer / contact form)
- Tailwind CSS v4
- Cloudflare Workers (`@astrojs/cloudflare` adapter) — the only SSR route is `/api/contact`
- [Resend](https://resend.com) — transactional email for contact form submissions
- Cloudflare Turnstile — bot protection on the contact form
- Zod — server-side input validation
- Vitest + ESLint

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in RESEND_API_KEY + Turnstile keys
pnpm dev                     # localhost:4321
```

Requires Node ≥22.12.0.

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `pnpm dev`        | Start the dev server                    |
| `pnpm build`      | Production build to `./dist/`           |
| `pnpm preview`    | Preview the build locally               |
| `pnpm type-check` | Strict TypeScript check (`astro check`) |
| `pnpm lint`       | ESLint                                  |
| `pnpm test`       | Run the Vitest suite once               |
| `pnpm test:watch` | Vitest in watch mode                    |

## Deployment

Deploys to Cloudflare Workers — the `@astrojs/cloudflare` v13 adapter no longer targets Pages. Deploy config lives in `wrangler.jsonc`; ship with `npx wrangler deploy`. Full CI/deploy notes live in [BUILD.md](./BUILD.md).

## Project docs

| Doc                            | What's in it                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| [CLAUDE.md](./CLAUDE.md)       | Architecture, source layout, and constraints — written for AI coding agents, also a good orientation for humans |
| [DESIGN.md](./DESIGN.md)       | Full design system: tokens, typography, screen-by-screen specs                                                  |
| [BUILD.md](./BUILD.md)         | CI and deploy workflow                                                                                          |
| [CHANGELOG.md](./CHANGELOG.md) | Build log — what changed, why, per commit                                                                       |
| [TODO.md](./TODO.md)           | Current punch list                                                                                              |
