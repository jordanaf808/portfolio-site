---
name: Jordan A.F. — Shopify & JS/TS Developer
brand_history: Originally scoped as "The Commerce Boutique"; rebranded toward personal identity during build.
colors:
  primary: '#111111'
  background: '#f4f4f0'
  surface: '#ffffff'
  text: '#222222'
  muted: '#888888'
  accent-taupe: '#c8b6a6'
  surface-container-high: '#efefeb'
  surface-container-low: '#f9f9f7'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 40-48px
    fontWeight: '400'
    lineHeight: '1.1-1.25'
    fontStyle: italic
  display-md:
    fontFamily: Newsreader
    fontSize: 24-32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-main:
    fontFamily: Work Sans
    fontSize: 15-16px
    fontWeight: '400'
    lineHeight: '1.5-1.6'
  label-mono:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0.1em-0.15em
    textTransform: uppercase
  button-text:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0.15em
    textTransform: uppercase
spacing:
  container-padding: 24-48px (varies per surface)
  bento-gap: 0px
  grid-split: 40/60 across all pages (LeftPanel + right surface); project detail is single-column within the right surface
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

# Jordan A.F. — Portfolio Site

_Reflects the implementation as of 2026-05-27._

## Product Overview

**The Pitch:** A premium, e-commerce-inspired portfolio for a Shopify and JS/TS developer. Functions as a luxury digital lookbook where prospective clients browse projects like premium goods and "checkout" via a cart-drawer contact form.

**For:** Creative agencies, fashion / luxury brands, and high-growth eCommerce companies seeking Shopify Plus architecture and CRO-driven feature work.

**Device:** Desktop-primary, fully responsive down to ~390px.

**Design Direction:** A minimalist, architectural bento-box layout with thin dark borders, off-white backgrounds, and editorial typography. Translates the tactile, high-end feel of luxury physical retail into a digital developer portfolio. Zero border radius everywhere is intentional.

**Inspired by:** SSENSE, Aime Leon Dore, minimal editorial lookbooks.

---

## Screens

- **Lookbook (Home / `/`):** Two-pane layout — LeftPanel identity grid + scrollable right-side project feed.
- **Product Detail (`/projects/[slug]`):** Hero + accordion case study, styled like a luxury product page. Renders both `type: 'project'` and `type: 'jobRole'` entries with slightly different accordion / CTA variants.
- **Archive (`/archive`):** Dense, text-heavy directory of all past work, sorted chronologically.
- **Cart Drawer (Contact):** Slide-in overlay (not a page) — the central contact UX. Triggered from multiple surfaces via a custom DOM event.

---

## Key Flows

