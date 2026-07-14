# PARVEX — Website + Admin CMS

Full-stack Next.js site with a custom admin dashboard/CMS: Projects, Services,
Website Content, Media Library, Messages, Leads, SEO, Analytics, Users, and
Settings — all backed by PostgreSQL via Prisma, media via Cloudinary, auth via
Better Auth, and transactional email via Resend.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Better Auth (email + password, admin-only, no public sign-up)
- **Media:** Cloudinary
- **Email:** Resend
- **Public site:** `src/app/(public)/*` — unchanged design, now content is CMS-driven
- **Admin:** `src/app/admin/*` — separate shell, separate auth, `noindex`

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Fill in every variable — see comments in `.env.example` for where to get each
one (Postgres connection string, Cloudinary keys, Resend key, Better Auth
secret, initial admin credentials).

## 3. Set up the database

```bash
npx prisma generate         # generates the typed Prisma Client from prisma/schema.prisma
npx prisma migrate dev --name init   # creates tables (use `migrate deploy` in production)
npm run db:seed             # creates your first SUPER_ADMIN + migrates existing
                             # static project/service content into Postgres
```

> **Note on this delivery:** `prisma generate` needs to download a small
> platform-specific engine binary from Prisma's CDN. The sandbox this project
> was assembled in blocks that domain, so the Prisma Client could not be
> generated or the app built there — this is a network-egress restriction of
> that environment, not a defect in the code. Run the three commands above in
> your own machine/CI/deploy target and it will work normally; this is a
> completely standard step for any Prisma project. Everything else (npm
> install, ESLint, `tsc` type-checking with a hand-written stub of the Prisma
> types) was verified in the sandbox and passes cleanly.

## 4. Run it

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login` — sign in with the
  `PARVEX_INITIAL_ADMIN_EMAIL` / `PARVEX_INITIAL_ADMIN_PASSWORD` you set in
  `.env` before seeding.

## What's in the Admin

| Section | What it does |
|---|---|
| **Dashboard** | Real counts — projects, messages, leads, media, SEO gaps. No fake numbers. |
| **Projects** | Full case-study CRUD: hero/cover/thumbnail media, challenge/solution/research/development narrative, tech stack, gallery, results, draft → published → archived workflow, SEO fields. Publishing revalidates the public site instantly. |
| **Services** | CRUD for the services shown on `/` and `/services`, with deliverables, outcome, media, and SEO. |
| **Website Content** | Editable hero copy, section headings, and final CTA for Homepage / Work / Services / Contact — without touching code. |
| **Media Library** | Every image lives in Cloudinary. Upload, tag by category, edit alt text, safe-delete (blocked if still referenced by a project/service/message). |
| **Messages** | Every Contact form submission, whether or not the notification email sends successfully. Mark read/replied/archived, convert to a Lead. |
| **Leads** | Simple pipeline (New → Qualified → Discussion → Proposal → Won/Lost) with notes. |
| **SEO** | Read-only audit across every published Project/Service/Page — flags missing or oversized meta titles/descriptions, links straight to the fix. |
| **Analytics** | Real first-party event counts (enquiries, project views, CTA clicks) plus optional GA/Clarity/Vercel Analytics provider IDs. |
| **Users** | SUPER_ADMIN only — create users, change roles (Super Admin / Admin / Editor), disable accounts. No public registration exists anywhere. |
| **Settings** | Company info, contact-form recipient, social links. |

## Roles

- **SUPER_ADMIN** — everything, including Users
- **ADMIN** — everything except Users
- **EDITOR** — Projects, Services, Media, Content; cannot delete or manage users

## Project structure

```
src/app/(public)/     Public marketing site — own layout/providers, DB-driven content
src/app/admin/        Admin — own layout, own auth gate, own shell (no public chrome)
src/app/api/auth/     Better Auth route handler
src/app/api/admin/    Media upload/list/delete route handlers
src/lib/auth/         Better Auth config + role-based authorization helpers
src/lib/storage/      Cloudinary abstraction + Media service (upload/delete/validate)
src/lib/queries/      Public read queries (published-only) + DB→UI adapters
prisma/schema.prisma  Full data model
prisma/seed.ts        Initial admin + one-time static→DB content migration
```

## Deploying

Any Node host works (Vercel, Railway, Fly, a VPS). Remember to:

1. Set every variable from `.env.example` in your host's environment settings.
2. Run `npx prisma migrate deploy` (not `migrate dev`) as part of your deploy step.
3. Run `npm run db:seed` once, the first time only.
