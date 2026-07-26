# STYLOBATE DESIGN STUDIO — Architecture Studio Website (Prototype)

Premium architecture studio website prototype, built for client approval.
All content, images, and copy are placeholders. No CRUD, authentication, or
database operations are implemented yet — this stage is UI/UX only.

## Tech Stack

- Next.js 14 (App Router) + React + TypeScript
- Tailwind CSS
- Supabase (client configured only — no queries yet)
- Netlify (deployment target)

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # optional at this stage — no Supabase calls are made yet
npm run dev
```

## Project Structure

```
src/
  app/                     Route segments (App Router)
    layout.tsx             Root layout — fonts, Navbar, Footer
    page.tsx                Home
    about/page.tsx          About
    projects/page.tsx       Projects
    testimonials/page.tsx   Testimonials
    contact/page.tsx        Contact
    admin/login/page.tsx    Admin Login (UI only)
    globals.css             Design tokens, base styles, blueprint-grid utilities
  components/
    layout/                 Navbar, Footer
    ui/                     Button, SectionTitle, Card — shared across all pages
    sections/
      home/                 Home page sections (Hero, Intro, Services, etc.)
      about/                About page sections
      ProjectsHeader.tsx, ProjectsGrid.tsx, ContactForm.tsx
  data/                     Placeholder content (projects, testimonials, services, team, nav)
  lib/supabase/client.ts    Supabase client (env-var driven, not yet used for queries)
  types/index.ts            Shared TypeScript types
```

## Design System

- **Colors**: paper `#F7F6F3`, ink `#0A0A0A`, charcoal `#2B2B28`, stone `#8C8C87`,
  hairline `#DEDBD3`, brass accent `#A98554` (see `tailwind.config.ts`)
- **Type**: Space Grotesk (display/headings), Inter (body), IBM Plex Mono
  (labels, captions, drafting-style annotations)
- **Signature motif**: blueprint corner coordinates (A1/B1/…) on full-bleed
  sections — a nod to architectural drawing conventions

## Conventions for Future Stages

- Keep using the existing component structure (`components/ui`, `components/layout`,
  `components/sections/<page>`) — do not flatten or restructure.
- Placeholder data lives in `src/data/*.ts`, typed via `src/types/index.ts`.
  When Supabase tables are introduced, replace the static arrays with fetches
  but keep the same shape where possible to minimize component changes.
- Supabase client: `src/lib/supabase/client.ts`. CRUD, auth, and admin
  dashboard logic will be added here and in new `app/admin/**` routes in a
  later stage — do not implement ahead of schedule.
- Tailwind tokens (colors, fonts, spacing) are centralized in
  `tailwind.config.ts` — extend rather than hard-code new values.
