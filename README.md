# Axiom Intelligence

**[axiom-intelligence.pages.dev](https://axiom-intelligence.pages.dev)**

The landing page for Axiom Intelligence — an AI deep-tech startup building self-evolving superintelligence engines for Autonomous Research Organisms (AROs).

---

## Tech Stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Framework   | [Astro](https://astro.build) v7.2.2  |
| Language    | TypeScript (strict mode)            |
| Runtime     | Node.js >= 22.12.0                   |
| Package Mgr | [Bun](https://bun.sh)                |
| Styling     | Hand-written CSS (modular, scoped)   |
| Fonts       | Inter · JetBrains Mono (Google Fonts)|

No UI libraries, CSS frameworks, or animation libraries — everything is hand-crafted.

---

## Features

- **Single-page scrolling site** with full-screen scroll-snap sections (desktop)
- **Cinematic scroll reveals** — IntersectionObserver-driven fade/blur animations
- **Animated section backgrounds** — unique grid/dot patterns per section (CSS only)
- **Bento grid layouts** — glassmorphism cards with hover lift and shimmer effects
- **Active section tracking** — navbar title updates dynamically as you scroll
- **Scroll progress bar** — thin progress indicator at the top of the viewport
- **Responsive design** — three breakpoints (1024px, 768px, 480px)
- **Accessibility** — ARIA attributes, focus-visible outlines, `prefers-reduced-motion` support
- **SEO** — Open Graph, Twitter Cards, JSON-LD structured data

---

## Project Structure

```
src/
├── layout.astro              # Root HTML layout with SEO metadata
├── pages/
│   └── index.astro           # Single page — composes all sections
├── components/
│   ├── navbar.astro          # Fixed-top nav with status indicator + overlay menu
│   ├── footer.astro          # Contact info, CTA, legal links
│   └── scroll_progress.astro # Scroll progress bar
├── sections/
│   ├── hero.astro            # Main headline with radial glow + shimmer text
│   ├── paradigm_shift.astro  # Passive AI → Autonomous AI narrative
│   ├── aro_loop.astro        # Research → Diagnose → Execute → Learn loop
│   ├── ecosystem.astro       # Target verticals (mobility, finance, education, etc.)
│   ├── deployment.astro      # Current B2B autonomous consulting product
│   ├── moat.astro            # Competitive advantages (data flywheel, safety)
│   └── philosophy.astro      # Mission statement and founder info
├── scripts/
│   └── interactions.ts       # Client-side: scroll reveals, nav tracking, menu
└── styles/
    └── global.css            # Shared foundations: variables, reset, typography,
                              # bento card base, reveal system, responsive
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js >= 22.12.0 with npm/pnpm)

### Install

```bash
bun install
```

### Development

```bash
bun run dev
```

Opens a local dev server with hot-reload at `http://localhost:4321`.

### Build

```bash
bun run build
```

Outputs a Cloudflare Worker bundle to `dist/`.

### Preview

```bash
bun run preview
```

Serves the production build locally for testing.

### Test

```bash
bun run test
```

Runs the Vitest test suite. Use `bun run test:watch` during development for watch mode.

---

## Architecture

The site is a **single-page Astro site** deployed to Cloudflare Pages via the `@astrojs/cloudflare` adapter.

- **`layout.astro`** provides the root HTML shell, SEO metadata, font imports, and loads the global stylesheet + interaction script.
- **`pages/index.astro`** composes all sections in scroll order inside a `<main>` element.
- **Each section** is a self-contained Astro component with its own scoped `<style>` block for section-specific styling (background patterns, grid layouts, unique animations).
- **Shared styles** (CSS custom properties, reset, base typography, bento card system, reveal animations) live in `styles/global.css`.
- **`interactions.ts`** handles all client-side behavior: cinematic reveals via IntersectionObserver, active section highlighting, scroll progress, and the overlay navigation menu.

### Section Composition Order

```
Hero → Paradigm Shift → ARO Loop → Ecosystem → Deployment → Moat → Philosophy
```

---

## Design

- **Dark minimal aesthetic** — `#050505` background, subtle blue glows, glassmorphism cards
- **Typography** — Inter 300 (body) + JetBrains Mono (labels, monospace accents)
- **Color system** — CSS custom properties in `:root` for consistent theming
- **Motion** — CSS keyframe animations for backgrounds and text; JS-driven IntersectionObserver for scroll-triggered reveals

---

## Deployment

The site deploys to **Cloudflare Pages** via Wrangler. CI/CD is handled automatically by GitHub Actions on every push to `master`.

### Manual Deployment

**Prerequisites:**

1. [Install Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
2. Authenticate: `wrangler login`
3. Create a Cloudflare Pages project (first time only):

```bash
wrangler pages project create axiom-intelligence --production-branch master
```

**Deploy:**

```bash
bun run build
wrangler pages deploy dist/
```

### GitHub Secrets

For the CI/CD pipeline, add these secrets in your GitHub repository settings (`Settings → Secrets and variables → Actions`):

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | API token with Cloudflare Pages edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_PROJECT_NAME` | Your Cloudflare Pages project name (e.g. `axiom-intelligence`) |

### CI/CD Pipeline

GitHub Actions runs on every push and PR:

1. **Install** — Bun setup, dependency install, Cloudflare type generation
2. **Test** — Vitest unit tests
3. **Build** — Astro production build
4. **Deploy** — Automatic deploy to Cloudflare Pages on push to `master`

---

## License

All rights reserved. © Axiom Intelligence.
