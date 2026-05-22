# Git Workflow

## Branching

- `main` — production branch; what Cloudflare Pages deploys from
- Feature branches: `feat/short-description` (e.g., `feat/contact-form`, `feat/world-background`)
- Bug fixes: `fix/short-description`
- Content updates: `content/short-description` (e.g., `content/add-projects`)
- Design tweaks: `style/short-description`

Always branch from `main`. Never commit directly to `main`.

## Commit Message Format (Conventional Commits)

```
feat: add SpeechBubbleModal with typewriter animation
fix: correct pixel shadow offset on ProjectCard hover
style: tighten QuestionBlock border to match design system
content: add three new projects to src/data/projects.ts
chore: update astro to 5.x
a11y: add aria-live region for cart count announcements
perf: defer SpeechBubbleModal island to client:idle
```

**Allowed prefixes:** `feat`, `fix`, `style`, `content`, `chore`, `a11y`, `perf`, `refactor`, `docs`

Rules:
- Lowercase, imperative mood ("add" not "added" or "adds")
- No period at the end
- Under 72 characters
- If a commit needs more explanation, add a blank line then a body paragraph

## When to Commit

Commit at logical checkpoints — not per file, not per session:

✅ Commit when:
- A component is complete and the build passes (`pnpm build` clean)
- A page is wired up with real data
- A bug is fixed and verified
- A ROADMAP.md phase is complete

❌ Do not commit when:
- `pnpm type-check` or `pnpm lint` is failing
- The build is broken
- There are console errors or TypeScript errors
- A component is half-built (commit the scaffold separately from the implementation)

## Pre-Commit Checklist

Before every commit:
1. Update `CHANGELOG.md` with what changed and why
2. `pnpm type-check` — must pass (zero type errors)
3. `pnpm lint` — must pass (zero lint errors)
4. `pnpm build` — must produce a clean build

Do not commit if any step fails or if the changelog entry is missing.

## What Never Gets Committed

```
.env
.env.local
CLAUDE.local.md       # personal notes — already in .gitignore
node_modules/
dist/
.astro/
```

These are all covered in `.gitignore`. If you ever see any of these staged, stop and investigate.

## Commit Scope Per ROADMAP Phase

Aim for one meaningful commit per ROADMAP.md task, or one per phase for small tasks:

| Phase | Example commit |
|-------|---------------|
| Foundation | `feat: add Layout, global CSS, font loading, WorldBackground scene` |
| Design system | `feat: add QuestionBlock, SkillBadge, pixel shadow design tokens` |
| Page shells | `feat: scaffold all four page routes with PageHeader world labels` |
| Content | `feat: wire ProjectCard and skills grid to src/data` |
| Contact form | `feat: add ContactForm island, /api/contact endpoint, SpeechBubbleModal` |
| Polish | `a11y: audit keyboard nav and focus styles across all pages` |

## Pull Requests (if working with others)

- One PR per feature branch
- Title follows the same Conventional Commits format as individual commits
- Include a screenshot for any visual change — pixel aesthetic regressions are easy to miss in a diff
- Squash merge into `main` to keep history clean

## Claude Code Git Behaviour

- Claude Code should **commit after completing each ROADMAP.md task**, not after every file edit
- Always update `CHANGELOG.md` before committing — describe the change, affected files, and rationale
- Always run the pre-commit checklist before committing
- Claude Code should **never push to main directly** — commit to the current feature branch only
- If asked to "save progress", commit with a `chore: WIP —` prefix and note what's incomplete in the body
- Branch names created by Claude Code should follow the naming convention above
