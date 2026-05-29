# To-Do:

[ ] - Refactor body scroll model (Q1): native body scroll + position:sticky LeftPanel (Option B).
See memory: project-scroll-model-decision.md for full spec.
Branch as `refactor/body-scroll-model`. Files: global.css, Layout.astro, LeftPanel.astro, projects/[slug].astro (independent, tackle last).

[🚧] - Create Services Page
[🚧] - Build badges for tech icons, Make sure to add Icons8 reference link: `icons by <a target="_blank" href="https://icons8.com">Icons8</a>`
[ ] - Author /public/og-default.jpg (1200×630) for link previews.
Suggested: crop of profile-pic.jpg with the wordmark + "Shopify & JS/TS Developer" overlaid. Referenced by src/components/SEOHead.astro as the default og:image.
[ ] - Replace placeholder `site: 'https://thecommerceboutique.com'` in astro.config.mjs with the actual production URL before deploy.
[ ] - Use the Astro Image component?
[ ] - Create captions for images
[ ] - Add Video capability to project card and project detail page.

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

Review Tech labels at the bottom of left-col, don't really need that there. Maybe put random stats, like a factoid or stat or quote.

Are their browser compatibility issues on this site?
