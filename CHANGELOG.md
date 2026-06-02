# The Commerce Boutique — Build Log

---

**Date:** 2026-06-01
**Branch:** `feat/strict-csp`
**Change:** Adopt Astro's built-in hash-based CSP; remove `'unsafe-inline'`

**Files touched:** `astro.config.mjs`, `public/_headers`, `src/styles/global.css`, `src/components/TechBadge.astro`, `src/components/ServicesCTA.astro`, `src/components/CartDrawer.tsx`, `src/components/Accordion.astro`

**What changed:**

- `astro.config.mjs`: enabled `security.csp`. Astro now hashes every inline script/style it emits and injects a per-page `<meta http-equiv="content-security-policy">`. We declare `default-src`/`img-src`/`font-src`/`connect-src` and add `https://fonts.googleapis.com` to `style-src` via `styleDirective.resources`; `script-src 'self' 'sha256-…'` and the style hashes are appended automatically.
- `public/_headers`: removed the static `Content-Security-Policy` line (replaced by the Astro meta CSP). A static header can't carry the per-build script hashes, and two enforced policies would conflict. Left a comment explaining why; framing stays protected by `X-Frame-Options: DENY`.
- Removed all 5 inline `style=` attributes, since CSP hashes cannot cover style **attributes** (only `<style>`/`<script>` elements) and Astro ignores `'unsafe-inline'` once it emits hashes:
  - `global.css`: repurposed the previously-unused `.hard-shadow` utility to the in-use `rgba(17,17,17,0.05)` value (was `0.1`, dead) and added `.drawer-shadow` and `.pixelated` utilities.
  - `TechBadge.astro` → `.pixelated`; `ServicesCTA.astro` + `CartDrawer.tsx` (order summary) → `.hard-shadow`; `CartDrawer.tsx` (drawer panel) → `.drawer-shadow`.
  - `Accordion.astro`: replaced the dynamic inline `grid-template-rows` style with a `class:list` toggle (`grid-rows-[1fr]`/`grid-rows-[0fr]`). The client click handler still animates via the CSSOM (`.style.gridTemplateRows`), which CSP does not block.

**Why:** The previous header CSP used `script-src/style-src 'unsafe-inline'`, which negates most of CSP's XSS protection (and contradicts `security.md`). Hash-based CSP via Astro's first-party feature locks down inline scripts with no new dependencies. Note: this intentionally deviates from `astro.md`'s "use inline style with CSS custom properties for dynamic values" guidance in the Accordion — the value is binary and an inline attribute is incompatible with strict CSP.

---

**Date:** 2026-06-01
**Branch:** `refactor/tokenize-hover-colors`
**Change:** Consolidate hover-invert colors into theme tokens; remove dead code

**Files touched:** `src/styles/global.css`, `src/components/ProjectCard.astro`, `src/components/StatusBadge.astro`, `src/components/ServiceCell.astro`, `src/components/LeftPanel.astro`, `src/pages/archive.astro`, `src/pages/projects/[slug].astro`, `src/data/services.ts`

**What changed:**

- `global.css`: added `--color-hover-text` (`#ffffff`) and `--color-hover-muted` (`rgba(255, 255, 255, 0.65)`) tokens to the `@theme` block — the text colors used when sitting on a taupe hover background.
- Replaced six hardcoded hover-color literals with these tokens across `ProjectCard.astro`, `StatusBadge.astro`, `ServiceCell.astro`, `LeftPanel.astro`, and `archive.astro`; pointed the two `#888888` defaults at the existing `--color-muted` token.
- `services.ts`: removed a dead commented-out `jsSvg` import (re-imported below with the new `js-144-pixel.svg` path).
- `[slug].astro`: removed trailing whitespace left in a `class` string after a prior edit.

**Why:** The hover-invert text treatment was copy-pasted as raw color literals across five files; tokenizing gives a single source of truth consistent with the rest of the design system. No visual change — same rendered colors. Removed committed dead code per the project code-style rule.

---

**Date:** 2026-06-01
**Branch:** `main`
**Change:** Security, accessibility, and code quality audit fixes

**Files touched:** `public/_headers`, `src/lib/contactSchema.ts`, `src/components/CartDrawer.tsx`, `src/components/LeftPanel.astro`, `src/components/StatusBadge.astro`, `src/pages/archive.astro`, `src/pages/index.astro`, `src/pages/services.astro`, `src/data/jobRoles.ts`, `src/types/index.ts`

**What changed:**

- `_headers`: added `Content-Security-Policy` header (default-src self; unsafe-inline for scripts required by Astro hydration).
- `contactSchema.ts`: added `escapeHtml` Zod transform on `company` and `details` fields to prevent HTML injection in the Resend email body.
- `CartDrawer.tsx`: added focus trap (Tab/Shift+Tab cycles within the drawer), focus restore on close (returns focus to the trigger button), Escape key closes the drawer, and a persistent `aria-live="polite"` region announces form submission status to screen readers.
- `LeftPanel.astro`: removed bare `outline: none` from `.nav-cell` — `:focus-visible` overrides remain and now take effect correctly.
- `StatusBadge.astro`: changed `rounded-full` → `rounded-none` on the status dot; `rounded-full` was overridden to 0 in the Tailwind config but the class name was misleading.
- `archive.astro`: promoted `<h2>Archive</h2>` to `<h1>`; removed mouse-only `onclick` from `<tr>` (inner `<a>` already handles navigation).
- `index.astro`: promoted mobile header `<p aria-hidden="true">Jordan A.F.</p>` to `<h1>` (desktop gets its h1 from LeftPanel); fixed empty `alt=""` on profile photo to `alt="Jordan's profile image"`.
- `services.astro`: promoted `<h2>What I Do</h2>` to `<h1>`.
- `jobRoles.ts` + `types/index.ts`: made `responsibilities` and `technologies` optional fields on `JobRole`; removed empty-string placeholder values from all entries.

