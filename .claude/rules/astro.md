---
paths:
  - "src/**/*.astro"
  - "src/pages/**/*.ts"
  - "src/pages/**/*.tsx"
---

# Astro 5

## Core Mental Model

- **Default to `.astro`** — zero JS in the browser unless the component needs interactivity
- React islands are the exception, not the rule — ask "does this truly need `useState`?" first
- Astro components run at build time (static) or request time (SSR) — there is no client runtime for `.astro` files

## Component Authoring

- All props must be typed in the frontmatter `---` block:
  ```astro
  ---
  interface Props {
    title: string
    label: string
    href?: string
  }
  const { title, label, href = '#' } = Astro.props
  ---
  ```
- Use `Astro.props` destructuring at the top of every component frontmatter
- Prefer `const` over `let` in frontmatter — frontmatter runs once, no reactivity
- Use `<Fragment>` or `<>` to avoid unnecessary wrapper elements

## React Islands — `client:` Directive Guide

| Directive | When to use |
|-----------|-------------|
| `client:load` | Immediately visible, critical interactivity (ContactForm) |
| `client:idle` | Non-critical interactivity (modals triggered by user action) |
| `client:visible` | Below-fold components (defer until scrolled into view) |
| `client:only="react"` | Component uses browser APIs not available in SSR |

Never use `client:load` for something that doesn't need to be interactive on page load — it adds JS weight.

## SSR Endpoints (Cloudflare Workers)

- SSR endpoints live in `src/pages/api/*.ts` — export named functions matching HTTP methods
- Always type the `APIContext` from `astro`:
  ```ts
  import type { APIRoute } from 'astro'

  export const POST: APIRoute = async ({ request }) => {
    // ...
  }
  ```
- Always return a `new Response()` — never `return { data }` naked
- Set `Content-Type: application/json` explicitly on JSON responses
- Return appropriate HTTP status codes — `400` for validation errors, `500` for server errors
- The Cloudflare adapter is required for any `export const prerender = false` page or any API route

## Routing & Output Modes

- Static pages: default — no export needed
- SSR page or API route: add `export const prerender = false` at the top
- This project uses hybrid output — most pages are static; only `/api/contact` is SSR
- Do not set `output: 'server'` globally — it would make all pages SSR unnecessarily

## Data & Imports

- Static data from `src/data/` is imported directly in frontmatter — no fetch needed
- Use `Astro.glob()` only for markdown/MDX content collections — not for importing TS data
- Prefer named exports from data files over default exports

## Slots

- Use named slots for layout components with multiple content regions:
  ```astro
  <!-- Layout.astro -->
  <slot name="header" />
  <slot /> <!-- default slot -->

  <!-- Page -->
  <Layout>
    <nav slot="header">...</nav>
    <main>...</main>
  </Layout>
  ```

## Style Scoping

- Astro scopes `<style>` blocks to the component automatically — use them for component-specific CSS
- Use `<style is:global>` sparingly — only in `global.css` or `Layout.astro` for true globals
- Tailwind utility classes apply globally by design — no scoping needed
- For dynamic styles based on props, use inline `style` with CSS custom properties, not conditional class strings
