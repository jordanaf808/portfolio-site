---
name: The Commerce Boutique
colors:
  surface: '#FFFFFF'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#6a5c4f'
  on-secondary: '#ffffff'
  secondary-container: '#f3dfce'
  on-secondary-container: '#706254'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#f3dfce'
  secondary-fixed-dim: '#d6c3b3'
  on-secondary-fixed: '#231a0f'
  on-secondary-fixed-variant: '#514438'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  text-main: '#222222'
  text-muted: '#888888'
  border-primary: '#111111'
  accent-taupe: '#C8B6A6'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-main:
    fontFamily: Work Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: 0.1em
  button-text:
    fontFamily: Work Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 1px
spacing:
  container-padding: 48px
  bento-gap: 0px
  grid-split: 40/60
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

# The Commerce Boutique

## Product Overview

**The Pitch:** A premium, e-commerce-inspired portfolio for a high-end Shopify and JS/TS developer. Functions as a luxury digital lookbook where prospective clients browse projects like luxury goods and "checkout" to initiate contact.

**For:** Creative agencies, luxury fashion brands, and high-growth e-commerce companies seeking elite headless Shopify architecture.

**Device:** desktop

**Design Direction:** A minimalist, architectural bento-box layout with thin dark borders, off-white backgrounds, and editorial typography. Translates the tactile, high-end feel of luxury physical retail into a digital developer portfolio.

**Inspired by:** SSENSE, Aime Leon Dore, minimal editorial lookbooks.

---

## Screens

- **Lookbook (Home):** Dual-pane layout; static left bento grid (identity), scrollable right feed (projects).
- **Product Detail (Project):** Editorial deep-dive into a specific project, styled like a luxury product page.
- **Checkout (Contact):** A tongue-in-cheek but elegant contact form styled as a high-end checkout flow.
- **Index (Archive):** Dense, text-heavy directory of all past work and technical experiments.

---

## Key Flows

**The "Add to Cart" Contact Flow:** User discovers work and initiates contact.

1. User is on **Lookbook (Home)** -> sees floating project cards.
2. User clicks **"View Details"** -> navigates to **Product Detail**.
3. User clicks **"Add to Cart (Hire Me)"** -> triggers cart drawer overlay.
4. User clicks **"Proceed to Checkout"** -> navigates to **Checkout (Contact)** form.

---

## Design System

### Color Palette

- **Primary:** `#111111` - Charcoal black; borders, primary text, solid buttons
- **Background:** `#F4F4F0` - Alabaster off-white; main canvas
- **Surface:** `#FFFFFF` - Crisp white; project cards, right-side floating panel
- **Text:** `#222222` - Deep grey; body copy for readability
- **Muted:** `#888888` - Stone grey; metadata, tags, secondary borders
- **Accent:** `#C8B6A6` - Muted taupe; hover states, subtle highlights

### Typography

Choose fonts that are **distinctive and characterful**, not generic defaults.

- **Headings:** `Instrument Serif`, 400 italic & regular, 32-64px
- **Body:** `Switzer`, 400, 15px, 150% line-height
- **Small text:** `Switzer Mono`, 400, 12px, uppercase tracking
- **Buttons:** `Switzer`, 500, 13px, uppercase, 1px letter-spacing

**Style notes:** 0px border radius everywhere. Sharp corners. 1px solid `#111111` borders dividing the bento grid. Right panel has a stark, un-blurred drop shadow. High contrast, editorial layout.

### Design Tokens

```css
:root {
	--color-primary: #111111;
	--color-background: #f4f4f0;
	--color-surface: #ffffff;
	--color-text: #222222;
	--color-muted: #888888;
	--color-accent: #c8b6a6;
	--font-serif: 'Instrument Serif', serif;
	--font-sans: 'Switzer', sans-serif;
	--font-mono: 'Switzer Mono', monospace;
	--radius: 0px;
	--border-thin: 1px solid var(--color-primary);
	--shadow-hard: 8px 8px 0px rgba(17, 17, 17, 0.1);
}
```

---

## Screen Specifications

### Lookbook (Home)

**Purpose:** Primary landing experience, establishing technical authority and luxury aesthetic.

**Layout:** 40/60 split. Left 40% is fixed, bento-box grid. Right 60% is a floating, vertically scrollable surface with a hard shadow.

**Key Elements:**

