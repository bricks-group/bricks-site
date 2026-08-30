-- Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
--
-- Payment idempotency fix (launch-readiness audit, 2026-08-30).
-- supabase/functions/stripe-webhook/index.ts relies on a unique-constraint
-- violation (Postgres 23505 / PostgREST 409) on stripe_session_id to detect a
-- duplicate Stripe webhook delivery and skip re-creating the dispatch job,
-- Cal.com booking, and owner SMS/email. No such constraint has ever existed
-- on public.media_booking_leads (verified live 2026-08-30 -- only the primary
-- key). So every retried delivery (Stripe retries on timeout or a non-2xx
-- response) silently inserts a second lead row with its own new UUID, which
-- the "already have a job for this booking_id" check in ensureDispatchJob
-- can't catch either -- producing a duplicate dispatch job, a duplicate
-- Cal.com booking, and a duplicate SMS/email page to the owner for the same
-- paid shoot.
--
-- Verified live (2026-08-30) that no existing rows collide, so this is safe
-- to apply as-is. Partial (NULLS allowed) since not every lead flow sets
-- this column.
CREATE UNIQUE INDEX IF NOT EXISTS media_booking_leads_stripe_session_id_key
    ON public.media_booking_leads (stripe_session_id)
    WHERE stripe_session_id IS NOT NULL;