**Why:** Addressed WCAG 2.1 AA failures (missing h1, no focus trap, empty alt text, outline removal), a medium-severity HTML injection risk in the email template, missing CSP header, and type imprecision in the data layer.

---

**Date:** 2026-06-01
**Branch:** `main`
**Change:** Project detail page layout — ImageGallery sizing, prose max-width, CTA centering

**Files touched:** `src/pages/projects/[slug].astro`, `src/components/Accordion.astro`, `src/styles/global.css`

**What changed:**

- `[slug].astro`: removed `border-b` from the hero div (border now provided by the gallery); added `max-w-prose` to the hero description; wrapped the CTA section in `max-w-prose mx-auto` to center the button and project architecture table; replaced arbitrary `tracking-[0.1em]`/`tracking-[0.05em]` with canonical `tracking-widest`/`tracking-wider`.
- `Accordion.astro`: added `max-w-prose mx-auto` to the content wrapper so body text is constrained to a readable line length and centered in the panel.
- `global.css`: added `#image-gallery` rule — `min(750px, 100%)` width, `max-content` ceiling, auto horizontal margins, and a 1px border — to contain and center the image cycler on the project detail page.

**Why:** Long prose lines on wide viewports hurt readability; centering the constrained block gives the page a more intentional, editorial feel consistent with the bento grid aesthetic.

---

**Date:** 2026-06-01
**Branch:** `main`
**Change:** Fix mobile TopNav to position:fixed; trim nav links; fix ServiceCell border in single-column layout

**Files touched:** `src/components/TopNav.astro`, `src/layouts/Layout.astro`, `src/components/ServiceCell.astro`

**What changed:**

- `TopNav.astro`: switched from `sticky` to `fixed top-0 left-0 right-0 z-20` so the bar stays pinned to the viewport regardless of DOM nesting within the right-panel flex column. Removed `Home` and `Archive` nav links and all associated props (`hideMenuItems`, `activePage`) and class variables (`BASE`, `ACTIVE`, `INACTIVE`, `homeClass`, `archiveClass`).
- `Layout.astro`: added `max-[999px]:pt-11.25` (45px) to `<main>` to compensate for the fixed nav's height on mobile. Simplified the `<TopNav>` call site to `<TopNav showHamburger />`.
- `ServiceCell.astro`: added `@media (max-width: 539px)` rule to suppress `border-right` on `:nth-child(odd)` cells in the single-column layout (below the 540px two-column breakpoint), where the right border had no column to divide and appeared as a stray edge line.

**Why:** `position: sticky` fails when an element is nested inside a flex column that is itself a child of the document scroll container — the containing block calculation breaks. `position: fixed` escapes the containing block entirely and is the correct tool for a persistent mobile nav bar.

---

**Date:** 2026-06-01
**Branch:** `main`
**Change:** Add new pixel-art tech badges; fix badge import paths in services.ts

**Files touched:** `src/data/services.ts`, `src/assets/badges/html-5-144-pixel.svg`, `src/assets/badges/js-144-pixel.svg`, `src/assets/badges/nodejs-144-pixel.svg`, `src/assets/badges/postgresql-48-pixel.svg`, `src/assets/badges/redux-144-pixel.svg`, `src/assets/badges/tailwind-css-144-pixel.svg`, `src/assets/badges/tanstack-100-pixel.svg`

**What changed:**

- Added 7 new pixel-art SVG badges to `src/assets/badges/`: HTML5, JavaScript, Node.js, PostgreSQL, Redux, Tailwind CSS, TanStack.
- Fixed import paths in `services.ts`: all new badge imports were missing the `.svg` extension, which the Cloudflare workerd dev runner rejects with "Denied ID". Added `.svg` to each.
- Fixed PostgreSQL import filename: `postgres-144-pixel` → `postgresql-48-pixel` to match the actual file on disk.
- Commented out background fill rects and corner/near-corner frame pixels in each SVG to render transparently against the services page background.

**Why:** The Cloudflare workerd SSR runner enforces exact module IDs and does not resolve extensions automatically, unlike standard Vite. The SVG background and corner dots were artifacts of the original badge frame design, not part of the logo artwork.

---

**Date:** 2026-05-31
**Branch:** `fix/react-workerd-invalid-hook-call`
**Change:** Add HiDPI / Retina support to all image components

**Files touched:** `src/components/ImageGallery.astro`, `src/components/LeftPanel.astro`, `src/components/ProjectCard.astro`

**What changed:**

