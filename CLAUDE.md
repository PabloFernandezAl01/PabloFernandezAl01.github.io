# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static personal portfolio website** for Pablo Fernández (game developer / C++ programmer). There is no build system, package manager, or server-side code — it's plain HTML, CSS, and JavaScript served directly.

## Development

**To preview the site locally**, open `index.html` in a browser or use any static file server:
```bash
# Option 1: Python
python -m http.server 8080

# Option 2: Node (if available)
npx serve .
```

There are no lint, test, or build commands.

## Architecture

The site is a **single-page portfolio** (`index.html`) with all content in one file. Styles live in `css/style.css`.

### External CDN dependencies (loaded via `<link>`/`<script>` tags in `index.html`):
- **Bootstrap 5.3** — layout and utility classes
- **AOS 2.3** — scroll-triggered animations (`data-aos="..."` attributes)
- **Swiper 11** — carousels (`.servicesSwiper`, `.testimonialsSwiper`, etc.)
- **Font Awesome 6.4** — icons
- **Google Fonts** — Syne (display headings) and Inter (body)

### Local JS (`js/`):
- `script.js` — initializes AOS, Swiper instances, Isotope grid, Chocolat lightbox, and the fullscreen menu toggle
- `plugins.js` — bundled third-party plugins (Isotope, Chocolat)
- `jquery-1.11.0.min.js` — jQuery (used by plugins and script.js)

### CSS structure (`css/`)
`css/style.css` is the entry point loaded by `index.html`; it `@import`s all partials:
- `base/variables.css` — custom palette vars + Bootstrap token overrides
- `base/typography.css` — body, headings, `.syne-font`, container width
- `vendor/bootstrap-overrides.css` — btn, pagination, accordion, dark-theme overrides
- `layout/sections.css` — `.section-title`, `.hero-title`, `.content-title`, `.subtitle`, `.date-text`
- `layout/grid.css` — `.image-grid` (two-column responsive grid for project media)
- `layout/banner.css` — `.banner-content` / `.banner-image` hero positioning
- `components/buttons.css` — `.btn-custom`, `.form-control-custom`
- `components/cards.css` — `.card-custom`, `.slider-dot`, `.testimonial-*`
- `components/swiper.css` — Swiper pagination / nav overrides
- `components/menu.css` — fullscreen overlay, `.menu-link`, `.close-menu-btn`, `.social-link`
- `components/footer.css` — `.footer-link`, `.social-icon`
- `animations/aos-clip.css` — `clip-top/bottom/left/right/circle/...` clip-path AOS animations
- `animations/aos-text.css` — `text-reveal-*`, `text-letter-spacing`, `gradient-reveal` AOS animations
- `utilities/colors.css` — `.bg-primary`, `.bg-yellow`, `.text-yellow`, etc.
- `utilities/responsive.css` — all `@media` breakpoints

### Color palette (`css/base/variables.css`):
- Primary dark green: `#414c31` (`--primary-color`, header/footer)
- Accent yellow: `#f9c32c` (`--secondary-color`)
- Light cream background: `#fcf5e1` (`--light-bg`)
- Light cream text: `#fdf5e1` (`--text-light`)

### Page sections (in order):
1. Fullscreen menu overlay
2. Hero (large stacked "Pablo" text + services Swiper)
3. About Me (photo + bio + CV download links)
4. Work Experience
5. Education
6. Interests
7. Projects (image/video grids linking to GitHub repos)
8. Certificates (collapsible Bootstrap collapse)
9. Footer (GitHub/LinkedIn links + email)

### Assets:
- `images/about/` — about section photo
- `images/experience/` — work experience images
- `images/education/` — education images
- `images/interests/` — interests images
- `images/projects/` — project screenshots and demo videos (`.mp4`)
- `images/certificates/` — certificate images
- `cv/` — PDF CV files (`CV-EN.pdf`, `CV-ES.pdf`)
- `OldPortfolio/` — archived previous version (not linked from main site)

## Key Patterns

- Project entries use a two-column `.image-grid` with `<video autoplay loop muted playsinline>` or `<img>` elements, each wrapped in an `<a>` linking to GitHub.
- Section background text (large decorative labels) are achieved with three stacked `.syne-font.section-title` elements, the lower two using `.section-title-bg` (transparent with stroke).
- The hero uses the same stacking pattern for the large "Pablo" title.
