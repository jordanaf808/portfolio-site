# The Commerce Boutique — Build Log

**Date:** 2026-05-11  
**Branch:** `feat/portfolio-site`  
**Status:** Foundation complete — ready for content and visual QA

---

## Overview

Full build of a luxury e-commerce-themed portfolio site on top of a minimal Astro 6 scaffold. The design concept treats the developer's work as premium goods in an editorial digital lookbook, drawing aesthetic inspiration from brands like SSENSE and AIM Léon Dore.

---

## Key Design Decisions (confirmed during planning)

| Decision              | Choice                                      | Rationale                                                                                       |
| --------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| CSS framework         | Tailwind CSS v4 (`@tailwindcss/vite`)       | Matched the HTML mockups exactly; faster iteration                                              |
| Font stack            | Newsreader + Work Sans + Space Grotesk      | Specified in HTML mockups and CLAUDE.md; Google Fonts, no self-hosting needed                   |
| Homepage (`/`)        | Lookbook — editorial project feed           | CLAUDE.md routing spec                                                                          |
| Contact UX            | Cart drawer only (slide-in overlay)         | No separate `/contact` page; matches e-commerce metaphor                                        |
| SSR                   | `/api/contact` only; all other pages static | Cloudflare adapter required for hybrid static + SSR                                             |
| React islands         | CartDrawer only                             | Drawer needs `useState`; everything else is CSS-only or vanilla JS                              |
| Contact form triggers | Custom DOM events (`open-cart-drawer`)      | Allows multiple trigger points (TopNav, LeftPanel, project detail) without shared state library |

---

## Architecture

```
Layout split:
  Lookbook + Archive  →  40% fixed LeftPanel (bento nav) | 60% scrollable right panel
  Project Detail      →  50% sticky ImageGallery         | 50% scrollable right panel

Data flow:
  src/data/projects.ts  →  imported directly by pages (no fetch)
  /api/contact          →  SSR endpoint, validates with src/lib/validateContact.ts, calls Resend

Interactivity:
  CartDrawer.tsx        →  React island (client:load), listens for 'open-cart-drawer' CustomEvent
  ImageGallery.astro    →  Vanilla JS (is:inline script with define:vars)
  Accordion.astro       →  CSS-only using native <details>/<summary>
  LeftPanel.astro       →  Vanilla JS inline script dispatches 'open-cart-drawer' event
```

---

## Work Performed

### Task 1 — Dependencies + Astro Configuration

**Packages installed:**

