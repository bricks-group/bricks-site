# bricks-prelaunch

Bricks **pre-launch** site — GTA listing-media booking, separated from the
production `bricks-site` / `Bricks-OS` repos. This is the beachhead: sell media
now, capture leads, upsell to the subscription platform at launch.

## Pages
- `index.html` — pre-launch landing (overview, flip cards, audiences, live-vs-dev)
- `pricing.html` — standalone pricing (per-shoot rates by footprint)
- `book.html` — **corrected 2026-07-27**: this is a real, live **Stripe Checkout** flow, not a lead-capture form — real Cal.com slot booking, a live pricing quote, a real payment redirect, and post-payment confirmation handling. Materially more built than "booking wizard → lead capture" suggests. Backed by a working e2e test (`scripts/e2e_test_payment.py`).
- `photographers.html` — **added 2026-07-27, live at brxs.ca.** Photographer application form, POSTs to `https://dispatch-api.brxs.ca/api/onboarding/apply`. Nav links added to all 9 other pages. Redesigned same day to actually match this site's visual system (hairline-bordered grids, `.sec-head`/`.over` section headers, reveal-on-scroll) — the first version was a generic form-page bolted on, not built from this repo's own patterns. **CORS status against Dispatch's backend is still unconfirmed** — Dispatch's code defaults to an allowlist that does not include `brxs.ca`/`www.brxs.ca`; whether the live env var differs is unverified. Test an actual submission before trusting this works.
- `bricks-media-onepager.html` — print-out price card (not linked; attach manually)
- `about.html`, `gallery.html`, `contact.html`, `service-areas.html`, `terms.html`, `blog.html` (+ 4 posts under `blog/`) — static content, mailto CTA only, no backend calls.

## Backend (Supabase)
**Corrected 2026-07-27 — this list was incomplete.** 6 edge functions exist, not 1: `booking_lead`, `bricks_calendar`, `cal-slots`, `create-checkout`, `newsletter-signup`, `quote`, `stripe-webhook`. `book.html` no longer calls `booking_lead` at all — it uses `cal-slots` → `quote` → `create-checkout` → Stripe redirect → `stripe-webhook`. 4 more migration files exist beyond `20260717_media_booking_leads.sql` (`apply_addons.sql`, `apply_ala_carte_addons.sql`, `apply_newsletter.sql`, `apply_search_path_fix.sql`). All of this repo's edge functions set `Access-Control-Allow-Origin: *` (wide open) — a different backend than Dispatch's, whose CORS posture is stricter and unconfirmed for this domain (see `photographers.html` note above).

### Deploy
```bash
supabase link --project-ref ctqwxwrcxwruaqojohpf
supabase db push
supabase functions deploy <function-name>   # one of the 6 listed above
```
No `vercel.json` or CI/CD config exists in this repo — whether push-to-`main` auto-deploys to the live Vercel project (`bricks-prelaunch`) can't be determined from repo contents; check the Vercel dashboard.

## Status
**This is the site actually live at `brxs.ca` right now — confirmed 2026-07-27.** `bricks-site` (the Next.js repo) is fully built, including a complete vendor-onboarding flow, but is NOT deployed/live despite being the more "production-looking" repo — see `/Volumes/BRICKS/BRICKS_STATUS.md` for the full picture. Don't assume repo name implies launch status.
