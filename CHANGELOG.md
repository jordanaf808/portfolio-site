# The Commerce Boutique — Build Log

---

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

---

---

## Session Update — 2026-05-15

**Branch:** `main`  
**Status:** Six targeted improvements — UI polish, mobile layout, Zod validation, masonry gallery

---

### Summary

A focused improvement session addressing UX issues found during browser QA, adding mobile responsiveness, upgrading the contact form validation to Zod, and building out the Job Role project page variant with a masonry gallery and slideshow modal.

---

### Architecture Changes

```text
Layout split (updated):
  Lookbook + Archive  →  Mobile: full-width content, hamburger drawer for LeftPanel
                         Desktop: 40/60 unchanged
  Project Detail      →  Mobile: gallery stacks above content (full-width, 256px tall)
                         Desktop: 50/50 unchanged
  Job Role Detail     →  Left column: scrollable MasonryGallery (replaces sliding ImageGallery)
                         Click image → native <dialog> full-screen slideshow

Validation (updated):
  /api/contact  →  Zod schema (src/lib/contactSchema.ts) replaces handwritten validateContact.ts
  Budget field removed from ContactFormData, CartDrawer, API endpoint, and tests

Accordion (updated):
  Was: native <details>/<summary> (no content animation)
  Now: custom button + CSS grid-template-rows: 0fr→1fr transition (300ms smooth)

LeftPanel (updated):
  Was: always-visible fixed sidebar
  Now: off-screen on mobile (-translate-x-full), slides in as drawer (z-40) with backdrop (z-30)
```

---

### Changes Made

#### Fix 1 — Grayscale Hover Bug in ProjectCard

**File modified:** `src/components/ProjectCard.astro`

The `absolute inset-0` hover overlay had `pointer-events: auto` (browser default). It sat above the `<img>` and silently consumed all mouse events, preventing `:hover` from reaching the image — so the 400ms `filter: grayscale(0%)` transition never fired on cards that had the overlay rendered.

**Fix:** Added `pointer-events-none` to the overlay div. `group-hover` continues to work because it's driven by the ancestor `<article class="group">`, not the overlay itself.

---

### Fix 2 — Move 'Add to Cart' Button Above Footer-Nav

**File modified:** `src/pages/projects/[slug].astro`

The CTA button was positioned at the top of the right scrollable column, before accordions and gallery content — visitors who scrolled through all the content had to scroll back up to hire. Moved the button (and the Technical Architecture table for project type entries) to just before the footer-nav, so it's the last thing seen after reading all content.

---

### Feature 3 — Animate Accordion Open/Close

**File modified:** `src/components/Accordion.astro`

Replaced the native `<details>`/`<summary>` element with a custom `<button>`-driven accordion. Native `<details>` cannot animate its content area — the browser collapses it before any CSS transition runs.

**Technique:** CSS `grid-template-rows: 0fr → 1fr` trick. The content wrapper uses `display: grid` with `overflow: hidden` on its inner div. Animating `grid-template-rows` transitions the effective height from 0 to auto without needing JavaScript height measurements. The `+` chevron uses `group-aria-expanded:rotate-45` (Tailwind reads the `aria-expanded` attribute directly off the trigger button).

---

### Feature 4 — Zod Contact Form Validation + Remove Budget Field

**Files created:** `src/lib/contactSchema.ts`  
**Files modified:** `src/lib/validateContact.ts`, `src/types/index.ts`, `src/components/CartDrawer.tsx`, `src/lib/validateContact.test.ts`, `src/pages/api/contact.ts`

**Budget removal:** The budget range selector (`$10k–$25k / $25k–$50k / $50k+`) was removed entirely. Touched: `ContactFormData` interface, CartDrawer state + JSX, validateContact logic, API endpoint email template and subject line, and the test fixture.

**Zod upgrade:** `src/lib/contactSchema.ts` defines a Zod v4 schema using `z.email()` (top-level, replacing the deprecated `z.string().email()`), `z.string().trim().min()` for company and details, and `.transform(v => v.toLowerCase())` for email normalisation.

`validateContact.ts` now wraps `contactSchema.safeParse()` and returns a proper discriminated union (`{ valid: true; data: ContactData } | { valid: false; errors: Record<string, string> }`), replacing the old single-error-string interface. The API endpoint uses `Object.values(result.errors)[0]` to surface the first error message to the client.