- Runtime: `@tailwindcss/vite`, `@astrojs/cloudflare`, `@astrojs/react`, `react`, `react-dom`, `resend`, `tailwindcss`
- Dev: `@types/react`, `@types/react-dom`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `eslint`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint-plugin-astro`

**Config changes:**

- `astro.config.mjs` — added Cloudflare adapter, React integration, Tailwind vite plugin. Removed `output: 'hybrid'` (removed in Astro 6; `output: 'static'` is now the default with hybrid behavior built in via `prerender = false` on individual routes)
- `package.json` — added `test`, `test:watch`, and `lint` scripts; added `pnpm.onlyBuiltDependencies` for `esbuild` and `workerd` (needed to allow their postinstall scripts under pnpm's strict build script policy)
- `tsconfig.json` — added `@/` import alias (`@/*` → `./src/*`) per project code-style rules
- `vitest.config.ts` — created with `jsdom` environment for React component testing
- `eslint.config.js` — ESLint 9+ flat config with `@typescript-eslint` + `eslint-plugin-astro`

**Issues resolved:**

- `pnpm approve-builds` is interactive and can't be automated; used `pnpm.onlyBuiltDependencies` in `package.json` instead
- `output: 'hybrid'` config option was removed in Astro 6 — dropped it (static is the default)
- `tailwindcss` package itself must be installed separately from `@tailwindcss/vite`; the vite plugin is a build-time adapter but the CSS runtime (`@import "tailwindcss"`) needs the main package resolvable at build time

---

### Task 2 — Design Tokens + Global CSS

**File created:** `src/styles/global.css`

Tailwind v4 uses `@import "tailwindcss"` + `@theme {}` blocks (not `tailwind.config.js`). All design tokens live here:

- **Colors:** `primary` (#111111), `background` (#F4F4F0), `surface` (#FFFFFF), `text` (#222222), `muted` (#888888), `accent-taupe` (#C8B6A6), `surface-container-high` (#EFEFEB), `surface-container-low` (#F9F9F7)
- **Fonts:** `display` (Newsreader), `body` (Work Sans), `mono` (Space Grotesk)
- **Border radius:** All set to `0` — zero radius is an intentional design constraint, not an oversight
- **Base layer:** Full reset, `overflow: hidden` on `html`/`body` (required for the fixed-panel layout), custom 4px scrollbar
- **Utility classes:** `.grayscale-hover` (400ms transition), `.hard-shadow`, `.hard-shadow-canvas` (8px offset, no blur), `.font-display`/`.font-body`/`.font-mono`

---

### Task 3 — Types + Project Data

**Files created:** `src/types/index.ts`, `src/data/projects.ts`

`Project` interface covers all fields used across pages: slug, title, subtitle, client, year, category, tech stack, status, long-form copy (description/challenge/architecture/results), images array, featured flag, optional external link.

`ContactFormData` interface enforces the budget union type (`'$10k–$25k' | '$25k–$50k' | '$50k+'`) so the API endpoint and CartDrawer stay in sync.

Five seed projects created:

1. **L'Avenir Haute** — Shopify Plus, featured
2. **Chronos Identity** — Hydrogen, featured
3. **Maison Studio** — Custom App, featured
4. **Vault Archive** — Shopify Plus, not featured (archive only)
5. **Neo-Brutalist UI** — Open Source, not featured (archive only)

Helper exports: `getProjectBySlug(slug)`, `getFeaturedProjects()`.

---

### Task 4 — Layout System

**Files created:** `src/layouts/Layout.astro`, `src/components/TopNav.astro`, `src/components/LeftPanel.astro`, `src/components/CartDrawer.tsx` (stub)

**Layout.astro** — Root HTML shell used by Lookbook and Archive pages:

- Google Fonts `<link>` (preconnect + stylesheet)
- `body` is `flex h-screen overflow-hidden` — this is what prevents the page from scrolling; only the right panel's `<main>` scrolls
- `ml-[40%] w-[60%]` right panel with `hard-shadow-canvas` (left-edge shadow creates visual separation)
- CartDrawer React island mounted at body level with `client:load`
- Inline `<script>` wires the TopNav "Hire Us" button to dispatch `open-cart-drawer` event

**LeftPanel.astro** — Fixed 40% sidebar:

- Brand header with tagline + display name
- 2×2 CSS Grid bento nav (Portfolio, Archive, Services, Contact/Start a Project)
- Active state via `activePage` prop — highlights current section
- Bio paragraph + tech tag pills
- Availability status footer with green dot
- Inline `<script>` dispatches `open-cart-drawer` event when "Start a Project" is clicked

**TopNav.astro** — Sticky top bar on the right panel:

- Brand name (links to `/`)
- Studio + Archive links
- "Hire Us" button (trigger for cart drawer via event in Layout.astro)

A stub `CartDrawer.tsx` (`export default function CartDrawer() { return null; }`) was created at this step so Layout.astro could type-check before Task 8 implemented the real component.

**TypeScript note:** `@/` path aliases added to `tsconfig.json` per code-style rules. Relative imports are used in `.astro` files (conventional for Astro), while the alias is available for `.ts`/`.tsx` files.

---

### Task 5 — Lookbook Homepage

**Files modified:** `src/pages/index.astro`  
**Files created:** `src/components/ProjectCard.astro`

**ProjectCard.astro** — Full-width card component:

- `aspect-[16/10]` image with `grayscale-hover` utility (400ms desaturation → full color)
- `bg-surface-container-high` background shows while images are absent
- `onerror="this.style.opacity='0'"` hides broken image icons without JS
- Category badge (top-left, absolute) showing `001 / SHOPIFY PLUS` format
- "View Case Study →" overlay — `opacity-0 group-hover:opacity-100` with `bg-primary/10` tint
- Card footer with title (Newsreader), subtitle (Space Grotesk mono), status and year (right-aligned)

**index.astro** — Section header ("Selected Work / 2023–2024" + italic "Digital Flagships"), project feed from `getFeaturedProjects()`, footer with year.

---

### Task 6 — Archive Page

**File created:** `src/pages/archive.astro`

Dense table layout — Year | Project | Client | Tech | Link — sorted by year descending (`[...projects].sort((a, b) => b.year - a.year)`).

Row hover uses `hover:bg-accent-taupe/20` (Tailwind v4 opacity modifier syntax). Entire row is clickable via `onclick` attribute. Tech column shows first 3 tags with muted bordered pills. Client and Tech columns are hidden on narrow viewports.

**Issue resolved:** Inline `onclick="event.stopPropagation()"` on the `<a>` tag caused a TypeScript hint (`'event' is deprecated` — ts6385). Removed it since the link and row navigate to the same URL, making stopPropagation redundant.

---

### Task 7 — Project Detail Page

**Files created:** `src/components/Accordion.astro`, `src/components/ImageGallery.astro`, `src/pages/projects/[slug].astro`

**Accordion.astro** — Pure CSS using native `<details>`/`<summary>`:

- `group-open:rotate-45` on the `+` icon (CSS transforms on group state)
- No JavaScript — browser handles open/close natively
- `hover:bg-surface-container-low` on summary for subtle feedback

**ImageGallery.astro** — Sticky image panel for the left half of project detail:

- `sticky top-0 h-[calc(100vh-3rem)]` — fills viewport minus the TopNav height
- Multiple images stack as `absolute inset-0` with opacity toggling
- Counter badge updates via vanilla JS (`is:inline define:vars={{ total }}`)
- Prev/Next buttons cycle with modulo wrapping

**[slug].astro** — Standalone HTML shell (doesn't use Layout.astro) because the split is 50/50 instead of 40/60:

- `getStaticPaths()` generates all 5 project routes at build time
- Redirects to `/archive` on unknown slugs
- Technical architecture table built from `project.tech` array
- "Add to Cart — Hire Me" button dispatches `open-cart-drawer` event
- Gallery grid renders only when `project.images.length > 1`
- CartDrawer included here too (separate from Layout.astro)

**Issue resolved:** `<script define:vars={{ total }}>` triggers Astro hint 4000 (implicit `is:inline` behavior). Fixed by explicitly adding `is:inline` attribute.

**Import paths:** File at `src/pages/projects/[slug].astro` → imports from `../../` (not `../../../`) to reach `src/`.

---

### Task 8 — CartDrawer + Contact API

**Files created:** `src/lib/validateContact.ts`, `src/lib/validateContact.test.ts`, `src/pages/api/contact.ts`  
**File replaced:** `src/components/CartDrawer.tsx` (stub → full implementation)

**validateContact.ts** — Shared validation function:

- Accepts `unknown` body (safe for API route use)
- Returns discriminated union `{ valid: true; data: ContactFormData } | { valid: false; error: string }`
- Validates: company (min 2 chars), email (contains `@`), details (min 10 chars), budget (enum check)
- Sanitizes: trims company/details, lowercases email

**validateContact.test.ts** — 8 Vitest tests covering all rejection paths and the trimming/normalisation behaviour. All pass.

**contact.ts** — SSR API route:

- `export const prerender = false` opts this route into SSR while all pages stay static
- Parses JSON body with try/catch (returns 400 on parse failure)
- Returns 422 on validation failure, 500 on Resend error, 200 on success
- All responses set `Content-Type: application/json` explicitly

**CartDrawer.tsx** — React island replacing the stub:

- `useEffect` registers/cleans up the `open-cart-drawer` CustomEvent listener
- Controlled form with `ContactFormData` state, typed `handleChange`
- `handleSubmit` is `async function handleSubmit(): Promise<void>` — `preventDefault()` called inline in the JSX `onSubmit` handler to avoid deprecated `React.FormEvent` type (deprecated in React 19 regardless of type parameter)
- Three UI states: `idle`/`loading`/`error` (form visible), `success` (confirmation message)
- Inline `style` for font families (ensures fonts render correctly inside the React island where Tailwind's `font-display` utility may not cascade)
- Backdrop div closes drawer on click; `aria-modal`/`role="dialog"` for accessibility

**Issues resolved:**

- `React.FormEvent` (and `React.FormEvent<HTMLFormElement>`) deprecated in React 19. Solution: moved `e.preventDefault()` to the JSX `onSubmit` handler and changed `handleSubmit` to take no arguments.

---

### Task 9 — Security Headers + Final Polish

**Files created:** `public/_headers`, `.env.example`

`public/_headers` is the Cloudflare Pages static header injection file:

- `X-Frame-Options: DENY` — clickjacking protection
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-XSS-Protection: 1; mode=block`
- `/api/*` scoped `Access-Control-Allow-Origin`

`.env.example` documents the single required env var (`RESEND_API_KEY`).

Placeholder `.gitkeep` files added to each `public/projects/<slug>/` directory so the folder structure is committed without actual images.

---

## Complete File Inventory

### Created

```
src/
  types/index.ts
  data/projects.ts
  lib/validateContact.ts
  lib/validateContact.test.ts
  styles/global.css
  layouts/Layout.astro
  components/
    TopNav.astro
    LeftPanel.astro
    ProjectCard.astro
    Accordion.astro
    ImageGallery.astro
    CartDrawer.tsx
  pages/
    index.astro          (replaced boilerplate)
    archive.astro
    projects/[slug].astro
    api/contact.ts
public/
  _headers
  projects/
    lavenir-haute/.gitkeep
    chronos-identity/.gitkeep
    maison-studio/.gitkeep
    vault-archive/.gitkeep
    neo-brutalist-ui/.gitkeep
.env.example
vitest.config.ts
eslint.config.js
```

### Modified

```
astro.config.mjs    — added adapter, integrations, vite plugin; removed hybrid output
package.json        — added scripts (test, lint), pnpm.onlyBuiltDependencies, new deps
pnpm-lock.yaml      — updated lockfile
tsconfig.json       — added @/ path aliases
```

---

## Verification Results

```
pnpm type-check   →  0 errors, 0 warnings, 0 hints  (19 files checked)
pnpm lint         →  0 issues
pnpm test         →  8/8 tests pass
pnpm build        →  Complete — 7 static routes generated:
                       /
                       /archive
                       /projects/lavenir-haute
                       /projects/chronos-identity
                       /projects/maison-studio
                       /projects/vault-archive
                       /projects/neo-brutalist-ui
                     + 1 SSR route: /api/contact
```

---

## Remaining Work

### Required before shipping

1. **Project images** — add real screenshots to `public/projects/<slug>/01.jpg`, `02.jpg` etc. The gray `#EFEFEB` placeholder shows when images are absent; `onerror` silently hides broken `<img>` tags.
2. **RESEND_API_KEY** — create `.env` locally for dev testing; set in Cloudflare Pages → Settings → Environment Variables for production.
3. **Visual QA in browser** — run `pnpm dev` and verify:
   - Lookbook: cards, grayscale → colour hover, "View Case Study" overlay
   - Archive: table row hover (taupe), row click navigation
   - Project detail: image gallery ← → arrows, accordion open/close, "Add to Cart" opens drawer
   - Cart drawer: slides in from right, form validation, "Close ✕" and backdrop dismiss, success state
   - Zero border radius everywhere; 1px borders with no gaps or doubles
4. **Real project content** — update `src/data/projects.ts` with actual project names, descriptions, and real image paths.

### Nice to have (not in scope of this build)

- **Sending email from a verified domain** — Resend requires a verified sender domain; update the `from` address in `contact.ts` once DNS is set up
- **Security headers audit** — test with [securityheaders.com](https://securityheaders.com) post-deployment
- **`from` email address** — currently hardcoded to `inquiries@thecommerceboutique.com`; update once domain is owned/verified
- **Services section** (`/#services`) — the LeftPanel nav links to this anchor but no content exists yet
- **Favicon** — the boilerplate `favicon.svg` / `favicon.ico` are still the Astro defaults
<!-- - **horizontal scrolling effect** - it would be cool to have the Selected Work slider scroll horizontally maybe.
- **page transitions** - when clicking a link on the left, have the new content slide in from the right into the main column. -->

---

## Commit History

```
4bebf47  content: add project image placeholder directories
a1ff022  feat: add Cloudflare security headers and env example
126755c  feat: add CartDrawer React island, /api/contact endpoint, and validation
a95577f  feat: add Project Detail page with image gallery and accordion
2add047  feat: add Archive page with project table
5381097  feat: add Lookbook homepage with ProjectCard component
55dc7c2  feat: add Layout, LeftPanel, TopNav with 40/60 split
7e08663  feat: add Project types and seed project data
21d9aef  feat: add Tailwind v4 design tokens and global CSS
051f6de  chore: add Tailwind v4, React, Cloudflare adapter, ESLint, Vitest
8f5b0ed  Initial commit from Astro
```
