# Plastic Company Platform

A production-grade fullstack web platform for an industrial plastic manufacturing company.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | TailwindCSS |
| Components | shadcn/ui-style architecture |
| Internationalization | next-intl |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | NestJS (modular architecture) |
| ORM | Prisma |
| Database | PostgreSQL |
| API Style | REST |

---

## Folder Structure

```
plastic-company-platform/
├── frontend/          # Next.js 15 App Router application
├── backend/           # NestJS REST API
├── docs/              # Architecture, API spec, and deployment docs
├── scripts/           # Dev environment and startup shell scripts
├── .gitignore
└── README.md
```

### Frontend (`frontend/src/`)

```
app/
├── (public)/          # Public-facing marketing site (layout with header/footer)
│   ├── page.tsx       # Home
│   ├── about/
│   ├── products/      # Listing + [slug] detail
│   ├── blog/          # Listing + [slug] article
│   └── contact/
└── (admin)/           # CMS dashboard (protected, sidebar layout)
    ├── products/
    ├── blog/
    ├── media/
    ├── messages/
    └── settings/
        ├── seo/
        └── languages/

components/
├── ui/                # Base UI atoms (shadcn-style: Button, Input, Badge…)
├── layout/            # Header, Footer, Nav
├── common/            # Breadcrumbs, SEO tags
├── products/          # ProductCard, ProductGrid
├── blog/              # ArticleCard, ArticleGrid
└── forms/             # ContactForm

features/              # Feature-sliced: api + components + hooks per domain
services/              # HTTP service adapters
hooks/                 # Global React hooks
lib/                   # api-client, i18n helpers, utilities
config/                # site-config, seo-config, locales-config
styles/                # globals.css, tailwind.css
translations/          # fa/ and en/ JSON message catalogs
```

### Backend (`backend/src/`)

```
config/                # Configuration loaders and env validation
common/                # Shared DTOs, filters, interceptors, guards, pipes
modules/
├── core/              # Core/shared NestJS providers
├── health/            # Health-check endpoint
├── auth/              # JWT authentication
├── users/             # User management
├── products/          # Products CRUD
├── blog/              # Blog articles CRUD
├── contact/           # Contact form + message storage
├── files/             # File/PDF upload management
└── seo/               # Per-page SEO configuration
prisma/                # schema.prisma (single source of truth for DB)
test/                  # E2E tests
```

---

## How Frontend and Backend Communicate

- The frontend communicates with the backend exclusively through **REST API calls**.
- All API calls go through `frontend/src/lib/api-client.ts`, a thin wrapper around `fetch`/axios.
- The API base URL is read from the environment variable:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1   # development
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1  # production
```

- Server Components (Next.js) call the API directly on the server side.
- Client Components use service modules in `frontend/src/services/`.

---

## Internationalization (i18n) Plan

Using **next-intl** for locale-aware routing and message loading.

| Phase | Locales |
|---|---|
| Phase 1 | `fa` (Persian / RTL), `en` (English / LTR) |
| Phase 2 | `ar` (Arabic), `tr` (Turkish), `ru` (Russian) |

- Default locale: `fa`
- Translation files live in `frontend/src/translations/{locale}/*.json`
- Locale routing is handled in `frontend/src/lib/i18n/routing.ts`
- RTL/LTR direction is toggled via the `<html dir="">` attribute in the root layout

---

## SEO Plan

- Every page exports a `generateMetadata()` function (Next.js 15 API).
- Shared SEO defaults are defined in `frontend/src/config/seo-config.ts`.
- Per-page SEO settings (title, description, OG image) are managed through the Admin → SEO section and stored in the backend `seo_configs` table.
- Structured data (JSON-LD) is injected via `frontend/src/features/seo/components/structured-data.tsx`.
- A `sitemap.ts` and `robots.ts` route handler will be added in the `app/` directory.

---

## Development Setup

> See `docs/deployment.md` for full details.

1. Copy `.env.example` files in both `frontend/` and `backend/` and fill in values.
2. Start the PostgreSQL database.
3. Run `scripts/start-dev.sh` (or start each app separately).

---

## License

Proprietary — All rights reserved.