**Note:** Zod v4's `.email()` is stricter than the original `contains('@')` check. The trim/lowercase test was updated to not pass spaces in the email field (which is correctly invalid by RFC).

---

### Feature 5 — Job Role Masonry Gallery + Slideshow Modal

**Files created:** `src/components/MasonryGallery.astro`  
**Files modified:** `src/pages/projects/[slug].astro`

For `type: 'jobRole'` project pages, the left-column sliding `ImageGallery` is replaced with a vertically scrollable masonry grid. The right-column inline gallery grid is now gated to `type: 'project'` only (since job role images live in the left masonry column).

**MasonryGallery.astro:** CSS `columns-2` layout (browser-native masonry column flow) with `overflow-y-auto h-full`. Each image is wrapped in a `<button>` that dispatches an `open-slideshow` CustomEvent with the image index. The full image array is serialised as `data-images` on the container.

**Slideshow modal:** A native `<dialog>` element (`showModal()` / `close()`) conditionally rendered for job role pages. Escape key closes it natively. Prev/Next buttons and left/right arrow keys navigate between slides. Clicking the backdrop (`e.target === modal`) also closes it. No React island — vanilla JS in the existing `<script>` block.

---

### Feature 6 — Mobile Layout (Hamburger Drawer)

**Files modified:** `src/layouts/Layout.astro`, `src/components/LeftPanel.astro`, `src/components/TopNav.astro`, `src/pages/projects/[slug].astro`

**TopNav:** Added optional `showHamburger?: boolean` prop. When true, renders a "Menu" button (`md:hidden`) that dispatches an `open-left-panel` CustomEvent. The desktop Studio/Archive nav links are hidden on mobile (`hidden md:flex`) — navigation happens via the drawer. `Layout.astro` passes `showHamburger` when rendering TopNav; `[slug].astro` does not (no LeftPanel on detail pages).

**LeftPanel:** The `<aside>` now starts off-screen (`-translate-x-full`) on mobile and slides to `translate-x-0` when the drawer opens, using a 300ms ease-in-out transition. Bumped from `z-20` to `z-40` so it sits above the `z-30` backdrop. A "× Close" button (`md:hidden`) is the first child.

**Layout.astro:** Right panel changed from `ml-[40%] w-[60%]` to `w-full md:ml-[40%] md:w-[60%]` so it fills the viewport on mobile. A `z-30` backdrop div is added between `<LeftPanel>` and the right panel. The inline script handles `open-left-panel` event, Escape key, close button, and backdrop click — toggling `-translate-x-full` and `hidden` classes, and locking `document.body.style.overflow` while the drawer is open.

**[slug].astro (project detail):** The 50/50 split container changed to `flex flex-col md:flex-row`. The left gallery column gets `w-full h-64 md:h-auto md:w-1/2` so it appears at 256px tall on mobile and the right content column scrolls beneath it.

---

#### Fix 7 — First Accordion Open by Default

**File modified:** `src/components/Accordion.astro`, `src/pages/projects/[slug].astro`

Added an `open?: boolean` prop to `Accordion.astro`. When true, `aria-expanded` is initialised to `"true"` and `grid-template-rows` starts at `1fr` instead of `0fr`, so the content is visible without requiring a click. The existing JS toggle reads `aria-expanded` on each click, so open/close continues to work correctly regardless of starting state.

In `[slug].astro`, the first accordion in each branch now receives `open`: "The Challenge" for `project` type and "Overview" for `jobRole` type.

---

#### Fix 8 — Slideshow Prev/Next Cursor

**File modified:** `src/pages/projects/[slug].astro`

Added `cursor-pointer` to the `#slideshow-prev` and `#slideshow-next` `<button>` elements inside the `<dialog>` slideshow modal. Tailwind's base reset does not apply `cursor: pointer` to buttons by default, so the cursor remained an arrow on hover.

---

#### Fix 9 — CTA Button Text

**File modified:** `src/pages/projects/[slug].astro`

Changed button label from `Add to Cart — Hire Me →` to `Get In Touch` on both the `project` and `jobRole` variants of the CTA block.

---

#### Feature 10 — Prev/Next Project Navigation in Footer

**File modified:** `src/pages/projects/[slug].astro`

Replaced the static "← Archive / Lookbook" footer nav links with circular prev/next project navigation. `getStaticPaths` now passes `prevEntry` and `nextEntry` as typed props alongside `entry`:

