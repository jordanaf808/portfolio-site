---
paths:
  - "src/**/*.{ts,tsx,astro}"
---

# Code Style

## TypeScript — Strict Mode

This project runs `strict: true`. Every rule applies:

- No `any` — use `unknown` and narrow, or define a proper type
- No `as X` type assertions unless narrowing from `unknown` after a parse/fetch
- All exported functions have explicit return types: `function getProjects(): Project[]`
- All async functions: `async function sendEmail(data: ContactData): Promise<{ success: boolean }>`
- `interface` for object shapes; `type` for unions, aliases, and mapped types
- Use `satisfies` when you want type-checking without widening: `const config = { ... } satisfies Config`
- Optional chaining (`?.`) and nullish coalescing (`??`) over manual null checks

## Naming Conventions

| Kind | Convention | Example |
|------|-----------|---------|
| Astro components | `PascalCase` | `QuestionBlock.astro` |
| React islands | `PascalCase` | `ContactForm.tsx` |
| Utility functions | `camelCase` | `formatDate.ts` |
| Types / interfaces | `PascalCase` | `ProjectEntry` |
| Data files | `camelCase` | `projects.ts`, `skills.ts` |
| CSS custom properties | `kebab-case` | `--sky-blue`, `--gold-dark` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_MESSAGE_LENGTH` |

## File Organization

- Co-locate types with the component that owns them unless shared across 3+ files
- Shared types → `src/types/index.ts`
- One component per file
- Static data in `src/data/` as named exports — never inline data in page files

## React Island Rules

- Islands should be **thin** — receive typed props from Astro parents, handle UI state only
- No data fetching inside islands except the contact form POST (which is the island's purpose)
- Keep island bundle size small — no heavy dependencies inside `.tsx` files

## Imports

- Use `@/` alias for internal imports (configured in `tsconfig.json`)
- Astro components: `.astro` extension required in imports
- Order: framework → third-party → internal (`@/`) → relative

## Data Files (`src/data/`)

Each data file exports typed arrays or objects — these are the content of the site:

```ts
// src/data/projects.ts
import type { Project } from '@/types'

export const projects: Project[] = [
  {
    title: 'Project Name',
    description: '...',
    tags: ['Shopify', 'React'],
    href: 'https://...',
    featured: true,
  },
]
```

- Never use `as const` as a substitute for defining proper types
- If a field can be absent for some entries, use an optional field `href?: string` not `href: string | undefined`

## Comments

- Comments explain **why**, not what — the code says what
- JSDoc on exported data type interfaces for IDE hover context
- No commented-out code committed to the repo