**The Cart Drawer contact flow** (the site's primary conversion path):

1. User lands on **Lookbook (Home)** → hover any project card → image transitions from grayscale to full color, "Learn More →" overlay button reveals.
2. Click → navigate to **Product Detail**.
3. On Product Detail → click the CTA button: **"Get In Touch"** (projects) or **"Contact Me →"** (job roles) → the **Cart Drawer** slides in from the right.
4. Fill **Company Name** / **Project Details** / **Contact Email** → click **"Place Order"** → in-drawer success state ("Message Sent" + "We'll be in touch within 24 hours").

The Cart Drawer is also reachable directly from the LeftPanel "Get In Touch" bento cell and the TopNav "Contact Me" button (mobile).

---

## Design System

### Color Palette

The implementation uses 8 tokens, all defined in `src/styles/global.css` `@theme` block:

- **Primary:** `#111111` — Charcoal black; borders, primary text, solid buttons.
- **Background:** `#F4F4F0` — Alabaster off-white; main canvas (LeftPanel).
- **Surface:** `#FFFFFF` — Crisp white; right-side panel, project cards, Cart Drawer.
- **Text:** `#222222` — Near-black; primary body copy.
- **Muted:** `#888888` — Stone grey; metadata, tags, secondary labels.
- **Accent (taupe):** `#C8B6A6` — Muted taupe; hover states, archive row highlight, ::selection.
- **Surface-container-high:** `#EFEFEB` — Active-page background highlight for bento nav cells.
- **Surface-container-low:** `#F9F9F7` — Reserved for subtle container variants (currently unused but defined).

### Typography

Editorial pairing — Newsreader (italic display) + Work Sans (body) + Space Grotesk (mono labels). Note that the original spec referenced Instrument Serif / Switzer / Switzer Mono; the implementation settled on the Google-Fonts-served stack below.

- **Headings:** `Newsreader`, 400 italic & regular, 24-48px range. h1 in LeftPanel: 40px / 50px line height. h1 in project detail hero: ~48px (`text-5xl`).
- **Body:** `Work Sans`, 400, 15-16px, 150-160% line-height.
- **Small text:** `Space Grotesk`, 400, 12px, uppercase, `0.1em` to `0.15em` letter-spacing.
- **Buttons:** `Space Grotesk`, 400, 12px, uppercase, `0.15em` letter-spacing.

**Style notes:** Zero border radius everywhere. Sharp corners. 1px solid `#111111` borders divide every surface — bento nav cells, table rows, drawer header, etc. The right panel has a `8px 0 0 rgba(17,17,17,0.1)` un-blurred hard shadow (offset only, no blur — the `.hard-shadow-canvas` utility). The Cart Drawer specifically uses a blurred `-8px 0 24px -4px rgba(17,17,17,0.18)` since it slides over content rather than anchoring beside it.

### Design Tokens

```css
@theme {
	--color-primary: #111111;
	--color-background: #f4f4f0;
	--color-surface: #ffffff;
	--color-text: #222222;
	--color-muted: #888888;
	--color-accent-taupe: #c8b6a6;
	--color-surface-container-high: #efefeb;
	--color-surface-container-low: #f9f9f7;
	--font-display: 'Newsreader', Georgia, serif;
	--font-body: 'Work Sans', system-ui, sans-serif;
	--font-mono: 'Space Grotesk', monospace;
	--radius: 0;
	--radius-sm: 0;
	--radius-md: 0;
	--radius-lg: 0;
}
```

**Utilities (defined in `global.css`):**

- `.hard-shadow` — `box-shadow: 8px 8px 0 rgba(17,17,17,0.1)` (offset both axes).
- `.hard-shadow-canvas` — `box-shadow: 8px 0 0 rgba(17,17,17,0.1)` (right-panel left-edge shadow).
- `.grayscale-hover` — `filter: grayscale(100%)` → `0%` on hover, 400ms transition. Applied to project images, profile photo, archive thumbnails.
- `.skip-link` — keyboard-only "Skip to work" link; reveals on `:focus-visible`.

---

## Screen Specifications

### Lookbook (Home)

**Purpose:** Primary landing experience. Establishes identity, technical positioning, availability, and surfaces the project feed.

**Layout:** 40/60 split at ≥1000px (`grid-cols-[500px_1fr]`). Left 500px is a fixed `<aside>` (LeftPanel); right column is the scrollable `<main>`. Below 1000px the LeftPanel collapses into a slide-in drawer accessed via the TopNav hamburger; the index page renders its own brand header inline for mobile.

**Key Elements:**

- **LeftPanel** (top → bottom):
  - **Brand header:** Newsreader italic `<h1>Jordan A.F.</h1>` (40px / 50px leading), mono uppercase tagline "SHOPIFY & JS/TS DEVELOPMENT", availability chip (green status dot + mono label "AVAILABLE Q3 2026"). The quarter label is recomputed at runtime by `getCurrentQuarterLabel()` in `src/utils/date.ts` and applied to every `[data-availability-label]` element.
  - **Profile photo** (desktop only) — grayscale-hover treated.
  - **Bio paragraph** — Work Sans 16px, `text-text` (darker than muted), `leading-8`, hanging-indent first line.
  - **2×2 bento nav** — Portfolio (Selected Work) / Archive (All Projects) / Services (What I Do) / Contact (Get In Touch). Each cell shows a marquee text reveal on hover (italic Newsreader 96px scrolling horizontally in low-opacity white).
  - **Tech tag pills** — `Shopify Plus / Liquid / JS / TypeScript / React / Next`, mono uppercase 12px with 1px border boxes.
- **Right panel (`<main>`)** — `.hard-shadow-canvas` 8px left-edge shadow; vertical scroll.
- **Section header** — Newsreader italic "Selected Work", `min-h-37`, baseline-aligns with the LeftPanel brand header.
- **Project Cards** — `aspect-[16/10]` full-width image with `grayscale-hover`. Title (Newsreader 3xl) + subtitle (mono uppercase) in card header; status pill + year right-aligned; numeric counter (`001` … `004`) in bottom-right of image. Hover reveals "Learn More →" overlay (white-on-dark pill, centered).

**States:**

- **Loading:** Standard Astro static page; no custom skeleton.
- **Error:** N/A for the static index.

**Interactions:**

- Hover Project Card: 400ms grayscale → color transition, "Learn More →" overlay fades in.
- Scroll Right Panel: native scroll; LeftPanel stays fixed at ≥1000px.
- Mobile (<1000px): hamburger toggles LeftPanel drawer with backdrop; Escape closes.

---

### Product Detail (Project / Job Role)

**Purpose:** Editorial case study deep-dive. Renders both `type: 'project'` and `type: 'jobRole'` entries from `src/data/projects.ts` / `src/data/jobRoles.ts`.

**Layout:**

- **Full-width hero (top):** project title (Newsreader text-5xl ≈ 48px), description paragraph (for projects only), tech tag pills.
- **Body:** Single-column content flow in the right surface (consumes `Layout.astro`, so the LeftPanel is sticky at ≥1000px and the page uses native body scroll). Below the hero, content stacks in order: gallery → accordions → CTA → footer nav.
  - **Gallery:** `ImageGallery.astro` — a horizontally scrolling strip of fixed 225×283 thumbnails (grayscale-by-default), used for both projects and job roles. Clicking a thumbnail opens a self-contained fullscreen `<dialog>` slideshow (prev/next, arrow keys, Esc, click-overlay-to-close).
  - **Content:** Accordions, then the CTA block (button + Technical Architecture table for projects), then prev/next footer nav — all flowing naturally in body scroll (no inner scroll container, no pinned CTA). `MasonryGallery.astro` remains in the codebase but is no longer wired into this page.

**Accordion variants:**

- **Project** (`type: 'project'`): The Challenge → The Architecture → The Results.
- **Job Role** (`type: 'jobRole'`): Overview → Responsibilities → Technologies (last two optional, only render if data present).
- Implementation: native `<details>`/`<summary>` (no JS), with `group-open:rotate-45` on the `+` icon.

**CTA region (pinned bottom):**

- **Project:** A 2-column grid — left column is a "Get In Touch" button; right column is a "Technical Architecture" spec block listing Frontend / Commerce / Animation / Infra rows.
- **Job Role:** Full-width "Contact Me →" button (no spec block).
- Below the CTA: a thin footer-nav row with prev/next project links.

**States:**

- **Loading:** Standard Astro static prerender; no skeleton.

**Interactions:**

- Click CTA: dispatches `open-cart-drawer` event → Cart Drawer slides in.
- Job Role only: click any image in the MasonryGallery → fullscreen `<dialog>` slideshow opens with prev/next buttons and arrow-key navigation; Escape or backdrop click closes.

---

### Cart Drawer (Contact)

**Purpose:** The site's only contact UX, styled as a Shopify cart drawer. Doubles as a brand metaphor (your work is the "product"; engagement is the "checkout").

**Layout:** Fixed right-side overlay drawer. **480px wide** on desktop (`w-[480px] max-w-full`). Slides in via `translate-x` transition (300ms). Backdrop is `bg-black/20`. Drawer shadow is `-8px 0 24px -4px rgba(17,17,17,0.18)` (blurred, since it floats over content).

**Header:**

- Top label: "REQUEST ENGAGEMENT" (Space Grotesk mono, uppercase, muted).
- Heading: "Contact" (Newsreader, ~36px).
- Top-right close button: "Close ✕".
- 1px charcoal bottom border.

**Order summary block:** A "cart line item" framed by a 1px charcoal border with an 8px hard-shadow.

- Header row: `Item` / `Qty` (mono, uppercase, muted).
- Body row: **Freelance Developer Engagement** (Newsreader sm) + "Specialized Shopify & JS/TS Services" (mono muted subtitle) / `1×`.

**Form fields:**

- **Company Name** (text input, required).
- **Project Details** (textarea, 4 rows, required).
- **Contact Email** (email input, required).
- Each label is static above its input (mono uppercase, muted). Each input is an underline-only style — transparent bg, 1px charcoal bottom border, no left/right/top borders. Focus thickens the bottom border to 2px.

**Submit:**

- **"Place Order"** button — full-width, primary (`#111111`) bg, white text, mono uppercase, 1px letter-spacing, ~16px vertical padding.
- Loading state: button text becomes "Sending…", disabled, opacity-50.
- Below button microcopy: **"discounts applied at checkout"** — mono, muted, centered. Plays on the cart metaphor; also a soft signal that rates are negotiable.

**Success state:**

- Form replaced by an in-drawer message — **"Message Sent"** (Newsreader 3xl) + "We'll be in touch within 24 hours." (mono, uppercase, muted).
- Drawer remains open; the user closes it manually.

**Error states:**

- Inline error text below the form fields, red (`text-red-600`), mono.
- Server-side validation messages come from `/api/contact`; client-side network errors show "Network error — please try again."

**Interactions:**

- **Open:** any element dispatching the custom `open-cart-drawer` event (TopNav button, LeftPanel "Get In Touch" cell, Product Detail CTA).
- **Submit:** POST to `/api/contact` (the only SSR endpoint), which validates inputs server-side per `.claude/rules/security.md` and calls Resend.
- **Close:** × button, backdrop click, or Escape key.
- **Double-submit prevention:** button disables while `status === 'loading'`.

---

### Archive (Index)

**Purpose:** Dense chronological directory of every project + job role.

**Layout:** Full-width table. Header row above; rows sorted by `year` descending (most recent first).

**Columns:** Year | Project (title + category) | Client (hidden <md) | Tech (hidden <lg) | Link.

**Typography:** Mixed — project titles in **font-display (Newsreader)** at `text-lg`; year / category subtitle / client / tech / link all in **font-mono (Space Grotesk)** at 12px. The serif titles give the table editorial weight rather than pure database flatness.

**Row styling:**

- 1px solid `#111111` bottom border (`border-primary`).
- Entire row clickable via `onclick="window.location.href='/projects/...'"`.
- Hover: `bg-accent-taupe/30` with 300ms color transition.

**Header:**

- "Archive" h2 — Newsreader italic, `text-4xl` (`text-5xl` at ≥540px), centered <1000px / left-aligned ≥1000px. Container is `min-h-37` flex-items-center so its baseline aligns with the LeftPanel brand header.

**Interactions:**

- Hover row: taupe wash, cursor changes to pointer (no custom cursor icon).
- Click anywhere on row: navigates to project detail.

---

## Build Guide

**Build Order (as built, for reference / onboarding):**

1. **Design System & Layout Wrapper:** `global.css` tokens, font loading via Google Fonts `<link>`, grid scaffolding in `Layout.astro` (`grid-cols-[500px_1fr]`), `hard-shadow-canvas` utility.
2. **Lookbook (Home):** LeftPanel bento + scrollable right surface + project feed via `ProjectCard.astro`.
3. **Project Detail:** Consumes `Layout.astro` — single-column hero + horizontal `ImageGallery` (click-to-slideshow) + accordions + CTA + footer nav, all in native body scroll.
4. **Cart Drawer (Contact):** React island (`client:load`), custom `open-cart-drawer` event listener, Resend integration via `/api/contact` SSR endpoint, success-state rendering in-drawer.
5. **Archive:** Dense table with row-level hover + click-anywhere navigation.

---

## Implemented but not in original spec

These landed during build / iteration and are worth capturing here for future contributors:

- **Skip-to-work link** — first focusable element on every page (rendered in `Layout.astro` as the first child of `<body>`); jumps to `<main id="main">` on keyboard focus. WCAG 2.1 Bypass Blocks. Hidden off-screen until `:focus-visible`.
- **SEOHead component** — `src/components/SEOHead.astro` centralizes `<title>`, meta description, canonical link, full Open Graph block, and Twitter `summary_large_image` card. Used by `Layout.astro`, which now wraps every page including `pages/projects/[slug].astro`. Single source of truth for all per-page metadata.
- **Marquee hover animation** — bento nav cells (in LeftPanel) show a horizontally scrolling italic Newsreader text ("Selected Work / All Projects / What I Do / Get In Touch") at low opacity on hover. Pure CSS `@keyframes` driven; `aria-hidden` on the decorative track.
- **Dynamic availability quarter** — `getCurrentQuarterLabel()` in `src/utils/date.ts` returns the current quarter as a `"Q2 2026"` string. The inline script in `LeftPanel.astro` rewrites the text content of every `[data-availability-label]` element on page load.
- **Slideshow modal** — a native `<dialog>` self-contained inside `ImageGallery.astro` on all Product Detail pages. Clicking any thumbnail in the horizontal gallery opens a fullscreen lightbox; prev/next buttons + arrow-key navigation; Escape, overlay click, or the Close button dismiss it.
- **TopNav active-page indicator** — on mobile, TopNav reflects the `activePage` prop so the Home / Archive links show the active-link underline on `/projects/[slug]` pages.
- **Project image fetch priorities** — `ProjectCard.astro` uses `loading="eager" fetchpriority="high"` for the first card (LCP candidate) and `loading="lazy" fetchpriority="auto"` for subsequent cards; all use `decoding="async"`.

---
