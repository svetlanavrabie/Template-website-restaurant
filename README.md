# Laura's Restaurant — A New York City Eatery

A one-page restaurant website built with semantic **HTML5**, modern **CSS3** and vanilla **JavaScript (ES6+)**.
It has a dark, premium look, works at any screen size, and is designed to be accessible and fast.

There is no build step, no framework and no runtime dependency.

---

## Contents

- [Sections](#sections)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Technology decisions](#technology-decisions)
- [Design system](#design-system)
- [Responsive layout](#responsive-layout)
- [Interactions & animations](#interactions--animations)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [SEO](#seo)
- [Placeholder content to replace](#placeholder-content-to-replace)
- [Quality assurance](#quality-assurance)

---

## Sections

| # | Section | Anchor | Notes |
|---|---|---|---|
| 1 | Header & navigation | — | Sticky. Transparent over the hero, solid once you scroll. Underline shows the active section. Full-screen accessible menu on mobile. |
| 2 | Hero | `#home` | Full-height photo with overlay, restaurant name, tagline "A New York City Eatery", and the *Explore Our Menu* and *Contact Us* buttons. |
| 3 | About | `#about` | Two-image collage with an introduction built only from the existing menu (no invented history). |
| 4 | Services | `#services` | Four linked cards: Dine In, Garden Greens, Meats & Charcuterie, Sweet Finishes. |
| 5 | Food Menu | `#menu` | Three dish cards: course badge, photo, name, price and description. |
| 6 | Testimonials | `#reviews` | "What Our Customers Say". Clearly labelled **placeholder** cards (see below). |
| 7 | Contact | `#contact` | Location, plus phone, email and opening-hours fields shown as *To be announced*. |
| 8 | Footer | — | Brand, description, quick links, menu links, location and **© 2026 Svetlana Vrabie. All rights reserved.** |

The dishes, descriptions and prices are carried over from the original template:

| Course | Dish | Price |
|---|---|---|
| First Course | Welsh Onion Soko | $14 |
| Second Course | Pastrami Boudin Tongue | $22 |
| Dessert | Fruitcake Marzipan Pudding Dragée | $8 |

## Project structure

```
├── index.html                 # The whole page (semantic markup, inline SVG icon sprite, JSON-LD)
├── css/
│   └── style.css              # Single mobile-first stylesheet, organised in 15 numbered sections
├── js/
│   └── index.js               # Vanilla JS: navigation, scroll state, scroll-spy, reveal animations
├── assets/
│   ├── favicon.svg
│   ├── fonts/                 # Self-hosted WOFF2 (Cormorant Garamond, Manrope)
│   └── images/
│       ├── hero/              # Hero photo: landscape + portrait crops, several widths
│       ├── restaurant/        # About & Services photography
│       ├── menu/              # One photo per course
│       ├── backgrounds/       # Contact section background
│       └── og-image.jpg       # 1200×630 social preview
└── image/                     # Original template images (kept, no longer referenced)
```

## Running locally

Open `index.html` directly in a browser. The site works over `file://` because it uses no ES modules or fetch calls.

Or serve it with any static server, for example:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Technology decisions

| Decision | Reasoning |
|---|---|
| **No Bootstrap** | The layout needs only a handful of grids. Native CSS Grid and Flexbox do this with less code than overriding Bootstrap's default look, and skip ~200 KB of CSS/JS. |
| **jQuery removed** | The original used jQuery for a single click handler. The new interactions are vanilla JS (~6 KB, unminified). |
| **One CSS file, one JS file** | A one-page site doesn't need a build pipeline. The stylesheet is split into clearly numbered sections instead (tokens → base → components → sections → animations). |
| **Classic `defer` script (IIFE) instead of ES modules** | Keeps the page working when opened via `file://`. Adds no globals. |
| **Progressive enhancement** | A tiny inline script adds a `.js` class to `<html>`. Without JavaScript the navigation is a plain wrapped list, all content is visible, and anchors still work. |
| **IntersectionObserver, no scroll listeners** | Header state, back-to-top visibility, scroll-spy and reveal animations each use an observer. Nothing runs on the scroll event. |
| **No carousel** | Three testimonials fit in a responsive grid. A carousel would hide content and add complexity. |
| **Self-hosted fonts** | Avoids third-party requests, gives `font-display: swap`, and the fonts are preloaded. |

## Design system

All design tokens are CSS custom properties defined in `:root` (`css/style.css`, section 2).

**Colour**

| Token | Value | Use |
|---|---|---|
| `--c-bg` | `#171717` | Page background (deep charcoal) |
| `--c-surface` | `#222222` | Alternate sections, cards |
| `--c-gold` | `#C6A15B` | Accent, prices, active states |
| `--c-cream` | `#F5F0E8` | Button hover sweep, highlights |
| `--c-text` | `#F8F8F6` | Main text |
| `--c-muted` | `#B8B8B8` | Secondary text |
| `--c-border` | `#383838` | Hairlines and borders |

**Typography**

- **Cormorant Garamond** (serif) for display text, headings, prices and quotes.
- **Manrope** (sans-serif) for body text and UI.
- Every size above body text is fluid (`clamp()`), from `--fs-xs` up to `--fs-display`.

**Other tokens**

- Fluid spacing scale: `--space-2xs` … `--space-section`.
- Radii: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`.
- Two shadows: `--shadow-sm`, `--shadow-lg`.
- Container: `--container` (76rem) with a fluid `--container-pad`.
- Motion: `--ease`, `--dur-fast`, `--dur`, `--dur-slow`.

## Responsive layout

The styles are mobile-first. Breakpoints are in `em`, so they follow the user's browser font settings.

| Breakpoint | Width | Main changes |
|---|---|---|
| base | < 576px | Single column. Full-screen mobile menu. Portrait-cropped hero image. |
| `36em` | ≥ 576px | 2-column services list, contact details and footer. |
| `37.5em` | ≥ 600px | Menu cards switch to horizontal (image beside text). |
| `48em` | ≥ 768px | 2-column testimonials (the odd last card is centred). Landscape hero image. |
| `62em` | ≥ 992px | Desktop navigation. Split About, Services and Contact layouts. 3-column menu and testimonials. |
| `100em` / `140em` | ≥ 1600px / 2240px | Root font size scales up (112.5% / 131.25%) so the page doesn't look tiny on very large screens. |

There are also rules for short landscape screens (phones held sideways), which tighten the hero and the mobile menu.

## Interactions & animations

**Navigation**

- Sticky header with a background that fades in as you scroll.
- Active link highlighted by scroll-spy.
- Smooth scrolling, offset so content isn't hidden under the fixed header.

**Mobile menu**

- Full-screen panel that opens with a `clip-path` animation and staggered links.
- Toggle button reports `aria-expanded`.
- While open: page content is `inert` and body scroll is locked.
- Closes with Escape, by tapping a link, or when the window becomes desktop-sized.
- Focus moves into the menu when it opens and back to the toggle when it closes.

**Hero**

- Slow Ken-Burns zoom on the photo.
- Staggered fade-up entrance.
- Animated "Discover" scroll cue.

**Scroll reveal**

- Sections and cards fade and slide in, staggered with a `--i` custom property.
- Each element's reveal classes are removed once its animation finishes, so its own hover transitions work normally afterwards.

**Hover and focus states**

- Button colour sweep.
- Image zoom on dish cards.
- Card lift.
- Link arrows nudge.
- Underlined nav links.

**Back-to-top button** appears once the hero has scrolled away.

All motion uses only `transform` and `opacity`. With `prefers-reduced-motion: reduce`, animations, reveals and smooth scrolling are turned off.

## Accessibility

- **Structure**
  - Semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `figure`, `blockquote`, `address`, `footer`).
  - One `h1` and no skipped heading levels.
  - A skip link to the main content.
- **Keyboard and focus**
  - Visible `:focus-visible` rings on every interactive element.
  - Touch targets of at least 44 × 44 px.
- **Images and icons**
  - Descriptive `alt` text on content images.
  - Decorative icons are `aria-hidden`.
- **Contrast** — every text/background token pair passes WCAG AA:
  - Gold on charcoal: 7.4 : 1.
  - Muted grey on charcoal: 9.0 : 1.
  - Body text: 16.9 : 1.

## Performance

**Images**

- WebP with JPEG fallbacks (`<picture>`), plus responsive `srcset`/`sizes`.
- Explicit `width`/`height` on every image to prevent layout shift.
- `loading="lazy"` and `decoding="async"` below the fold.
- The hero image uses `fetchpriority="high"` and is preloaded, with separate landscape and portrait files.

**Fonts and scripts**

- Two preloaded WOFF2 files.
- A single deferred script.

**Requests** — no third-party requests at runtime.

## SEO

- Descriptive `<title>` and meta description.
- `theme-color`.
- Open Graph and Twitter card tags, with a 1200×630 preview image.
- SVG favicon.
- `schema.org/Restaurant` JSON-LD containing only verified facts: name, city, cuisine description, and the three menu items with prices. Address, phone, hours and ratings are deliberately omitted until real data exists.

> When the site gets a domain, change `og:image` (and optionally add `og:url` / `<link rel="canonical">`) to absolute
> URLs.

## Placeholder content to replace

No business details, reviews or ratings were invented. The following are clearly marked placeholders, each with an
HTML comment in `index.html` explaining what to change:

1. **Testimonials** (`#reviews`) — three cards labelled *Placeholder*, with initials avatars (G1–G3) and dashed
   borders. Replace them with genuine, permission-approved guest reviews. Then remove the notice and the
   `testimonial--placeholder` class.
2. **Contact** (`#contact`) — phone, email and opening hours show *To be announced*. When real values exist:
   - Use `tel:` and `mailto:` links.
   - Add `telephone`, `email`, `address` and `openingHours` to the JSON-LD.
3. **Dish descriptions** — these are the original template's lorem-ipsum-style copy, kept as requested. Replace them
   with real descriptions.
4. **Menu photography** — representative stock photos. Replace them with photos of the actual dishes.

## Quality assurance

The redesign was tested in Chrome through Playwright scripts.

**Viewports**

- Tested widths: 320, 360, 375, 390, 430, 600, 768, 820, 1024, 1280, 1366, 1440, 1600, 1920 and 2560 px.
- Orientation checks: phone landscape (844×390, 667×375), tablet portrait (768×1024) and tablet landscape (1024×768, 1180×820).
- Checked at every size:
  - No horizontal overflow and no elements outside the viewport.
  - No broken images.
  - No console errors or failed requests.

**Interactions (81 checks)**

- All anchors resolve. Header state, scroll-spy for every section, and the back-to-top button work.
- Both hero buttons work. Service cards link through to their dish. Dish hover zoom works.
- The skip link and focus rings work.
- Mobile menu, tested at 320, 390, 768 and 844 px wide:
  - Toggle meets the 44 px target size.
  - Focus moves in, background content is inert, and Escape closes it.
  - Tapping a link closes the menu and scrolls to the section; scroll unlocks afterwards.
- Menu state resets when resized to desktop.
- Reduced-motion and no-JavaScript modes work.

**axe-core** (WCAG 2.1 A/AA + best practices): 0 violations at 1440 px and 375 px.

**Lighthouse 11** (local server):

| Run | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Mobile (simulated throttling) | 98 | 100 | 100 | 100 | 2.3 s | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0.5 s | 0 |

Other browsers (Firefox, Safari) and physical devices were not tested in this pass. The CSS uses only widely supported
features, and `inert` and `clip-path` degrade gracefully.

---

© 2026 Svetlana Vrabie. All rights reserved.
