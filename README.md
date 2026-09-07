# bricks-prelaunch

Bricks **pre-launch** site — GTA listing-media booking. This is the live, revenue-
generating site at `www.brxs.ca`. **Rewritten 2026-09-07** — this file described a
pre-migration static-HTML architecture (`index.html`, `book.html`, `photographers.html`
served directly) that no longer matches the repo: it migrated to **Next.js 16 +
React 19** on 2026-07-27. The root-level `.html` files still in this repo are
vestigial — Next.js doesn't serve loose root `.html` files, and `next.config.ts`'s
`redirects()` 308-redirects each of them (`/book.html`, `/photographers.html`, etc.)
to its real route. Confirmed live via curl: `/book.html` and `/photographers.html`
both 308 to `/book` / `/photographers`, which 200.

## Pages (`src/app/`)
- `page.tsx` — landing page
- `book/page.tsx` + `book/BookingWizard.tsx` — real, live **Stripe Checkout** flow:
  live Cal.com slot booking → pricing quote → Stripe redirect → post-payment
  confirmation. Package tiers are à-la-carte (`Photos only`/`Essentials`/`Story`/
  `Showcase`/`Full suite` — "Showcase" here is a tier name, not a demo feature).
- `photographers/page.tsx` + `photographers/PhotographerForm.tsx` — photographer
  application form, POSTs to `https://dispatch-api.brxs.ca/api/onboarding/apply`.
  Has a client-side honeypot (`company_website`, hidden field, silently rejects
  autofilling bots before any network call) whose value is also forwarded to
  Dispatch's `/apply` endpoint, which independently re-checks it server-side
  (`Bricks-Dispatch/backend/app/routers/onboarding.py`) — real defense-in-depth,
  not just a client-side trick a bot could bypass by skipping the form's JS.
  **CORS confirmed working 2026-09-07**: a live OPTIONS preflight against
  `dispatch-api.brxs.ca` with `Origin: https://www.brxs.ca` returns
  `access-control-allow-origin: https://www.brxs.ca` — Dispatch's `ALLOWED_ORIGINS`
  default already includes `www.brxs.ca`/`brxs.ca`.
- `platform/page.tsx` — static marketing overview of the three-surface ecosystem
  (OS/Booking/GO) and audience roles (Office/Team/Agent/Photographer). Plain
  reveal-on-scroll sections, no interactive product demo — do not confuse this with
  the retired `bricks-site` repo's `ShowcaseSection.tsx` scroll-driven showcase,
  which was never ported here (see that repo's CLAUDE.md correction).
- `agents/page.tsx`, `office/page.tsx` — role-specific landing pages (OS pitch for
  agents/teams and offices).
- `fall-market/page.tsx` — seasonal campaign landing page.
- `pricing/page.tsx`, `gallery/page.tsx`, `about/page.tsx`, `contact/page.tsx`,
  `service-areas/page.tsx`, `terms/page.tsx`, `privacy/page.tsx`, `blog/page.tsx` +
  4 post pages — content pages, most with `application/ld+json` structured data for
  SEO/AEO.
- `api/address-suggest`, `api/contact`, `api/newsletter` — Next.js route handlers
  (separate from the Supabase edge functions below).
- `sitemap.ts` / `robots.ts` — real, generated from routes.

Root-level `.html` files (`index.html`, `book.html`, `photographers.html`,
`bricks-media-onepager.html`, `about.html`, `gallery.html`, `contact.html`,
`service-areas.html`, `terms.html`, `blog.html`) are pre-migration leftovers kept
only so their redirect targets exist to redirect *from* — do not edit them
expecting it to affect the live site.

## Backend (Supabase)
7 edge functions in `supabase/functions/`: `booking_lead`, `bricks_calendar`,
`cal-slots`, `create-checkout`, `newsletter-signup`, `quote`, `stripe-webhook`.
`book/BookingWizard.tsx`'s flow is `cal-slots` (real Cal.com API v2 calls,
`api.cal.com/v2/slots` + `/v2/bookings`) → `quote` → `create-checkout` (real Stripe
Checkout Session creation, `api.stripe.com/v1/checkout/sessions`) → Stripe redirect
→ `stripe-webhook` (verifies Stripe's HMAC signature correctly — reads the `v1=`
bucket per Stripe's actual header format, not the `v=` bug an earlier version had;
writes `media_booking_leads`, best-effort creates a `jobs` row and a Cal.com booking,
best-effort owner SMS/email). All edge functions set
`Access-Control-Allow-Origin: *` (wide open) — a different, looser CORS posture than
Dispatch's own backend.

### Deploy
```bash
supabase link --project-ref ctqwxwrcxwruaqojohpf
supabase db push
supabase functions deploy <function-name>   # one of the 7 listed above
```
`vercel.json` here just declares `@vercel/next` as the builder — standard Next.js
build, no custom routing.

## Status
**This is the site actually live at `www.brxs.ca`** — confirmed 2026-09-07 via curl
(title tag, `/health`-equivalent routes, live Stripe/Cal.com/photographer-application
calls all respond correctly). `bricks-site` (a separate, now-retired Next.js repo) was
evaluated and its own work was not ported — this repo's `/photographers` flow already
covers the same ground. No test suite exists in this repo (no test script in
`package.json`, no test files) — the live-flow claims above were verified by reading
the deployed code paths directly, not by running an automated suite.
