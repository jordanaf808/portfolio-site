# Build & Deploy

## CI — Quality Gate (GitHub Actions)

**Workflow:** `.github/workflows/ci.yml`
**Triggers:** push to `main`, all pull requests

Steps run in order:

```
pnpm install --frozen-lockfile
pnpm type-check   # astro check — zero TypeScript errors required
pnpm lint         # ESLint across src/
pnpm test         # Vitest unit tests
pnpm build        # full Astro production build
```

`RESEND_API_KEY` is set to a dummy value in CI so the Astro build completes without real secrets — no email is sent. `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set to Cloudflare's published "always pass" test keys — `PUBLIC_TURNSTILE_SITE_KEY` is required at build time because it's inlined into the client bundle (`context: 'client'` in `astro.config.mjs`), not just read at runtime. A failing step blocks merge and acts as the deploy gate.

---

## Deployment

Both options deploy to Cloudflare Workers using `wrangler.jsonc` for config.

**Sharp binary, either path:** production builds use `imageService: 'compile'` (build-time Sharp) per `astro.config.mjs`. `pnpm-lock.yaml` records every `@img/sharp-*` platform variant (darwin and linux), so `pnpm install` resolves the correct one for whichever OS actually runs `pnpm build` — Workers Builds' Linux CI or a local Mac. No manual pinning needed for either option.

### Option A — Workers Builds (recommended)

Connect the repo in the Cloudflare dashboard: **Workers → your worker → Builds → Connect GitHub**. Auto-deploys on push to `main`. Uses the `wrangler.jsonc` build config — there is no "output directory" like Pages; Wrangler handles the asset upload.

### Option B — Manual

```bash
npx wrangler deploy
```

Requires either a `wrangler login` session or a `CLOUDFLARE_API_TOKEN` environment variable. Run after a clean local build.

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `RESEND_API_KEY` | `.env.local` (dev) / `.dev.vars` (preview) / Workers secret (prod) | Resend email API for `/api/contact` |
| `PUBLIC_TURNSTILE_SITE_KEY` | `.env.local` (dev) / `.dev.vars` (preview) / Workers secret (prod) | Public Turnstile widget key, rendered client-side in `CartDrawer.tsx`; inlined at build time |
| `TURNSTILE_SECRET_KEY` | `.env.local` (dev) / `.dev.vars` (preview) / Workers secret (prod) | Server-only Turnstile secret for the `siteverify` call in `/api/contact` |
| `CLOUDFLARE_API_TOKEN` | Local shell env or GitHub secret | Wrangler auth for manual deploy |

**Important:** `pnpm preview` runs the Cloudflare workerd runtime and reads secrets from `.dev.vars`, not `.env.local`. If `/api/contact` returns 500 in preview, check `.dev.vars` first.

---

## Local Dev Commands

```bash
pnpm dev          # dev server at localhost:4321
pnpm build        # production build to ./dist/
pnpm preview      # preview with workerd runtime (needs .dev.vars for secrets)
pnpm type-check   # zero-error TypeScript check
pnpm lint         # ESLint across src/
pnpm test         # Vitest unit tests (run once)
pnpm test:watch   # Vitest in watch mode
```
