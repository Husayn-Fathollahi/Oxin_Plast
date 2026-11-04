# Salman Plastic — Editorial Industrial Public UI

**Date:** 2026-10-24  
**Scope:** All public pages (frontend only). No backend / Prisma / admin changes.  
**Direction:** Editorial Industrial, differentiated from oxinplast.ir.

## Decisions locked

- Pages: home, products, category, product detail, blog list/detail, catalog, about, contact
- Nav: hybrid — desktop sticky glass vertical sidebar (RTL end), mobile sticky glass top header
- Visual: Editorial Industrial (full-bleed hero, strong typography, crisp borders, Teal/Graphite)
- Architecture: Shell-First rebuild

## Shell

- Desktop ≥1024: fixed glass rail ~72–88px collapsed / expands on hover/focus; logo, icon+label nav, language, CTA
- Mobile: top glass header + drawer
- Content column offset for rail; footer inside content column

## Motion

- Hero parallax 2–3 layers
- ScrollReveal on section entries
- Active rail indicator on route

## Brand tokens

- Deep Teal `#164E53`, Teal `#0D9488`, Ice `#CCFBF1`, Canvas `#F8FAFC`, Ink `#0F172A`
- Radii `rounded-md` / `rounded-lg`; borders over heavy shadows; no neon gradients; no huge pills

## Differentiation vs oxinplast

- Vertical glass rail vs horizontal top nav
- Full-bleed editorial hero vs centered product card + floating badges
- Pedal bins / picnic baskets product language vs cooler/tank industrial copy