- `LeftPanel.astro`: profile photo switched from `widths={[250, 500]}` to `width={250} densities={[1, 2]}` — portrait photo in a portrait container, so `densities` emits proper `1x`/`2x` srcset descriptors rather than `400w`/`800w` width descriptors.
- `ImageGallery.astro` thumbnails: `widths={[225, 450]}` → `widths={[450, 1000]}` — the 225×283px portrait container with landscape images scales via `object-cover` to fill the height, making the effective content width ~503px for a 16:9 source. Bumping the base width to 450px covers that at 1× and provides adequate buffer at 2×.
- `ImageGallery.astro` slideshow: `getImage()` now generates both a 1600px (1×) and 3200px (2×) WebP per image at `quality: 'max'`. The client JS sets both `img.src` and `img.srcset` so the browser picks by DPR. Thumbnail `<Picture>` left on Astro's default quality.
- `ProjectCard.astro`: widths extended to `[400, 800, 1200, 1600]` — the 1600px entry covers 2× on single-card layout for viewports ≥ ~850px logical width.

**Why:** Previous image setup never accounted for device pixel ratio. Fixed-size images used width descriptors instead of density descriptors; the slideshow served a single 1600px source regardless of DPR; ProjectCard's widths topped out at 1200px, leaving the single-card layout soft at 2× on common laptop screens.

**Verified:** `pnpm type-check` → 0 errors. `pnpm build` → clean, 127 image variants (was ~100; additional entries are the 3200px 2× slideshow sources).

---

**Date:** 2026-05-31
**Branch:** `fix/react-workerd-invalid-hook-call`
**Change:** Fix dev-only "Invalid hook call" crash in React islands under the Cloudflare adapter

**Files touched:** `astro.config.mjs`, `docs/react-workerd-invalid-hook-call.md` (new)

**What changed:** Added a `configEnvironment` Vite plugin (`optimizeServerDeps`) that pre-bundles React's entry points (`react`, `react-dom`, `react-dom/server.edge`, `react-dom/client`, `react/jsx-runtime`) plus the lazily-discovered Astro internal `astro/assets/services/noop` into the workerd SSR optimizer in one startup pass. Added a **dev-only** `resolve.alias` forcing `react-dom/server` → `react-dom/server.edge`, kept `resolve.dedupe: ['react','react-dom']`, and added the React entry points to the client-side `vite.optimizeDeps.include`. Full writeup in `docs/react-workerd-invalid-hook-call.md`.

**Why:** `@astrojs/cloudflare` v13 runs the dev SSR inside workerd (its own Vite environment). The services page renders badge images, which lazily pulled in `astro/assets/services/noop` (the dev passthrough image service); Vite re-optimized and reloaded the worker mid-render, leaving `react-dom/server` holding a React instance with a null hook dispatcher → "Invalid hook call / Cannot read properties of null (useState)". Two separate `react-dom/server` builds (workerd resolves `server.edge.js`, Node resolves `server.node.js`) compounded it. `resolve.dedupe` alone did not fix it (only one copy on disk; the split was by build variant and optimizer pass) and `vite.ssr.optimizeDeps` is silently ignored under `@cloudflare/vite-plugin` — only `configEnvironment` reaches that optimizer. The alias is gated to dev because production prerenders in Node, where the default `react-dom/server` build is correct. Root cause matches open upstream issue withastro/astro#16529.

**Verified:** `pnpm build` clean (alias inert in build). Cleared `node_modules/.vite`, ran `pnpm dev` (no `--force`); `/services` and `/` both return 200 and render; dev log shows no `new dependencies optimized` reload, no invalid-hook-call, no `useState` error.

**Note:** When adding any new React island dependency, add it to **both** `SERVER_OPTIMIZE_DEPS` and `vite.optimizeDeps.include` or the lazy-discovery cascade can return.

---

**Date:** 2026-05-30
**Branch:** `feat/services-page`
**Change:** Integrate design-agent services page; fix SVG badge rendering

**Files touched:** `src/pages/services.astro` (new), `src/components/ServiceCell.astro` (new), `src/components/ServicesCTA.astro` (new), `src/components/TechBadge.astro` (new), `src/components/TechLabel.astro` (renamed from TechBadge.astro), `src/data/services.ts` (new), `src/assets/badges/*.svg` (9 files, new), `src/layouts/Layout.astro`, `src/components/LeftPanel.astro`, `src/components/TopNav.astro`, `src/pages/archive.astro`, `src/pages/projects/[slug].astro`

**What changed:** Added `/services` page using the two-column Layout. Renamed the existing `TechBadge.astro` (text label component) to `TechLabel.astro` to avoid collision with the incoming image badge component. `ServiceCell` changed from `<button data-open-cart>` to a non-interactive `<div>` — the tiles display services but don't trigger the cart drawer. `ServicesCTA` at the bottom retains the "Request Engagement →" cart trigger. SVG badge files copied to `src/assets/badges/` with `?url` imports in `services.ts`. Added `'services'` to the `activePage` union in Layout, LeftPanel, and TopNav. Fixed all 9 badge SVG files by adding the missing `xmlns="http://www.w3.org/2000/svg"` root attribute.

**Why:** SVG files lacked `xmlns` because they were authored for inline HTML use (where the HTML parser injects the SVG namespace implicitly). When loaded via `<img>` tag or as a data URI, the browser parses SVG as a standalone XML document — without `xmlns`, the parser doesn't recognise the elements as SVG and the image fails to render entirely. The `ServiceCell` script block was removed to prevent double-dispatch of `open-cart-drawer` alongside Layout's existing `data-open-cart` delegation.

