# Editorial Industrial UI — Implementation Plan

> **For agentic workers:** Implement task-by-task. Frontend only.

**Goal:** Rebuild all public pages with Editorial Industrial shell (glass sidebar + parallax).

**Architecture:** Shared `PublicShell` (GlassSidebar + MobileHeader) wrapping `(public)/layout`; page-level heroes and section restyles; motion via `motion/react` + existing ScrollReveal.

**Tech Stack:** Next.js 15, Tailwind, next-intl, motion, lucide-react

## Global Constraints

- No backend / Nest / Prisma schema / admin changes
- Preserve i18n routes and Prisma data reads
- Brand colors from CLAUDE.md
- Radii md/lg only; crisp borders

## Tasks

- [ ] Shell components + public layout
- [ ] Parallax / PageHero primitives
- [ ] Home hero + section polish
- [ ] Products explorer / detail / category visual pass
- [ ] About, contact, catalog, blog visual pass
- [ ] Atmosphere images if needed
- [ ] Local verify on :3000