- **Identity Bento (Left):** 4-pane grid. Top-left: Name/Logo. Top-right: Status ("AVAILABLE Q4"). Bottom: Bio, Stack (`TS, React, Liquid`). `1px` charcoal borders separating panes.
- **Floating Canvas (Right):** `background: #FFFFFF`, `padding: 48px`, `box-shadow: 8px 8px 0px rgba(17,17,17,0.1)`. Scrolls independently.
- **Project Cards:** Full-width images, grayscale default. `Switzer Mono` metadata top-left, `Instrument Serif` title bottom-left.

**States:**

- **Loading:** Entire screen is `#F4F4F0`. Black 1px line draws the bento grid in sequence.
- **Error:** Plain text "Inventory Unavailable."

**Components:**

- **Project Card:** `100% width`, `600px height`. Hover reveals original color and "View Details" overlay button.
- **Stack Tag:** `border: 1px solid #111111`, `padding: 4px 8px`, `12px` mono text.

**Interactions:**

- **Hover Project:** Image transitions to full color (`duration: 400ms`).
- **Scroll Right Panel:** Smooth scroll, left panel remains completely locked.

---

### Product Detail (Project)

**Purpose:** Deep dive into a specific case study, mimicking a high-end apparel product page.

**Layout:** 50/50 split. Left side sticky photo gallery. Right side scrolling text, specs, and "Add to Cart" CTA.

**Key Elements:**

- **Image Gallery (Left):** Stack of edge-to-edge high-res project screenshots.
- **Project Specs (Right):** Title (`64px serif`), tech stack table, live link.
- **"Add to Cart" CTA:** Solid black button, white text, 100% width. `padding: 16px`. Text reads "ADD TO CART — HIRE ME".
- **Accordion Details:** "The Challenge", "The Architecture", "The Results". 1px top/bottom borders.

**States:**

- **Loading:** Skeleton boxes with diagonal stripes.

**Interactions:**

- **Click "Add to Cart":** Opens Cart Drawer from right. Button text briefly changes to "ADDED TO BAG".
- **Click Accordion:** Expands text smoothly, plus icon rotates to minus.

---

### Cart Drawer (Contact)

**Purpose:** A contact form to get potential client details for a web development project, in the style of an e-commerce stores slide out cart drawer.

**Layout:** A fixed overlay drawer slides in from the right side of the screen, with a semi-transparent backdrop behind it. ~400px wide on desktop, matching site's aesthetic with a subtle pixel shadow and clean borders.

**Key Elements:**

- **title:** ("Get In Touch").
- **close button:** a crisp × button flush right.
- **form fields:** Name and Email fields are tight single-line inputs, the Message area is a taller textarea.
- **submit button:** anchors the bottom of the form in your primary CTA color, full-width. Also shows loading state.
- **Floating Label Input:** Label sits on line, shrinks and moves up on focus.

**Interactions:**

- Open: Drawer Slides in from the right
- Submit: POST to /api/contact, validate server-side
- Disabled on submit: Prevent double-submission
- Error handling: Display inline validation errors below affected fields
- Success feedback: Close form. "Message sent" confirmation toast.

---

### Index (Archive)

**Purpose:** Dense directory of all repositories, minor projects, and technical writing.

**Layout:** Full-width table, heavily typographic.

**Key Elements:**

- **Archive Table:** Columns: Year, Project, Client, Tech, Link.
- **Row Styling:** `border-bottom: 1px solid #EAEAEA`. Hovering a row changes background to `#C8B6A6` (muted taupe).
- **Typography:** Exclusively `Switzer Mono` `12px` for a raw, database feel.

**Interactions:**

- **Hover Row:** Custom cursor appears (an arrow pointing top-right).

---

## Build Guide

**Build Order:**

1. **Design System & Layout Wrapper:** Set up the exact grid split (`grid-cols-12`, `col-span-5` / `col-span-7`), fixed left, scrolling right. Establish 0px radius and thin borders.
2. **Lookbook (Home):** Build the bento grid on the left. Ensure borders overlap correctly (no double borders). Build the scrolling right surface with the hard shadow.
3. **Product Detail:** Implement the sticky image left / scrolling right pattern. Build the accordion components.
4. **Cart Drawer (Contact):** Build the global slide-out cart overlay, then the standalone checkout form page.
5. **Index:** Table layout, hover effects.