**Verified:** `/services` renders with 6 service cells, 9 tech badge images visible, "Request Engagement →" opens cart drawer, no regressions on `/`, `/archive`, or `/projects/*`.

---

**Date:** 2026-05-30
**Branch:** `fix/dev-server-workerd-sharp`
**Change:** Fix `astro dev` workerd crash from `imageService: 'compile'` + patch 3 `pnpm audit` advisories

**Files touched:** `astro.config.mjs`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`

**What changed:** Made the Cloudflare adapter's `imageService` command-conditional in `astro.config.mjs` — `'passthrough'` under `astro dev`, `'compile'` for build/check (`const isDev = process.argv.includes('dev')`). Added an `overrides` block to `pnpm-workspace.yaml` pinning patched floors for three transitive advisories: `devalue ^5.8.1` (high, GHSA-77vg-94rm-hx3p, via `astro`), `ws ^8.20.1` (moderate, GHSA-58qx-3vcg-4xpx, via `@cloudflare/vite-plugin`), `yaml ^2.8.3` (moderate, GHSA-48c2-rrv3-qjmp, via `@astrojs/check`). Overrides live in `pnpm-workspace.yaml` because pnpm v11 no longer reads the `package.json` `pnpm` field; `pnpm install --force` was required to re-resolve since adding an override does not invalidate pnpm's "up to date" check.

**Why:** Yesterday's image migration set `imageService: 'compile'` + added `sharp`. `pnpm build` passed (prerendering runs in Node, where Sharp's native CommonJS module loads), but `pnpm dev` crashed at startup with `module is not defined` — `@astrojs/cloudflare` v13 runs the dev server inside `workerd` (via `@cloudflare/vite-plugin`), an ESM-only runtime with no CommonJS `module` global, and the adapter externalizes Sharp only for the build bundle, not the dev server. `passthrough` in dev serves unoptimized originals (no Sharp in workerd) while build keeps full Sharp optimization. The `ws` advisory noted in the 2026-05-29 entry is now resolved along with the `devalue`/`yaml` ones surfaced by `pnpm audit`.

**Verified:** `pnpm dev` starts clean (no crash, `passthrough` active); `pnpm build` clean with `_astro/*.webp` variants (compile/Sharp still optimizes); `pnpm audit` → "No known vulnerabilities found" (was 1 high + 2 moderate); `astro check` → 0 errors/warnings/hints.

**Note:** The `overrides` are pinned floors — revisit and remove once `astro`, `@cloudflare/vite-plugin`, and `@astrojs/check` ship the patched versions upstream so they don't hold back future resolutions.

---

**Date:** 2026-05-29
**Branch:** `perf/astro-image-migration`
**Change:** Migrate images to `src/assets` and optimize with `astro:assets`

**Files touched:** `astro.config.mjs`, `package.json`, `src/types/index.ts`, `src/data/jobRoles.ts`, `src/components/ProjectCard.astro`, `src/components/ImageGallery.astro`, `src/components/LeftPanel.astro`, `src/pages/index.astro`, `src/pages/projects/[slug].astro`, moved `public/profile-pic.jpg` + `public/projects/**` → `src/assets/**`

**What changed:** Moved the profile photo and all project images out of `public/` into `src/assets/` so Astro can process them. Added `sharp` (dev dependency) and set the Cloudflare adapter's `imageService: 'compile'` — the v13 default is `cloudflare-binding` (runtime transformation via a binding), which does nothing for a fully prerendered site; `compile` runs Sharp at build time for prerendered routes. Changed `BaseEntry.images` from `string[]` to `ImageMetadata[]` and switched `jobRoles.ts` to import each image as a module. Converted the rendered images to `<Picture>` with `formats={['avif','webp']}` and responsive `widths`/`sizes`: the ProjectCard hero (LCP image keeps `loading="eager"` + `fetchpriority="high"`), both profile placements (LeftPanel sticky + index mobile header), and the ImageGallery thumbnail strip. The gallery's fullscreen slideshow swaps `img.src` from client JS, so its sources are pre-generated with `getImage({ format: 'webp', width: 1600 })` and the optimized URLs are passed through `data-images`. Updated `ogImage` in `[slug].astro` to use `images[0].src`. Favicons and `og-default.jpg` stay in `public/` (stable crawler-facing URLs). `MasonryGallery.astro` is unused dead code and was left as-is.

**Why:** Every image was a raw `<img>` pointing at an unoptimized JPEG in `public/`, served at full resolution behind a grayscale-hover effect. Importing them as modules lets Astro emit AVIF/WebP at multiple widths with intrinsic dimensions — verified in `dist/`: e.g. `homepage.jpg` (113kB) now also emits a 20kB WebP / 41kB AVIF, and `<img>` tags carry `width`/`height` to eliminate CLS. Build (`imageService: 'compile'`) confirmed Sharp optimizes at build time with no runtime binding required.

**Note:** `pnpm audit` reports 2 advisories (1 high, 1 moderate) in `ws`, pulled transitively through the Cloudflare adapter's dev tooling (`@cloudflare/vite-plugin > miniflare > ws`). Pre-existing, dev-only, not introduced by `sharp` and not in the shipped output.

---

**Date:** 2026-05-29
**Branch:** `refactor/extract-shared-components`
**Change:** Extract shared components, tokenize CartDrawer, centralize cart-drawer trigger

**Files touched:** `src/components/TechBadge.astro` (new), `src/components/ContactButton.astro` (new), `src/components/StatusBadge.astro` (new), `src/components/AvailabilityBadge.astro` (new), `src/components/EntryNavLink.astro` (new), `src/components/LeftPanel.astro`, `src/components/TopNav.astro`, `src/components/ProjectCard.astro`, `src/components/CartDrawer.tsx`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/archive.astro`, `src/pages/projects/[slug].astro`, `src/styles/global.css`, `src/types/index.ts`

**What changed:** Extracted five presentational components to remove repeated markup: `TechBadge` (with `panel`/`hero`/`table` variants matching the three call sites that had intentionally different weights), `ContactButton` (`sm`/`lg`), `StatusBadge`, `AvailabilityBadge` (now owns the `getCurrentQuarterLabel()` script that updates `[data-availability-label]`), and `EntryNavLink` (prev/next). Centralized the contact-drawer trigger: any element with a `data-open-cart` attribute now opens the drawer via a single delegated `click` listener in `Layout.astro`, replacing three duplicated per-component dispatch scripts (TopNav, LeftPanel, `[slug]`). Collapsed LeftPanel's four near-identical bento nav cells into a `.map()` over a `navCells` config (the marquee/label/title CSS stays in LeftPanel because the hover effects are scoped selectors on `.nav-cell`). Tokenized `CartDrawer.tsx` — swapped arbitrary hex utilities (`border-[#111111]`, `text-[#888888]`, `text-[#222222]`, `bg-[#111111]`, `bg-white`, `text-white`) for the `@theme` token utilities and replaced inline `fontFamily` styles with `font-mono`/`font-display`. Added `--color-surface-container-highest: #e7dfd6` and pointed ProjectCard's hover at it. Exported `BaseEntry` from `src/types/index.ts` and standardized touched files onto the `@/` import alias.

**Why:** The same Tailwind class strings (tech badges, contact button, status dot, availability chip) were copy-pasted across pages and components, and three separate scripts dispatched the same `open-cart-drawer` event. Extracting typed primitives and a single delegated trigger removes the duplication and a hidden coupling where the home page relied on LeftPanel's global script to set its availability label. No visual or behavioural change — verified via `astro check` (0 errors), ESLint, a clean `pnpm build`, and HTML diffing of the prerendered output (badge/button classes render byte-identical).

---

**Date:** 2026-05-29
**Branch:** `style/slug-single-column-layout`
**Change:** Convert project detail to single-column Layout + rebuild gallery

**Files touched:** `src/pages/projects/[slug].astro`, `src/components/ImageGallery.astro`, `src/layouts/Layout.astro`, `src/styles/global.css`, `CLAUDE.md`, `DESIGN.md`

**What changed:** Converted `projects/[slug].astro` from a standalone `<!doctype html>` document into a `Layout.astro` consumer (`activePage="project"`), so it inherits the sticky LeftPanel at ≥1000px, native body scroll, and shared head/SEO/CartDrawer. Removed the old 50/50 split, the inner accordion scroll container, and the grid-rows pinned-CTA footer — content now flows as a single column (hero → gallery → accordions → CTA → footer nav). Rebuilt `ImageGallery.astro` as a horizontally scrolling strip of fixed 225×283 (`w-56.25 h-70.75`) grayscale thumbnails with a self-contained fullscreen `<dialog>` slideshow (prev/next, ←/→ keys, Esc, click-overlay-to-close); both projects and job roles now use it. `MasonryGallery.astro` is no longer wired in but is kept in the codebase for later use. In `Layout.astro`, `hideMenuItems` is now true for `activePage === 'project'` (Home/Archive hidden on the slug TopNav), and `min-w-0` was added to the right-column wrapper and `<main>` so the horizontal gallery scrolls within its column instead of widening the page. In `global.css`, `::-webkit-scrollbar` gained `height: 6px` so horizontal scrollbars match the 6px vertical bars. Updated `CLAUDE.md` and `DESIGN.md` to describe the single-column layout and the new gallery/slideshow.

**Why:** The slug page hand-rolled its own scroll model (`h-screen overflow-hidden` + inner scroll) and duplicated the layout boilerplate, which was inconsistent with the rest of the site after the body-scroll migration. A single-column layout sharing `Layout.astro` removes that duplication and the CTA-pinning complexity, and the horizontal gallery + slideshow reads more cleanly in one column than the former 50/50 split.

---

**Date:** 2026-05-29
**Branch:** `style/slug-single-column-layout`
**Change:** Refine mobile brand-header spacing on the lookbook

**Files touched:** `src/pages/index.astro`

**What changed:** Adjusted the `<1000px` brand-header block on the lookbook. Title/subtitle/availability chip are now centered in a flex column with a shared `min-[670px]:max-w-76` constraint; the About paragraph dropped its grid-column placement, tightened to `p-8 py-6` with `max-w-75` and `leading-9`. No behavioural change — layout/spacing only.

**Why:** The mobile header read unevenly — the title column and About paragraph used mismatched widths and spacing. Aligning their max-widths and centering produces a more balanced stacked header below the desktop breakpoint.

---

**Date:** 2026-05-29
**Branch:** `style/slug-single-column-layout`
**Change:** Render multi-paragraph content in Accordion via `parseParagraphs`

**Files touched:** `src/lib/parseParagraphs.ts`, `src/components/Accordion.astro`, `src/types/index.ts`, `src/data/jobRoles.ts`

**What changed:** Added `src/lib/parseParagraphs.ts`, a utility that normalizes content (literal `\n`/`\r` escapes, `<br>` tags, CRLF) and splits on blank lines into an array of paragraphs. `Accordion.astro` now accepts an optional `content: string | string[]` prop and, when provided, renders the parsed paragraphs (with optional single-newline-to-`<br>` conversion) instead of the default slot. Widened `description`/`challenge`/`architecture`/`results`/`responsibilities`/`technologies` in `src/types/index.ts` to `string | string[]`, and converted the three long job-role descriptions in `jobRoles.ts` from single `\n`-delimited strings into clean paragraph arrays.

**Why:** The job-role descriptions were single strings with embedded `\n` separators that rendered as one undifferentiated block. Parsing into discrete `<p>` elements gives proper paragraph spacing and lets content authors write either a string or an array without changing the component.

---

**Date:** 2026-05-29
**Branch:** `refactor/body-scroll-model`
**Change:** Migrate to native body scroll + sticky LeftPanel (Option B)

**Files touched:** `src/styles/global.css`, `src/layouts/Layout.astro`, `src/components/LeftPanel.astro`

**What changed:** Removed `overflow: hidden` from `html, body` in `global.css` and changed `height: 100%` to `min-height: 100%` so the browser owns the scroll context. Body is now the natural scroll container. In `Layout.astro`, removed `h-screen overflow-hidden` from `<body>`, removed `h-full min-h-0` from the right-panel wrapper div, and removed `overflow-y-auto` from `<main>`. In `LeftPanel.astro`, switched from `min-[1000px]:static` to `min-[1000px]:sticky min-[1000px]:top-0 min-[1000px]:h-screen` so the panel floats in place while the right column scrolls. Kept `min-[1000px]:overflow-y-auto` on LeftPanel as a safety valve for small viewports. Mobile drawer behaviour (fixed off-canvas) is unchanged.

**Why:** The previous model broke iOS Safari tap-status-bar-scroll-to-top, `window.scrollY`, and browser scroll restoration on back-nav because `<main>` was the only scroll container rather than `<body>`. The slug page (`projects/[slug].astro`) still uses its own scroll model — deferred to a separate session.

---

**Date:** 2026-05-27  
**Branch:** `docs/sync-design-md`  
**Change:** Sync `DESIGN.md` with the implemented site

**Files touched:** `DESIGN.md`

**What changed:** Rewrote `DESIGN.md` to reflect the actual build rather than the pre-build spec. Drift fixed across ~10 sections — frontmatter brand name rebranded (`The Commerce Boutique` → `Jordan A.F.`), frontmatter color palette pruned from ~50 Material-3 tokens down to the 8 in `global.css`, body typography section corrected (`Instrument Serif` / `Switzer` → `Newsreader` / `Work Sans` / `Space Grotesk`), Design Tokens CSS block updated with real custom-property names, Key Flows rewritten (no more "Add to Cart — Hire Me" → "Proceed to Checkout" flow; the Cart Drawer is now correctly described as the entire contact path), Lookbook screen spec rewritten to describe brand-header + 2×2 bento nav + dynamic-quarter availability chip, Product Detail spec captures the full-width hero + grid-rows sticky CTA, Cart Drawer spec fully rewritten with current field list (Company Name / Project Details / Contact Email), header copy, success state, and "discounts applied at checkout" microcopy. Build Guide step 4 no longer references the un-built standalone Checkout page. New "Implemented but not in original spec" section captures the skip-link, SEOHead component, marquee hover, dynamic-quarter helper, slideshow modal, TopNav active-page indicator, and image fetch-priority pattern. Added an "as-of 2026-05-27" timestamp at the top.

**Why:** the doc had drifted enough that it no longer functioned as a working reference — recruiters / future contributors reading source material would get conflicting copy (font names disagreed between frontmatter and body; flow descriptions referenced buttons that don't exist). Plan for the sync is in `~/.claude/plans/drifting-conjuring-wren.md` for retroactive context.

---

**Date:** 2026-05-27  
**Branch:** `main`  
**Commit:** (pending)  
**Change:** Layout refinement — sticky CTA + Footer Nav on project detail pages

**Files touched:** `src/pages/projects/[slug].astro`

**What changed:** Project detail right column now uses CSS Grid (`grid-rows-[1fr_auto]`) to pin the CTA button and prev/next footer navigation to the bottom of the viewport. The Accordions region above fills available space and scrolls independently, keeping primary CTAs visible as readers browse accordion content. Previously the entire right column scrolled as one unit, causing the CTA to disappear below the fold.

**Why:** Improves discoverability of the "Get In Touch" / "Contact Me →" buttons. On longer projects with expanded accordion sections, users no longer need to scroll back to the bottom to see the call-to-action.

**How it works:**

- Right column parent: `grid grid-rows-[1fr_auto] overflow-hidden`
- Scrollable accordions row: `overflow-y-auto min-h-0` (the `min-h-0` is critical — it allows the row to shrink below its content height and trigger internal scroll)
- Pinned CTA + footer row: `border-t border-primary` (intrinsic height via CSS Grid's `auto` track)

Tested on project and job-role detail pages; layout applies at all breakpoints.

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

### content: cart drawer microcopy leans into the metaphor

Replaced the closing microcopy under the PLACE ORDER button. Was: "Final scoping and legal contract will follow upon acceptance." Now: "apply discounts at checkout".

**Files:**

- `src/components/CartDrawer.tsx` — single string change.

Why: the cart-drawer-as-contact-form gag is what makes the contact UX feel native to a Shopify-focused portfolio. The previous microcopy broke character (legal-engagement vocabulary in what's pretending to be a checkout). The new line keeps the gag intact — it's literal Shopify cart copy ("Add discount code or gift card") repurposed as a wink that doubles as a soft commercial nudge: rates are negotiable, let's talk.

---

## Session Update - 2026-05-27

### fix: eliminate 8px gray bar at right edge of viewport (cart drawer shadow bleed)

A faint ~8px light-gray vertical bar was visible at the viewport's right edge on every page, with the custom `<main>` scrollbar (4px dark thumb on white track) visually overlaid on top of it. Root cause was the CartDrawer's left-side box-shadow leaking into the viewport when the drawer was closed.

**Root cause:**

`src/components/CartDrawer.tsx` line 70 declares an inline `box-shadow: -8px 0 0 0 rgba(17,17,17,0.08)` on the drawer `<aside>`. The `<aside>` is `position: fixed; right: 0; width: 480px` and translates off-screen with `translate-x-full` when closed — putting its left edge precisely at the viewport's right edge. The `-8px` x-offset shadow then paints 8px _to the left_ of that edge, i.e. 8px into the visible viewport. Because the `<aside>` is fixed-positioned, ancestor `overflow: hidden` on `<html>`/`<body>` does not clip it — fixed descendants escape ancestor overflow clipping entirely.

**Fix:**

- `src/components/CartDrawer.tsx`:
  - Replaced the sharp shadow `-8px 0 0 0 rgba(17,17,17,0.08)` with a properly blurred soft fade: `-8px 0 24px -4px rgba(17,17,17,0.18)`. The original had zero blur and zero spread, so it painted as a flat solid bar; the new values give the open drawer a true gaussian-fade shadow on the page content behind it.
  - When closed, translate the drawer to `translate-x-[calc(100%+32px)]` instead of `translate-x-full`. The 32px buffer covers the new shadow's visible extent (`|offset| + blur + max(spread, 0)` ≈ 8 + 24 + 0 = 32px), so the entire shadow now lives off-screen when the drawer is closed.

Chose the translate-buffer approach over a conditional `boxShadow` style (e.g. `boxShadow: isOpen ? ... : 'none'`) because it keeps the shadow declaration unconditional and stateless. The transform animation is already GPU-composited via `transition-transform`, so no perf cost; no branching to reason about; and the shadow precedes the drawer's edge by a few ms during opening, which is physically accurate.

**Tangential cleanup applied while diagnosing:**

- `src/styles/global.css` — removed the `.hard-shadow-canvas` utility (`box-shadow: 8px 0 0 0 rgba(17,17,17,0.1)`).
- `src/layouts/Layout.astro` — removed `hard-shadow-canvas` from the right-panel wrapper.

The `.hard-shadow-canvas` utility was applied to wrappers whose right edge always sat exactly at the viewport boundary, so its 8px-rightward shadow had nowhere useful to render — invisible by design but consuming a class slot and adding noise to the cascade. Removing it is correct on its own merits, but it was _not_ the source of the gray bar (initial misdiagnosis). The bar persisted after removal, which is what led to inspecting fixed-positioned descendants and finding the CartDrawer shadow.

Why this matters: any `position: fixed` element near a viewport edge with an outset shadow can bleed shadow into the viewport. This is the second time this pattern has bitten this codebase (first was `.hard-shadow-canvas` on the right panel wrapper — same shape, different mechanism). Worth a project note: outset shadows on edge-adjacent elements need either inset offsets, conditional rendering, or a translate buffer.

### style: project detail — promote hero out of 50/50 split, relocate gallery grid into left column

The project detail page had the hero (title + description + tech pills) buried inside the right scrollable column. That meant the title only rendered once a reader's eye had already crossed the gallery to reach the right half — the page's most important piece of content was structurally subordinate to the gallery. Reworked the layout so the hero is now a full-width row directly under `TopNav`, with the 50/50 image-gallery + accordion split happening beneath it.

**Files:**

- `src/pages/projects/[slug].astro`:
  - `<body>` background `bg-background` → `bg-surface` so the new full-width hero sits on the same canvas color as the content below it (no horizontal seam between hero and panels).
  - **Hero promoted out of the split:** moved out of the right column into its own row above the 50/50 container. Typography upgraded to match: `text-4xl leading-tight mb-6` → `text-5xl leading-none mb-6 max-w-125`; tech pills now also capped at `max-w-125` so the row reads as a single column of meta-info.
  - **Project Gallery grid relocated into the left column** (below `ImageGallery` / `MasonryGallery`) instead of below the accordions in the right column. The gallery is visual; the right column is now exclusively the textual case-study read (accordions → CTA). Cleaner separation of imagery vs reading.
  - Right column simplified — only accordions + CTA now. (The `hard-shadow-canvas` class was also removed during this restructure; coincidentally matches the utility-deletion in this session's fix commit.)
  - Stubbed a commented-out prev/next footer-nav block in the header area for future use.

### style: archive — header alignment with brand baseline, footer cleanup

Two distinct polish passes on `/archive`:

- **Header now baseline-aligned with the LeftPanel brand cell.** Padding `p-7` → `p-8`, min-height `min-h-27` → `min-h-37`, added `flex items-center` so vertical centering is explicit. Heading is now responsive: `text-4xl` at mobile, `text-5xl` at 540px+, `text-center` below 1000px and `text-left` at 1000px+. Added `translate-y-0.5` for sub-pixel baseline nudge against the LeftPanel `<h1>`.
- **Footer simplified.** `p-12 border-t border-primary` → `p-6` (no border). Copyright text updated from "The Commerce Boutique" → "JordanAF-Dev" to match the brand transition.

Also: re-indented the entire page body by +2 spaces to match the `flex flex-col min-h-full` wrapper introduced in a prior session (was previously dedented).

### content: bio copy revisions + tech stack updates

Refining the at-a-glance signals the portfolio sends about role and tooling.

**Bio copy:**

- `src/components/LeftPanel.astro` — "Shopify **and** JavaScript developer with 5+ years" → "Shopify **/** JavaScript developer with **over** 5 years". The slash reads as a credential combo (more concise than "and"), and "over 5 years" hedges the precise number gracefully as the count creeps up.
- `src/pages/index.astro` — same Shopify-and → Shopify-slash edit on the mobile brand header. Restructured into two sentences ("...monthly visitors. I focus on...") instead of one long run-on. Style refresh: `text-muted` → `text-text font-mono text-justify` — the mobile bio now reads as a typewritten dossier instead of a soft caption. Removed `pr-5.5` since the new font-mono setting reflows the line lengths.
- `src/pages/index.astro` — "Selected Work" `<h2>` got a `translate-y-0.5` baseline nudge to match the archive header treatment.