- `prevEntry` uses `all.at(i - 1)` — when `i === 0`, `at(-1)` naturally returns the last element, wrapping to the end of the list.
- `nextEntry` uses `all[(i + 1) % all.length]` — wraps back to the first entry from the last.

Both props are always `ProjectEntry` (never null), so no conditional rendering is needed. Each link shows the adjacent project's title with a directional arrow.

---

### Checks

```text
pnpm type-check   →  0 errors, 0 warnings, 0 hints  (22 files checked)
pnpm test --run   →  7/7 tests pass
```

---

## Session Update — 2026-05-16

**Branch:** `main`
**Status:** Homepage layout polish — left panel tightening, profile section added to right panel

---

### Summary

Focused UI pass on the homepage. Left panel: reduced nav cell size and cleaned up the bio section. Right panel: removed the "The Commerce Boutique" brand link from the top nav, and added a real profile photo section at the top of the homepage (homepage-only, not injected globally via Layout.astro).

---

### Changes Made

#### Fix 1 — Shrink Bento Nav Cells

**File modified:** `src/components/LeftPanel.astro`

Reduced padding on all four 2×2 nav grid cells from `p-8` → `p-5`. Label and title text sizes are unchanged — the cells are visually tighter without changing the type hierarchy.

---

#### Fix 2 — Remove Bio Paragraph from Left Panel Bottom Section

**File modified:** `src/components/LeftPanel.astro`

The bio paragraph ("Crafting performant digital flagships...") was removed from the "Bio + tech tags" section at the bottom of the left panel. The tech tag pills (TypeScript, React, Liquid, Shopify) remain. The description now lives in the right panel profile section instead (see Feature 4).

---

#### Fix 3 — Remove "The Commerce Boutique" Link from TopNav

**File modified:** `src/components/TopNav.astro`

Removed the `<a href="/">The Commerce Boutique</a>` anchor from the left side of the top nav bar. The Studio / Archive links and the Hire Us button are unchanged.

---

#### Feature 4 — Profile Section on Homepage

**File modified:** `src/pages/index.astro`

Added a profile section at the very top of the homepage slot (before "Selected Work"), homepage-only — placed in `index.astro` rather than `Layout.astro` to keep it off the archive and project detail pages.

**Layout:**

- Default (< 1200px): stacked — square profile image (`aspect-square`, capped at `max-h-120` / 480px) with bio text below on a white `bg-surface` block
- 1200px+ (`min-[1200px]:`): side-by-side — image occupies `w-1/2` left, stays square (`aspect-square`, uncapped), bio text fills right half with `border-l` separator, vertically centered

**Image:** Real photo at `public/profile-pic.jpg`. Uses `object-cover object-top` to crop to the square viewport with the subject's face preserved. `grayscale-hover` class applied — matches the 400ms desaturation → full-colour transition used on project cards.

**Implementation note:** The image is wrapped in a sizing `<div>` (not applied directly to `<img>`) so that `aspect-square`/`aspect-auto` can be toggled on the container at the breakpoint while the `<img>` always fills it with `w-full h-full object-cover`.

---

### Checks

```text
pnpm type-check   →  0 errors, 0 warnings, 0 hints  (22 files checked)
pnpm build        →  Complete — clean build
```

---

## Session Update — 2026-05-20

**Branch:** `main`  
**Status:** pnpm v10→v11 migration + profile section moved into left panel

---

### Summary

Two changes: a tooling migration to pnpm v11 and a significant layout refactor moving the profile section from the homepage into the `LeftPanel` brand header, with updated breakpoints and responsive behaviour across the layout.

---

### Changes Made

#### Chore 1 — pnpm v10→v11 Migration

**Files modified:** `package.json`, `pnpm-workspace.yaml` (created)

Ran `pnpx codemod run pnpm-v10-to-v11`. Moved workspace and catalog config out of `package.json` into the dedicated `pnpm-workspace.yaml` file, which is the pnpm v11 convention. No functional changes to dependencies or scripts.

---

#### Feature 2 — Profile Section Moved into LeftPanel

**Files modified:** `src/components/LeftPanel.astro`, `src/components/ProjectCard.astro`, `src/components/TopNav.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/data/jobRoles.ts`, `src/data/projects.ts`

