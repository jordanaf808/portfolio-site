# To-Do:

put Hayley Fisk in Undefined Agency

add projects!

create zoom feature for slideshow gallery

[✅] - Move Videos to first position (slides/thumbnails arrays in MediaGallery.astro now build videos before images; eager-loading on the thumbnail strip switched from "first image" to "first rendered thumbnail" so LCP isn't lost when a video leads)

[✅] - Improve Caption layout, it's too small. Increase font size. Make sure the text is legible with a dark background. (Superseded the "overlay bottom third of image" placement — caption moved into the top bar with a reserved-height row against the bar's solid bg-black/90 instead, avoiding both the contrast problem and layout shift. See MediaGallery.astro)

Consolidate html code into Astro components, e.g. code in index.astro

[✅] - Make the Next/Prev button clickable area much larger (now full-height flush-edge click columns spanning the image stage, centered SVG chevron — see MediaGallery.astro)

Set a min-size for images, don't want them to be too small, want them to expand

Improve Services Icon Badges. Add badge background with

[ ] - Fill in actual Image caption copy and Video data (files + poster images) for project entries in jobRoles.ts now that the ImageItem.caption / VideoItem scaffolding exists. Each image's `caption` and `alt` are currently undefined; no entry has a `videos` array yet.

[ ] - Audit all links and buttons site-wide to confirm they compute to `cursor: pointer`, everything else should be `cursor: default`.

[🚧] - Create captions for images. Scaffolding built (ImageItem.caption, rendered in MediaGallery slideshow) — no copy written yet.

[🚧] - Add Video capability to project card and project detail page. Scaffolding built (VideoItem type, MediaGallery video slides, ProjectCard video badge) — no video assets exist yet to verify with.

[✅] - disable text-editor cursor when not hovering over a text editor or active in a text editor.
[✅] - set a max-width for the slideshow on the project page. (Already handled by `#image-gallery { width: min(750px, 100%) }` in global.css — confirmed capped at 750px on wide viewports.)

[✅] - Confirm where production builds run before next deploy. Resolved: pnpm-lock.yaml already records every @img/sharp-\* platform binary (darwin + linux); `pnpm install` resolves the one matching whatever OS runs `pnpm build`, so no pinning is needed whether deploy goes through Workers Builds (Linux CI) or a local manual `wrangler deploy`. See BUILD.md. Still worth a one-time check that Workers Builds' git integration is actually connected in the Cloudflare dashboard, since that's outside repo visibility.

[✅] - Create Services Page
[🚧] - Build badges for tech icons, Make sure to add Icons8 reference link: `icons by <a target="_blank" href="https://icons8.com">Icons8</a>`
[✅] - Replace placeholder `site: 'https://thecommerceboutique.com'` in astro.config.mjs with the actual production URL before deploy.
[✅] - Revisit pnpm overrides in pnpm-workspace.yaml (devalue ^5.8.1, ws ^8.20.1, yaml ^2.8.3).
These are pinned floors patching transitive `pnpm audit` advisories (1 high devalue via astro, 2 moderate: ws via @cloudflare/vite-plugin, yaml via @astrojs/check). Remove each once the parent package ships the patched version upstream so the overrides don't silently hold back future resolutions. Re-check with `pnpm audit`. Note: pnpm v11 only reads overrides from pnpm-workspace.yaml (not package.json), and changing them needs `pnpm install --force` to re-resolve — see memory: ref-pnpm-v11-overrides.md.
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