**Tech stack:**

- `src/components/LeftPanel.astro` — tech-tag chips expanded from `[TypeScript, React, Liquid, Shopify]` to `[Shopify Plus, Liquid, JS, TypeScript, React, Next]`. Promotes Shopify to "Shopify Plus" (clearer enterprise signal), surfaces vanilla JS alongside TS, and adds Next.js. Order intentionally puts the eCommerce stack first.
- `src/data/jobRoles.ts`:
  - **Simplehuman:** dropped `Storefront API, CSS`, added `Rest API, SCSS`. Aligns with the actual integration work (REST endpoints rather than the Storefront GraphQL API) and the actual style preprocessor used on the project.
  - **True Classic:** expanded `[Shopify Plus, Liquid, JS, React, Figma, Cursor, Devin]` to also include `REST API, HTML, SCSS, GraphQL`. The original list undersold the breadth of integration and styling work on the role.

### style: assorted polish — TopNav hover underline, skip-link, CartDrawer heading, scrollbar revert

Five micro-tweaks rolled into one entry:

- `src/components/TopNav.astro` — added `underline-offset-4 hover:underline` to the BASE nav-link class. Home/Archive links now show a hover underline (offset 4px) for a clearer affordance — previously only the active link had any visual treatment.
- `src/layouts/Layout.astro` — skip link text "Skip to work" → "Skip to main". "Main" matches the `id="main"` anchor target and is the conventional WAI-ARIA wording; "work" was project-specific and ambiguous.
- `src/components/CartDrawer.tsx`:
  - Drawer heading "Contact" sized up: `text-2xl leading-6 mt-2` → `text-4xl leading-8 mt-4`. The previous size felt underweight against the drawer's wide column; the new size matches the visual scale of the rest of the brand-side headings.
  - Microcopy under PLACE ORDER: "apply discounts at checkout" → "discounts applied at checkout". Imperative→indicative phrasing reads as a Shopify line-item helper (descriptive) rather than a CTA, which fits the cart-as-passive-context metaphor better.