Profile photo and bio relocated from `index.astro` into the `LeftPanel` brand header. The brand header is now a 2-column CSS grid: the portrait image and about text occupy the lower-left cell below 1300px; at narrower widths (below 1000px) the panel collapses to title-only (image and about are hidden).

Nav grid collapses from 2×2 to a single column below 1000px with corrected borders. All breakpoints across `Layout.astro`, `LeftPanel.astro`, and `TopNav.astro` were updated from `md` (768px) to `min-[1000px]`.

`TopNav` is now hidden above 1000px (the left panel is always visible at desktop widths). The close button was repositioned as `absolute` on mobile to avoid affecting the header grid layout. A duplicate mobile-only brand header was added to `index.astro` (hidden above 1000px) to keep the lookbook heading visible on mobile where `LeftPanel` is off-screen as a drawer.

`ProjectCard` tech tag pills were inverted to dark background / light text to improve contrast at the bottom of the card.

---

### Checks

```text
pnpm type-check   →  0 errors
pnpm build        →  Complete — clean build
```

---

## Session Update — 2026-05-21

**Branch:** `main`  
**Status:** Right panel layout fix + marquee nav hover effect + panel header height alignment

---

### Summary

Three targeted improvements: a layout bug fix for large viewports where the two panels fell out of sync, a marquee hover animation added to the bento nav grid, and a min-height constraint ensuring the left and right panel headers share the same bottom border Y position.

---

### Changes Made

#### Fix 1 — Right Panel Gap on Large Screens

**File modified:** `src/layouts/Layout.astro`

**Bug:** `LeftPanel` uses `min-[1000px]:w-[40%] max-w-lg`, which caps its width at 512px (32rem) on large screens. The right panel was using `ml-[40%] w-[60%]` (pure percentage), so it continued growing past 512px — leaving a visible gap between the panels on wide viewports.

**Fix:** Right panel margin changed to `ml-[min(40%,32rem)]` and width to `w-[calc(100%-min(40%,32rem))]`. The CSS `min()` function mirrors the left panel's effective rendered width exactly at every viewport size, eliminating the gap.

---

#### Feature 2 — Marquee Hover Effect on Nav Grid

**File modified:** `src/components/LeftPanel.astro`

Each of the four bento nav cells now contains a hidden marquee strip. On hover, a CSS `@keyframes` animation slides a repeating row of title text horizontally across the cell background, creating an editorial ticker effect.

Nav cells refactored to use a `.nav-cell` class. The Tailwind `hover:bg-surface-container-high` class was removed from each cell; hover background is now handled by the `.nav-cell:hover` CSS rule using semi-transparent accent taupe (`#c8b6a66e`). `max-w-lg` added to the `<aside>` element to cap the panel width at 512px, consistent with the Layout.astro fix above.

---

#### Fix 3 — Align Panel Header Heights at Desktop Breakpoints

**Files modified:** `src/components/LeftPanel.astro`, `src/pages/index.astro`

**Problem:** The `LeftPanel` title row and the "Selected Work" section header in the right panel had no minimum height, so their bottom borders landed at different Y positions depending on content at different viewport widths.

**Fix:** Added `min-[1000px]:min-h-27` (108px) to both the `LeftPanel` title `<div>` and a new "Selected Work" section header `<div>` in `index.astro`. Both horizontal borders now align at the same Y coordinate for all viewports ≥ 1000px.

Nav cell labels also updated: "What We Build" → "What I Do", "Start a Project" → "Get In Touch" — matching the first-person voice used in the brand header.

---

### Checks

```text
pnpm type-check   →  0 errors
pnpm build        →  Complete — clean build
```

---

## Session Update — 2026-05-22

**Branch:** `main`
**Status:** Two-column project grid, card header colour polish, TopNav cart drawer fix

---

### Summary

Visual and interaction polish session. Added a two-column layout for project cards on wide viewports, swapped and refined card/section header background colours with a hover tint, and fixed the "Hire Us" button in `TopNav` which was not opening the contact drawer on project detail pages.

---

### Changes Made

#### Feature 1 — Two-Column Project Grid at 1400px+

**File modified:** `src/pages/index.astro`

Project cards now display in two columns at viewports ≥ 1400px. The card map is wrapped in a `.project-grid` CSS grid container (`grid-cols-1` default, `min-[1400px]:grid-cols-2`).

