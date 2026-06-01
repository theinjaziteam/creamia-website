# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** (App Router) with TypeScript
- **Tailwind CSS v4** — utility classes available, but most styling is done with inline `React.CSSProperties` objects using CSS custom properties
- **Framer Motion** — scroll-triggered animations via `AnimatedSection` wrapper and direct `motion.*` usage in the Hero
- **Three.js / @react-three/fiber / @react-three/drei** — installed but currently unused; available for 3D effects

## Architecture

This is a single-page marketing site for a Lebanese dessert brand (Cremi~). All page content lives in one file:

- **[app/page.tsx](app/page.tsx)** — the entire page: data arrays at top, then each section as a self-contained function component (`Navbar`, `Hero`, `MenuSection`, `BoxesSection`, `StorySection`, `Footer`, etc.), composed at the bottom in the default export. There are no separate route files.
- **[components/AnimatedSection.tsx](components/AnimatedSection.tsx)** — `useInView` wrapper that fades-in children on scroll (once). Use this for any new content sections.
- **[components/MarqueeBar.tsx](components/MarqueeBar.tsx)** — horizontally scrolling ticker listing all menu items; uses the `.marquee-track` keyframe defined in `globals.css`.
- **[app/globals.css](app/globals.css)** — CSS custom properties (design tokens) used everywhere: `--bg`, `--accent` (`#C4622D`), `--text`, `--text-mid`, `--text-soft`, `--border`, `--sand`, etc. All colors come from here.
- **[app/layout.tsx](app/layout.tsx)** — minimal root layout; loads Google Fonts (Cormorant Garamond + Inter) via CSS `@import`.
- **[public/](public/)** — `hero.mp4` and `hero-box.mp4` for the video hero background.

## Design conventions

- Typography: **Cormorant Garamond** (serif, italic) for headings and brand name; **Inter** for body/nav/labels.
- Brand accent is `var(--accent)` (`#C4622D`); hover state is `var(--accent-h)` (`#A84E22`).
- Inline styles are the norm — Tailwind is only used where it's simpler (e.g., layout helpers). Do not refactor inline styles to Tailwind classes unless asked.
- Responsive breakpoints are handled with inline `<style>` tags inside components (e.g., `@media (max-width: 768px)`), not Tailwind responsive prefixes.
- Section anchors (`#menu`, `#boxes`, `#story`) are used for in-page nav.