- `src/styles/global.css` — reverted scrollbar track color from `var(--color-surface-container-low)` back to `white`. The faint-tracked variant from the 2026-05-26 entry showed up as an unintended vertical bar on every page with a white main; reverting kills that. Added a commented-out `.scroll-track-gray::-webkit-scrollbar-track { background: var(--color-surface-container-low) }` rule so individual scroll containers can opt into the visible-track styling on a per-element basis without bringing back the global bar.
- `src/components/MasonryGallery.astro` — opted the masonry gallery into the new (commented-out, but ready) `.scroll-track-gray` class. When that rule is uncommented in `global.css`, the gallery alone gets the faint visible track without affecting `<main>` or any other scroll container.

---

## Session Update - 2026-05-28

### Parse Paragraphs

**What changed:** Extracted paragraph parsing into parseParagraphs.ts; `Accordion` now accepts `content` as `string | string[]` and renders semantic paragraphs with optional single-line breaks. Types updated to accept arrays for long-form fields and several job role descriptions converted to paragraph arrays. SEO/hero content now uses the first paragraph for concise meta text.

**Files touched:** src/lib/parseParagraphs.ts, src/components/Accordion.astro, src/types/index.ts, src/pages/projects/[slug].astro, jobRoles.ts

**Why:** Ensure consistent, semantic paragraph rendering and make content easier to author.

### JAF DEV Logo

Create logo for JAF DEV

nanobanana had ok results, canva had horrible options, and chatgpt came up with a decent direction after some prompting.

ended up with a isometric block-style version

#### Update favicon

replace Astro favicon.ico with new logo using 3 different png sizes.

---