Column divider uses the gap-as-divider pattern: `column-gap: 1px` + `background-color: var(--color-primary)` on the grid container. This avoids the layout side-effect of `border-right` (which narrows the left card's content area, causing a fractional-pixel misalignment in the `aspect-[16/10]` image height across the two columns).

---

#### Style 2 — Card Header Colour Updates

**Files modified:** `src/pages/index.astro`, `src/components/ProjectCard.astro`

Background colours swapped between the "Selected Work" section header and the project card header:

- "Selected Work" header: `bg-background` (`#F4F4F0`)
- Card header default: `bg-surface` (`#FFFFFF`)
- Card header on hover: `#ede5dd` (warm tint), with `transition-colors duration-300`

The hover colour is applied via a scoped `<style>` block in `ProjectCard.astro` using `.group:hover .card-header` — required because the `<article>` (carrying the `group` class) and `.card-header` are in the same component, so Astro's scope hash applies correctly to both without needing `:global()`.

---

#### Fix 3 — TopNav "Hire Us" Button Now Opens Contact Drawer on All Pages

**Files modified:** `src/components/TopNav.astro`, `src/layouts/Layout.astro`

**Bug:** The `open-cart-drawer` click → CustomEvent wiring lived in `Layout.astro`'s `<script>`. On project detail pages, `TopNav` is imported directly (without `Layout`), so the script never ran and the button did nothing.

**Fix:** Moved the event wiring into `TopNav.astro` as a self-contained `<script>`. Astro deduplicates component scripts, so this is safe regardless of how many times `TopNav` appears in the page tree. The redundant listener was removed from `Layout.astro`.

---

#### Style 4 — Responsive About Text in LeftPanel

**File modified:** `src/components/LeftPanel.astro`

The About bio paragraph in the brand header was a fixed `text-sm` (14px) with `p-6` padding, leaving the cell visibly under-filled relative to its sibling `aspect-2/3` image (which dictates the row height).

Bumped to responsive sizing scaled to the cell:

- **1000–1279px** (narrow panel, ~300px row height): `text-base` (16px), `leading-snug`, `p-3`
- **1280px+** (panel at max-w-lg cap, ~384px row height): `text-lg` (18px), `leading-normal`, `p-6`

Tighter padding at the narrow breakpoint reclaims horizontal room so `text-base` doesn't wrap into a tower; at the wider breakpoint there's room for both larger text and relaxed padding/leading.

---

### Checks

```text
pnpm type-check   →  0 errors, 0 warnings, 0 hints  (22 files checked)
pnpm build        →  Complete — clean build
```

---

## Session Update - 2026-05-25

**Branch:** `main`

---

### style: mobile layout refinements for index page

**Brand header vertical stack (`src/pages/index.astro`)**

- Below 540px: title, image, and about text now stack vertically in DOM order (Title → Image → About) via a single-column grid; auto-placement handles ordering with no explicit `col-start`/`row-start` needed
- Image gets a fixed `h-72` (288px) at mobile — avoids an oversized portrait that the previous `aspect-2/3` would produce at full width
- At 540px+: 2-column layout restored (image left spanning both rows, title + about stacked on the right)
- "Selected Work" heading is smaller/centered below 540px, larger/left-aligned at 540px+

**Hide TopNav nav links on index page below 1000px (`src/components/TopNav.astro`, `src/layouts/Layout.astro`)**

- Added `hideMenuItems?: boolean` prop to TopNav; applies `hidden` to `.menu-items` when true
- Layout passes `hideMenuItems={activePage === 'lookbook'}` — the Brand Header already surfaces navigation on the index page at mobile, making the duplicate TopNav links redundant
- Button copy "Hire Us" → "Hire Me"

**LeftPanel About cell typography (`src/components/LeftPanel.astro`)**

- Adjusted padding (`p-4`) and body text size/leading (`text-md leading-7`) for better visual balance at desktop widths

**Project detail hero reorder (`src/pages/projects/[slug].astro`)**

- Title moved above tech tag pills for cleaner visual hierarchy — headline first, metadata second

### fix: restore full-height panels and right-panel scrolling after grid refactor

The previous grid refactor commit broke two behaviors at ≥1000px: panels no longer filled the viewport height, and the right panel's `<main>` could no longer scroll. Root cause was the grid container's implicit row sizing — without explicit `grid-template-rows`, items push the row past the viewport because grid items have a default `min-height: auto` that resists shrinking below content size.

Changes:

- `src/layouts/Layout.astro`: Added `min-[1000px]:grid-rows-[1fr]` to body (constrains row to viewport height) and `min-h-0` to the right panel grid item (lets it shrink to the row size)
- `src/components/LeftPanel.astro`: Added `min-[1000px]:min-h-0` (respects grid row size) and `min-[1000px]:overflow-y-auto` (so its content scrolls internally if it exceeds viewport height — e.g. on shorter laptop screens)

Why: This restores the previous height chain (body 100vh → grid row 100vh → panel 100vh → `<main>` flex-1) that `overflow-y-auto` depends on for the right panel's independent scrolling.

### content: update LeftPanel about copy

Replaced the placeholder full-stack copy with a more specific bio (L.A.-based, 5+ years, e-commerce focus, CRO/Core Web Vitals emphasis). Old copy retained as a comment for reference.

### style: refactor layout to CSS Grid for desktop (≥1000px)

Replaced fixed position + margin-offset pattern with CSS Grid to provide cleaner separation between left and right panels. The grid column `1fr` naturally fills remaining space without needing `calc()` offsets.

Changes:

- `src/layouts/Layout.astro`: Added `min-[1000px]:grid min-[1000px]:grid-cols-[480px_1fr]` to body, removed margin/width calc classes from right panel
- `src/components/LeftPanel.astro`: Added `min-[1000px]:static` to override `position: fixed` at desktop widths, enabling grid participation

Why: The previous margin-offset approach had the right panel's offset out of sync with the left panel's actual width. Grid approach is architecturally cleaner, eliminates the need for calculated widths, and provides a single source of truth for the 480px column width.

**Verification:** Desktop layout verified at 1440px (left panel fixed width, right panel fills remaining space), mobile layout confirmed unchanged at 375px (full-width right panel, hamburger drawer).

---
## Session Update - 2026-05-26

### style: unify contact CTAs and polish typography

Tightening the language and visual rhythm of the contact funnel. The site had a mix of "Hire Me" / "Hire Us" / "Add to Cart — Hire Me" / "Checkout" labels for what is effectively a single action: open the contact drawer. Consolidated to "Contact" everywhere.

**Contact CTA rebrand:**

- `src/components/TopNav.astro` — button text: "Hire Me" → "Contact Me"; now accepts an `activePage` prop so Home/Archive links show the active-state underline on the mobile TopNav (previously hard-coded to Home as active).
- `src/components/CartDrawer.tsx` — drawer heading "Checkout" → "Contact"; minor spacing nudges to compensate (`pb-5`, `leading-6`, `mt-2`).
- `src/pages/projects/[slug].astro` — project-detail CTA "Add to Cart — Hire Me →" → "Contact Me →"; removed redundant top border on the CTA section.
- `src/layouts/Layout.astro` — passes `activePage` through to the mobile TopNav for the new active-state logic.

**Typography polish:**

- `src/components/LeftPanel.astro` — bio block: `text-md` → `text-[.9rem]`, `leading-7` → `leading-7.5`, added hanging indent (`indent-3`), tightened right padding (`pr-4` → `pr-3.5`); copy: "I'm" → "I am", "e-commerce" → "eCommerce".
- `src/pages/index.astro` — added `indent-8` to the mobile/tablet About block to match the desktop indent rhythm.

**Visual:**

- `src/styles/global.css` — scrollbar track now uses `--color-surface-container-low` instead of `transparent`, giving the right panel a faint visible track on white surfaces.

Why: a unified "Contact" verb maps better to the cart-drawer-as-contact-form metaphor and removes label inconsistency across nav surfaces. The typography nudges align the LeftPanel bio's optical weight with the surrounding elements.

### feat: dynamic quarter availability label

The availability footer in the LeftPanel was hard-coded to "Available Q3 2026", which would silently go stale. Replaced with a runtime computation so the label always reflects the current calendar quarter.

**Files:**

- `src/utils/date.ts` (new) — exports `getCurrentQuarterLabel(date?)`, returns e.g. `"Q2 2026"`.
- `src/components/LeftPanel.astro` — availability `<span>` now has `id="availability-label"`; inline `<script>` imports the helper and overwrites the text on mount.

Why: the static label is misleading the moment the quarter rolls over. Computing client-side keeps the static build cacheable while the displayed text stays accurate.

### feat: SEO and social metadata for all pages

Before this commit the site shipped without `<meta name="description">`, without Open Graph or Twitter Card tags, and with a generic title (`Lookbook — The Commerce Boutique`) that omitted Jordan's name and role. Sharing any page on LinkedIn / Slack / iMessage produced a bare link preview, and the homepage was effectively invisible to recruiters searching "Jordan AF Shopify".

**New shared component:**

- `src/components/SEOHead.astro` (new) — single source of truth for `<title>`, `<meta name="description">`, canonical link, full Open Graph block (`og:type`, `og:title`, `og:description`, `og:image`, `og:url`), and Twitter card (`summary_large_image` with title/description/image). Takes a `title` prop (required) plus optional `description` and `ogImage` with sensible defaults. Uses `Astro.site` to resolve absolute URLs.

**Wiring:**

- `src/layouts/Layout.astro` — replaces the inline `<title>` with `<SEOHead>`. Layout's Props now accepts optional `description` and `ogImage` that pass through. `title` is now a complete title string rather than a fragment the layout suffixes; the previous "— The Commerce Boutique" auto-suffix is removed in favour of each page composing its own title.
- `src/pages/projects/[slug].astro` — bypasses Layout (uses its own 50/50 shell) so `<SEOHead>` is imported and used directly inside the page's `<head>`. The project's first image is passed as `ogImage` so social previews show project artwork instead of the default.
- `src/pages/index.astro` — title now `"Jordan A.F. — Shopify & JS/TS Developer | Lookbook"` (was `"Lookbook"`); description summarizes role + experience.
- `src/pages/archive.astro` — title now `"Archive — Jordan A.F. | Shopify & JS/TS Developer"`; description describes the archive's purpose.

**Config:**

- `astro.config.mjs` — added `site: 'https://thecommerceboutique.com'` (placeholder; production URL to be confirmed) so `Astro.site` resolves and `new URL(pathname, Astro.site)` produces absolute canonical and og:image URLs. TODO comment in-file flags the placeholder.

**Follow-ups left in TODO.md:**

- Author `/public/og-default.jpg` (1200×630) as the default `og:image`. Currently referenced but the file doesn't yet exist.
- Confirm and replace the production URL placeholder in `astro.config.mjs`.

Why: this is the single largest external-facing fix in the UI/UX plan — zero visual change but the link-preview experience on every social platform goes from broken to branded, and the homepage `<title>` now contains the keywords a recruiter actually searches. Verified in dev at `/`, `/archive`, and `/projects/true-classic`; all three return complete, distinct metadata blocks.

### content: tighten homepage title

Dropped the `| Lookbook` suffix from the homepage title. `<title>`, `og:title`, and `twitter:title` are now `"Jordan A.F. — Shopify & JS/TS Developer"` — the page-name suffix was diluting the keyword density of the name + role. Single-source change in `SEOHead.astro`'s `title` prop cascades to all three meta fields.

**Files:**

- `src/pages/index.astro` — title prop on `<Layout>`.

### a11y: skip link, h1/img dedup, decorative marquee aria-hidden, image fetch priorities

Phase 2 of the UI/UX plan — four discrete accessibility wins on a single branch.

**1. Skip-to-work link** (`src/layouts/Layout.astro`, `src/styles/global.css`)

Keyboard users previously had to tab through the entire LeftPanel (close button, four marquee nav cells, tech-tag pills) before reaching the work feed. Added a `<a href="#main" class="skip-link">Skip to work</a>` as the first child of `<body>`, paired with `id="main"` on the `<main>` element. CSS keeps the link translated off-screen until `:focus-visible` reveals it — visible only on keyboard nav, not pointer focus.

**2. Duplicate `<h1>` and profile image removed** (`src/pages/index.astro`)

DOM inspection found two `<h1>Jordan A.F.</h1>` nodes (one in LeftPanel, one in the mobile-only index brand header) and two `<img alt="Jordan A.F.">` tags. Screen readers announced both. Resolution:

- The mobile-only brand header's `<h1>` became a styled `<p>` marked `aria-hidden="true"` (decorative; LeftPanel's heading is the canonical h1 at every viewport).
- The mobile brand header's `<img>` got `alt=""` so the alt text is conveyed exactly once by the LeftPanel image.

