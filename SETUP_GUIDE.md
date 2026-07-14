# PARVEX — Complete Setup Guide

This walks you through everything needed to get the website **and** the
`/admin` dashboard running, from a completely empty environment. No prior
experience with Postgres/Cloudinary/Resend assumed.

You need four things before the app will run:

1. **A Postgres database** (free options below)
2. **A Cloudinary account** (for images/files — free tier is enough)
3. **A Resend account** (to email you when someone submits the Contact form)
4. **Node.js 20+** installed on your machine

Total time: ~20 minutes.

---

## Step 0 — Unzip and install

```bash
unzip parvex-final.zip -d parvex
cd parvex
npm install
```

This installs Next.js, Prisma, Better Auth, Cloudinary's SDK, etc. Takes 1–2 minutes.

---

## Step 1 — Get a Postgres database

Pick **one**. Neon is the easiest if you've never set up a database before.

### Option A: Neon (recommended, free, 2 minutes)

1. Go to **https://neon.tech** → Sign up (GitHub login is fastest).
2. Click **Create a project**. Name it `parvex`, keep default region/version.
3. Once created, you'll land on a page with a **connection string** that looks like:
   ```
   postgresql://neondb_owner:AbC123xyz@ep-cool-name-12345.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Copy that whole string — you'll paste it into `.env` as `DATABASE_URL` in Step 4.

### Option B: Supabase (also free)

1. Go to **https://supabase.com** → New project.
2. Set a database password (remember it).
3. Go to **Project Settings → Database → Connection string → URI**.
4. Copy the URI and replace `[YOUR-PASSWORD]` in it with the password you set.

### Option C: Local Postgres (if you already have it installed)

```bash
createdb parvex
```
Your connection string is:
```
postgresql://postgres:yourpassword@localhost:5432/parvex
```

### Option D: Railway / Render

Both offer one-click Postgres with a connection string shown immediately after creation — same idea as above.

---

## Step 2 — Get Cloudinary credentials (for image/file uploads)

1. Go to **https://cloudinary.com** → Sign up for free.
2. After signing in, your **Dashboard** home page shows a box titled
   "Product Environment Credentials" with three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "Reveal" to see it)
3. Copy all three — you'll need them in Step 4.

You don't need to create any folders or upload presets — the app creates
folders automatically the first time you upload something (`parvex/projects`,
`parvex/services`, etc).

---

## Step 3 — Get a Resend API key (for email notifications)

This powers the email you get whenever someone submits the Contact form.
**The form still works and saves every enquiry to your database even if you
skip this step** — you'd just check `/admin/messages` instead of your inbox.

1. Go to **https://resend.com** → Sign up.
2. Go to **API Keys** in the left sidebar → **Create API Key**. Give it any name, full access.
3. Copy the key (starts with `re_`).
4. **Domain note:** Resend's test mode lets you send only to the email you
   signed up with, from `onboarding@resend.dev`. To send to your real
   business inbox from your own domain, go to **Domains** in Resend and
   verify your domain (add the DNS records they give you) — takes a few
   minutes if you manage your own domain's DNS.

If you want to skip this entirely for now, just leave `RESEND_API_KEY` blank
in `.env` — the app handles that gracefully.

---

## Step 4 — Create your `.env` file

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in every value. Here's exactly what goes where:

```bash
# From Step 1
DATABASE_URL="postgresql://...your-connection-string..."

# Generate this yourself — run the command below and paste the output
BETTER_AUTH_SECRET="paste-generated-value-here"

# Leave as-is for local dev; change to your real domain when you deploy
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Pick your own — this becomes your first login to /admin
PARVEX_INITIAL_ADMIN_EMAIL="you@example.com"
PARVEX_INITIAL_ADMIN_PASSWORD="ChooseAStrongPassword123"
PARVEX_INITIAL_ADMIN_NAME="Your Name"

