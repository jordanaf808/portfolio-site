# To-Do:

[ ] - set a max-width for the slideshow on the project page.
[✅] - Create Services Page
[🚧] - Build badges for tech icons, Make sure to add Icons8 reference link: `icons by <a target="_blank" href="https://icons8.com">Icons8</a>`
[ ] - Replace placeholder `site: 'https://thecommerceboutique.com'` in astro.config.mjs with the actual production URL before deploy.
[ ] - Create captions for images
[ ] - Add Video capability to project card and project detail page.
[✅] - Revisit pnpm overrides in pnpm-workspace.yaml (devalue ^5.8.1, ws ^8.20.1, yaml ^2.8.3).
These are pinned floors patching transitive `pnpm audit` advisories (1 high devalue via astro, 2 moderate: ws via @cloudflare/vite-plugin, yaml via @astrojs/check). Remove each once the parent package ships the patched version upstream so the overrides don't silently hold back future resolutions. Re-check with `pnpm audit`. Note: pnpm v11 only reads overrides from pnpm-workspace.yaml (not package.json), and changing them needs `pnpm install --force` to re-resolve — see memory: ref-pnpm-v11-overrides.md.
[ ] - Confirm where production builds run before next deploy. If Cloudflare Workers Builds runs on its Linux CI, it needs the Linux Sharp binary (@img/sharp-linux-x64 or -linux-arm64); only @img/sharp-darwin-arm64 is installed locally. If instead you build locally and deploy dist/, no action needed. Relevant because astro.config.mjs uses imageService 'compile' (build-time Sharp) for production; dev uses 'passthrough'.

[✅] - Use the Astro Image component?
[✅] - make horizontal scrollbar 6px wide
[✅] - click on overlay to close image gallery
[✅] - Refactor body scroll model (Q1): native body scroll + position:sticky LeftPanel (Option B).
See memory: project-scroll-model-decision.md for full spec.
Branch as `refactor/body-scroll-model`. Files: global.css, Layout.astro, LeftPanel.astro, projects/[slug].astro (independent, tackle last).
[✅] - Author /public/og-default.jpg (1200×630) for link previews.
Suggested: crop of profile-pic.jpg with the wordmark + "Shopify & JS/TS Developer" overlaid. Referenced by src/components/SEOHead.astro as the default og:image.

[✅] - Fix Project Page layout on mobile, improve layout,
[✅] - add paragraph separator.
[✅] - Create logo - JAF DEV
[✅] - Update favicon image
[✅] - Create better about me copy.

[✅] - work on homepage layout. I think I want to move image and description to left-col with title, but keep it in right-col on mobile layout, just add the title and subtitle above the description.

[✅] - reverse sort on featured projects
[✅] - change counter/category label on feat. projects to just use number, not category.
[✅] - Remove job title and category from either featured project counter
[✅] - Test remove nav bar from right column.

[✅] - Create Hero section with profile photo.

[✅] - Remove header and nav in right-col,
[✅] - Create hover state for left-col nav buttons

## project detail page

[✅] - put tech used boxes below project title
[✅] - change 'add to cart' label to 'Get In Touch'
[✅] - keep footer nav and contact me button flush to the bottom
[✅] - nav bar shows homepage ('studio') active on project detail page. It should add the current page to the nav bar at the end and show it as active.
[✅] - changed 'Studio' to 'Home'

## Not Yet:

View Transitions on page change

Review Tech labels at the bottom of left-col, don't really need that there. Maybe put random stats, like a factoid or stat or quote.

Are their browser compatibility issues on this site?

draggable gallery