Trade-off accepted: at mobile widths the LeftPanel is positioned off-screen via `transform: translateX(-100%)` but remains in the accessibility tree, so screen readers still hear "Jordan A.F." as the page heading. A future improvement is to toggle `inert` on the closed mobile drawer — flagged but out of scope for quick wins.

**3. Decorative marquee tracks muted** (`src/components/LeftPanel.astro`)

Each nav cell contains four duplicate `<span class="marquee-text">` copies that animate on hover. Previously the link's accessible name was announced as `"Selected Work Selected Work Selected Work Selected Work PORTFOLIO Selected Work"`. Each `.marquee-wrap` now carries `aria-hidden="true"`, so the link's name resolves to just the visible label + title pair.

**4. Project image fetch priorities** (`src/components/ProjectCard.astro`)

The first project card is the LCP candidate; cards 2–4 are below the fold. Updated to:

- First card (`index === 0`): `loading="eager" fetchpriority="high" decoding="async"`
- Subsequent cards: `loading="lazy" fetchpriority="auto" decoding="async"`

`decoding="async"` was missing previously; added on all.

**Verified live in dev:**

- `document.querySelectorAll('h1').length` → 1 (was 2)
- Profile image alts → `["Jordan A.F.", ""]` (was `["Jordan A.F.", "Jordan A.F."]`)
- 4 of 4 `.marquee-wrap` elements have `aria-hidden="true"`
- First focusable element is the skip link; `<main>` has `id="main"`
- Skip link transforms in via `:focus-visible` only (programmatic `.focus()` correctly does not reveal it — matches keyboard-only intent)

