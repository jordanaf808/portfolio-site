# UI/UX Improvements Plan

Source: UI/UX review conducted 2026-05-26 against `localhost:4321` on branch `style/mobile-index-layout`. Findings inspected live via Chrome DevTools at 1440/768/390 viewports plus DOM/a11y tree introspection.

This plan is sequenced from **highest value / lowest risk first**. Each phase can ship as its own commit on its own branch per `.claude/rules/git-workflow.md`.

---

## Phase 1 — SEO & social metadata

**Branch:** `feat/seo-social-metadata`
**Risk:** None. Pure additive HEAD tags.
**Effort:** ~20 min.

The site currently has no `<meta name="description">`, no `og:image`, no Twitter card tags, and the homepage `<title>` is "Lookbook — The Commerce Boutique" — a recruiter googling "Jordan AF Shopify" will not see this rank, and link previews in LinkedIn/Slack/iMessage are bare.

### 1.1 Add a description + Open Graph block to `Layout.astro`

[src/layouts/Layout.astro](src/layouts/Layout.astro)

Extend the `Props` interface so each page can pass its own SEO copy with sensible defaults:

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  activePage?: 'lookbook' | 'archive' | 'project';
}
const {
  title,
  description = 'Jordan A.F. — Shopify Plus & JS/TS developer based in L.A. 5+ years building eCommerce storefronts for boutique-to-enterprise brands.',
  ogImage = '/og-default.jpg',
  activePage,
} = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site ?? 'http://localhost:4321/').toString();
---
```

Then inside `<head>`:

```html
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />

<meta property="og:type" content="website" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(ogImage, Astro.site ?? 'http://localhost:4321/').toString()} />
<meta property="og:url" content={canonical} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(ogImage, Astro.site ?? 'http://localhost:4321/').toString()} />
```

Make sure `site` is set in `astro.config.mjs` to the production URL so `Astro.site` resolves.

### 1.2 Adjust the page-specific titles

The current pattern `{title} — The Commerce Boutique` is fine for sub-pages, but the homepage gets passed `title="Lookbook"` which yields `Lookbook — The Commerce Boutique`. Replace the index call site so it reads `Jordan A.F. — Shopify & JS/TS Developer | Lookbook`. Project detail pages should already produce a good title; verify they include the project name.

### 1.3 Create `/public/og-default.jpg`

A 1200×630 image. Reuse `profile-pic.jpg` overlaid with the wordmark + tagline, or just the profile shot crop. Quick to produce.

### Acceptance
- `view-source:` on `/`, `/archive`, `/projects/true-classic` each show distinct `<title>`, `<meta name="description">`, full OG block.
- Paste each URL into the LinkedIn Post Inspector / Twitter Card Validator — link preview renders the image and copy.
- `pnpm build` clean.

---

## Phase 2 — Accessibility quick wins

**Branch:** `a11y/quick-wins`
**Risk:** Low. All additive or non-visual.
**Effort:** ~45 min.

DOM inspection found: two visible-or-hidden `<h1>` elements, two `<img src="/profile-pic.jpg">` tags rendered for breakpoint variants, no skip link, no `id` on `<main>`, marquee duplicate text exposed to the a11y tree.

### 2.1 Add a skip link

[src/layouts/Layout.astro](src/layouts/Layout.astro)

Add as the first child inside `<body>`:

```astro
<a href="#main" class="skip-link">Skip to work</a>
```

Then on the existing `<main>`:

```astro
<main id="main" class="flex-1 overflow-y-auto bg-surface">
```

CSS in [src/styles/global.css](src/styles/global.css):

```css
.skip-link {
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px 16px;
  background: var(--color-text);
  color: var(--color-background);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transform: translateY(-100%);
  transition: transform 150ms ease;
  z-index: 100;
}
.skip-link:focus-visible {
  transform: translateY(0);
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### 2.2 Mute the decorative marquee spans

[src/components/LeftPanel.astro](src/components/LeftPanel.astro) lines 57–63, 75–81, 90–96, 105–111

The marquee animation hovers in four duplicate `<span class="marquee-text">` copies. Screen readers announce all of them. Wrap each `.marquee-track` with `aria-hidden="true"` since the visible `.nav-cell-title` already carries the label:

```astro
<div class="marquee-wrap" aria-hidden="true">
  <div class="marquee-track">
    <span class="marquee-text">Selected Work</span>
    ...
  </div>
</div>
```

After this change the link's accessible name should be just "Selected Work" (or "Portfolio: Selected Work" if you want to expose both).

### 2.3 Dedupe the responsive `<h1>` and profile `<img>`

DOM contains two `<h1>Jordan A.F.</h1>` nodes — one in the LeftPanel brand header, one in another component (likely [src/components/TopNav.astro](src/components/TopNav.astro)) that is `display:none` at the active breakpoint. Same for the profile image.

Resolution path: only one `<h1>` should exist in the document at any time. Two acceptable patterns:

1. **Keep both in DOM but downgrade one to `<p class="sr-only-when-hidden">` + role="presentation"** — works, but messy.
2. **Render conditionally in the Astro frontmatter** based on a layout context, so only the active variant ships to the DOM.

Recommended: option 2. Pass an `activePage`-style prop or read viewport via CSS-only — but since the variants differ in structure not just style, the cleanest fix is to consolidate the brand header into a single block that uses CSS Grid `grid-template-areas` to rearrange itself across breakpoints, eliminating the duplicate markup entirely.

If that's a bigger refactor than this phase wants to absorb, do the minimum: identify which file ships the second `<h1>` (grep for `Jordan A.F.` across `src/components/`), convert that occurrence to `<p>` styled like an h1, and verify the DOM only contains one `<h1>` at any rendered breakpoint. Same treatment for the duplicate `<img>`.

### 2.4 Lazy-load below-the-fold project images

[src/pages/index.astro](src/pages/index.astro)

For each `<img>` in the work feed *except the first*, add `loading="lazy" decoding="async"`. Astro's `<Image />` component is even better if used here.

### Acceptance
- Tab from address bar lands on "Skip to work" link before LeftPanel content.
- DOM contains exactly one `<h1>` element at every viewport.
- Lighthouse a11y score ≥ 95 on `/` and `/projects/true-classic`.
- Marquee links announce as single labels in VoiceOver.

---

## Phase 3 — Promote the availability signal

**Branch:** `style/promote-availability`
**Risk:** Low. Visual change in one component.
**Effort:** ~15 min.

"Available Q3 2026" (dynamically updated by `getCurrentQuarterLabel()` in [src/utils/date.ts](src/utils/)) is currently the very last item in the LeftPanel at the bottom of the page — under the profile, the bio, the bento nav, and the tech tags. For a portfolio's "first 5 seconds" job, availability is one of the top three things a hiring lead wants to know.

### 3.1 Mirror availability into the top of the LeftPanel brand header

[src/components/LeftPanel.astro](src/components/LeftPanel.astro) — modify the brand header div (lines 21–28):

Add a small inline status chip beside the "Shopify & JS/TS Development" tagline:

```astro
<div class="flex items-center gap-2 mt-1">
  <p class="font-mono text-xs uppercase tracking-[0.15em] text-muted">
    Shopify & JS/TS Development
  </p>
  <span class="font-mono text-xs uppercase tracking-[0.15em] text-muted">·</span>
  <span class="flex items-center gap-1.5">
    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
    <span id="availability-label-top" class="font-mono text-xs uppercase tracking-[0.15em] text-muted">Available Q3 2026</span>
  </span>
</div>
```

Then update the existing inline script (line 143) to update *both* labels by id, or refactor into a small helper that targets `[data-availability-label]`.

Keep the existing bottom-of-panel chip too — it acts as a closing reinforcement at the end of the page.

### Acceptance
- Availability visible in the brand header above the fold at every viewport.
- Both labels stay in sync when `getCurrentQuarterLabel()` updates.
- Zero radius preserved (per CLAUDE.md constraint).

---

## Phase 4 — Mobile breakpoint polish

**Branch:** `style/mobile-fold-tightening`
**Risk:** Low-medium. Touches the layout you just refactored.
**Effort:** ~30 min.

At 390px and 768px, the profile image dominates the first viewport and the intro copy/work feed is below the fold. Adding a soft scroll affordance and trimming the hero image opens up real estate.

### 4.1 Cap the profile image height on mobile

Constrain the hero image to `max-h-[45vh]` (or similar) at viewports under 1000px so the bio + first nav cell peek above the fold.

### 4.2 Add a "↓ SELECTED WORK" scroll cue near the mobile fold

A small chevron + label at the bottom of the visible viewport on mobile pointing to the work feed. Lives inside the LeftPanel's bottom area, hidden at desktop. CSS-only — no JS scroll animation.

### Acceptance
- At 390×844 viewport, the first project card title is at least partially visible without scroll.
- Scroll cue visible only when LeftPanel is full-viewport (mobile drawer / unscrolled).

---

## Phase 5 — Project detail page hierarchy

**Branch:** `style/project-detail-restructure`
**Risk:** Medium. Touches templating + needs editorial input from you.
**Effort:** TBD — depends on copy decisions.

The `/projects/[slug]` page has two structural issues:
1. The left image column shows a mosaic of varied-size screenshots without a hero. Visual hierarchy collapses.
2. The right body copy is a single unbroken paragraph (~250 words). Even with serif typography it's a wall.

### 5.1 Restructure body copy into labeled sections

[src/pages/projects/[slug].astro](src/pages/projects/[slug].astro) plus [src/data/projects.ts](src/data/) data shape.

Extend the project data type with discrete fields:

```ts
interface Project {
  // existing fields...
  role: string;            // "Shopify Plus Developer"
  outcomes: string[];      // ["80K daily visitors", "180 markets", "+12% conversion"]
  stack: string[];         // already exists as tags?
  overview: string;        // long-form prose
}
```

Render them as three labeled blocks under the title with monospace labels matching the design system: `ROLE / OUTCOMES / STACK / OVERVIEW`.

### 5.2 Establish a hero image

Add a `heroImage` field to the project data, render it large at the top of the left column, and treat the remaining images as a captioned 2-column grid below.

### Acceptance
- Body copy is skim-readable in ~10 seconds.
- One clear hero image per project, secondary images visually subordinate.
- Project data type updated with new fields, all 4 existing projects backfilled.

**⚠️ This phase needs your input on copy** — I won't invent outcomes or restructure your bios without you. See open questions below.

---

## Skipped / Open Questions

Items I deliberately did NOT include as actionable phases because they need your call:

### Q1. Should we change the body scroll model?

`<html>` and `<body>` are set to `overflow: hidden` and `<main>` owns scroll. This makes the left panel feel "fixed" without `position: fixed`. Tradeoffs:

- ✅ Visually crisp on desktop, no double scrollbars.
- ❌ Mobile Safari tap-status-bar-to-scroll-to-top breaks (it only works on the root scroller).
- ❌ Browser scroll restoration on back/forward may misfire on `/projects/[slug]` → back.
- ❌ Trackpad rubber-banding feels slightly off at the boundaries.

Alternative: native body scroll + `position: sticky` on LeftPanel within a grid container. Same visual outcome on desktop, native behavior preserved. **But** this is a meaningful refactor of the layout you just shipped in commits `ede5d02` and `03a97a4`. **Do you want to migrate, or keep the current model and accept the tradeoffs?**

### Q2. Where exactly should "Available Q3 2026" be promoted?

I proposed inline in the brand header. Alternatives:

- **A** — Inline next to the tagline (Phase 3 above). Subtle, on-brand.
- **B** — A pill in the top-right of the TopNav (mobile) + a small ribbon on desktop. More aggressive.
- **C** — A dedicated band between the brand header and the bento nav.

Default: **A**. Confirm or pick another.

### Q3. Page title format on the homepage

Proposed: `Jordan A.F. — Shopify & JS/TS Developer | Lookbook`.

Alternatives:
- `Jordan A.F. | Shopify & JS/TS Developer in Los Angeles`
- `Jordan A.F. — The Commerce Boutique`
- Keep current.

Default: first option. Confirm.

### Q4. Project detail page copy restructure

I can wire the new `Project` type fields and the layout, but **the outcomes/role/overview text needs to come from you for each of the 4 projects**. I won't fabricate metrics. Please drop a list of fields per project when you're ready and I'll plug them in.

### Q5. Footer enhancement

Add a small "Built with Astro · View source on GitHub" link in the footer? Signals craft to recruiters and gives them a no-friction code sample. Opinionated — skip if you'd rather keep the footer minimal.

### Q6. Cart Drawer microcopy

Add "Response within 48h" beneath the PLACE ORDER button to lower submission anxiety? Two words of copy. Yes/no.

---

## Recommended sequencing

1. **Phase 1** (SEO) — ship today, biggest external-facing impact for zero risk.
2. **Phase 2** (A11y) — also low-risk; pairs naturally with Phase 1 since both touch `Layout.astro`.
3. **Phase 3** (Availability promotion) — quick visible win.
4. **Phase 4** (Mobile polish) — once you're happy with desktop.
5. Resolve open questions **Q1–Q6**.
6. **Phase 5** (Project detail) — needs editorial pass first.

All phases follow [.claude/rules/git-workflow.md](.claude/rules/git-workflow.md): branch from `main`, conventional-commit messages, `CHANGELOG.md` updated per commit, pre-commit gates (`pnpm type-check`, `pnpm lint`, `pnpm build`) passing.
