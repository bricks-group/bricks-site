# bricks-site

Bricks **production www** — GTA listing-media booking and marketing site live at
[`www.brxs.ca`](https://www.brxs.ca).

**Rename note (2026-09):** GitHub `bricks-group/bricks-prelaunch` → `bricks-group/bricks-site`;
Vercel project `bricks-prelaunch` → `bricks-site` (domain `www.brxs.ca` unchanged). The old
separate `bricks-site` repo was deleted — **this** checkout is the production www repo now.

## Pages
- `index.html` / Next.js `src/app` — landing (overview, flip cards, audiences, live-vs-dev)
- `pricing.html` — standalone pricing (per-shoot rates by footprint)
- `book.html` / `/book` — live **Stripe Checkout** flow (Cal.com slots, pricing quote, payment, confirmation). Backed by e2e (`scripts/e2e_test_payment.py`).
- `photographers.html` / `/photographers` — photographer application → `https://dispatch-api.brxs.ca/api/onboarding/apply`
- `bricks-media-onepager.html` — print-out price card (not linked; attach manually)
- `about`, `gallery`, `contact`, `service-areas`, `terms`, `blog` — static / Next routes

## Backend (Supabase)
Edge functions in this repo include: `booking_lead`, `bricks_calendar`, `cal-slots`, `create-checkout`, `newsletter-signup`, `quote`, `stripe-webhook`. Booking uses `cal-slots` → `quote` → `create-checkout` → Stripe → `stripe-webhook`. Project ref: `rbywjnnctjglhcdemnnj`.

### Deploy
```bash
supabase link --project-ref rbywjnnctjglhcdemnnj
supabase db push
supabase functions deploy <function-name>
```
Live Vercel project: **`bricks-site`** (`prj_MZMxoOZTgR71Mxto7iMMPvUzJuIj`) → `www.brxs.ca`.

## Status
**This is the site live at `www.brxs.ca`.** Repo + Vercel project are both named `bricks-site`.