Why: each item is small individually but together they meaningfully improve the screen-reader and keyboard-navigation experience, and the image hint changes give the index page a perceptible LCP improvement at no design cost.

### style: promote availability into brand header, retire footer chip

Phase 3 of the UI/UX plan. The "AVAILABLE Q3 2026" signal was previously buried at the bottom of the LeftPanel below the bento nav and tech-tag pills — likely missed in the first 5 seconds of a recruiter's scan. Promoted it to sit directly under the tagline in both the desktop LeftPanel brand header and the mobile/tablet brand header in `index.astro`.

**Layout typography & sizing pass (companion to the chip promotion):**

- `src/layouts/Layout.astro` — desktop grid column `480px` → `500px`.
- `src/components/LeftPanel.astro` — panel width matched to `500px`; brand title cell `min-h-27` → `min-h-37`; `<h1>` from `text-3xl leading-tight` to `text-[40px] leading-[50px]` for more presence; tagline `mt-1` removed (consumed by the new chip spacing); availability chip with `mt-3`; About cell padding `p-4` → `p-5`; bio copy now `text-text` (was `text-muted`) at `text-[1rem] leading-8` — promotes the bio from secondary detail to primary read.
- `src/pages/index.astro` — mobile brand header gets the same chip (green dot + dynamic `data-availability-label` span) below the tagline; Selected Work section header re-padded to `p-8` and given `min-h-37` plus `flex items-center` so its baseline aligns with the LeftPanel brand cell on desktop.
- Bio copy on both desktop and mobile updated to "with 5+ years of experience building eCommerce storefronts..." (smoother phrasing).
- Footer text in `src/pages/index.astro` changed from `© 2026 The Commerce Boutique` to `© 2026 JordanAF-Dev`.

**Bottom availability chip removed:**

The existing `<div class="p-6 border-t border-primary flex items-center gap-2"> ... </div>` block at the bottom of the LeftPanel is gone. The tech-tag pills (`TYPESCRIPT REACT LIQUID SHOPIFY`) are now the panel's terminal element.

**Single source of truth for the dynamic label:**

The inline `<script>` in `LeftPanel.astro` used to target one element via `getElementById('availability-label')`. Now it queries `document.querySelectorAll<HTMLElement>('[data-availability-label]')` and updates all matches. Both the LeftPanel chip and the index mobile chip carry the `data-availability-label` attribute, so a single call to `getCurrentQuarterLabel()` writes both. The script lives in LeftPanel; LeftPanel is rendered on every Layout-using page, so the script always runs once per page load. Verified live: both chips read "AVAILABLE Q2 2026" on 2026-05-26.

Why: portfolio's "first 5 seconds" job is to answer (1) what does this person do, (2) is this person available, (3) is this person any good. Availability is the second-highest-value signal but was previously the last thing in the LeftPanel. Promoting it past the brand tagline puts it in the path of even a half-second scan.

