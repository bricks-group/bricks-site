# bricks-prelaunch

Bricks **pre-launch** site — GTA listing-media booking, separated from the
production `bricks-site` / `Bricks-OS` repos. This is the beachhead: sell media
now, capture leads, upsell to the subscription platform at launch.

## Pages
- `index.html` — pre-launch landing (overview, flip cards, audiences, live-vs-dev)
- `pricing.html` — standalone pricing (per-shoot rates by footprint)
- `book.html` — 4-step booking wizard → Supabase lead capture
- `bricks-media-onepager.html` — print-out price card (not linked; attach manually)

## Backend (Supabase)
- `supabase/migrations/20260717_media_booking_leads.sql` — `media_booking_leads`
  table + trigger mirroring into `contact_requests`. Has `upsell_stage`
  (default `media_only`) for later subscription upsell.
- `supabase/functions/booking_lead/index.ts` — edge function; writes leads via
  the service-role key (server-side only; no anon write policy).

### Deploy
```bash
supabase link --project-ref ctqwxwrcxwruaqojohpf
supabase db push
supabase functions deploy booking_lead
```
The booking wizard POSTs to `…/functions/v1/booking_lead` with the publishable
key header; on failure it falls back to `mailto:booking@brxs.ca`.

## Status
Pre-launch. The production `bricks-site` (launched platform) is a separate repo.
