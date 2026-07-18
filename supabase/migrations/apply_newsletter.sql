-- Run ONCE in Supabase Dashboard → SQL Editor → New query → Run.
-- Creates the pre-launch newsletter subscribers table (service-role writes only).

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    email        TEXT PRIMARY KEY,
    source       TEXT NOT NULL DEFAULT 'bricks-prelaunch',
    confirmed    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created
    ON public.newsletter_subscribers (created_at DESC);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: inserts go through the service-role edge function.