# From Step 2
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# From Step 3 (optional — can leave blank)
RESEND_API_KEY="re_your_key_here"
CONTACT_FALLBACK_EMAIL="you@example.com"
```

**Generate `BETTER_AUTH_SECRET`:**

```bash
openssl rand -base64 32
```
(No `openssl`? Use `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` instead.)

Paste the output as the value of `BETTER_AUTH_SECRET`.

---

## Step 5 — Set up the database tables

Run these three commands in order:

```bash
npx prisma generate
```
Generates the typed database client from `prisma/schema.prisma`. Should finish in a few seconds with no errors.

```bash
npx prisma migrate dev --name init
```
Creates every table (Projects, Services, Users, Media, Messages, Leads, etc.) in your database. You'll see a list of created tables in the output.

```bash
npm run db:seed
```
This does three things in one go:
- Creates your first login (**Super Admin**) using the `PARVEX_INITIAL_ADMIN_EMAIL` / `PARVEX_INITIAL_ADMIN_PASSWORD` from your `.env`
- Creates sensible default homepage/work/services/contact content
- Migrates the example project/service content that shipped with the template into your new database, so the site isn't empty on first run

You should see output like:
```
Created initial SUPER_ADMIN: you@example.com
Seeded Settings and AnalyticsConfig.
Seeded default PageContent for Homepage/Work/Services/Contact.
Migrating 1 service(s)...
Migrating 1 project(s)...
```

---

## Step 6 — Run it

```bash
npm run dev
```

- **Public site:** http://localhost:3000
- **Admin dashboard:** http://localhost:3000/admin/login

Log in with the email/password you set as `PARVEX_INITIAL_ADMIN_EMAIL` /
`PARVEX_INITIAL_ADMIN_PASSWORD`. From there you can:

- Add/edit **Projects** and **Services** (with real image uploads via Cloudinary)
- Edit **Website Content** (homepage hero text, headings, CTAs) without touching code
- See **Messages** the moment someone submits the Contact form
- Create more team logins under **Users** (only visible to Super Admin)

---

## Troubleshooting

**"Can't reach database server"**
Your `DATABASE_URL` is wrong, or your database provider requires `?sslmode=require` at the end of the URL (Neon needs this — check it's there).

**`prisma generate` fails with a network/checksum error**
This means your network is blocking `binaries.prisma.sh`. Try a different network, or check any corporate firewall/proxy settings. This is unrelated to the app code — it's Prisma downloading its own engine.

**Login page says "Incorrect email or password"**
Check `.env` matches exactly what you typed at `npm run db:seed` time — if you change the password in `.env` *after* seeding, it won't retroactively update the already-created user. Either re-run seed against a fresh database, or add a new user via `/admin/users` once you're logged in with the original credentials.

**Uploaded images don't show up**
Double check all three `CLOUDINARY_*` values — a typo in `CLOUDINARY_API_SECRET` fails uploads silently until you check server logs.

**Contact form submits but you never get an email**
Check `/admin/messages` — the enquiry is always saved there regardless. If it's there but no email arrived, either `RESEND_API_KEY` is blank/wrong, or (in Resend test mode) you're sending to an address other than your signup email — verify a domain in Resend to fix this properly.

---

## Deploying (e.g. to Vercel)

1. Push this project to a GitHub repo.
2. Import it into Vercel.
3. In Vercel's **Environment Variables** settings, add every variable from your `.env` — but set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your real deployed URL (e.g. `https://parvex.in`), not `localhost`.
4. In your deploy command/build settings, make sure migrations run — either:
   - add `npx prisma migrate deploy &&` before your build command, or
   - run `npx prisma migrate deploy` manually once against your production `DATABASE_URL` from your own machine.
5. Run `npm run db:seed` once against production (with production `.env` values) to create your first Super Admin — or just create one manually since you can also do this from a local machine pointed at the same `DATABASE_URL`.

That's it — the dashboard and public site are now live together.
