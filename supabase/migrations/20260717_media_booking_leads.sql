-- Media beachhead lead capture.
-- The booking wizard (bricks-site/book.html) POSTs to the booking-lead edge
-- function, which writes here using the service-role key (server-side). RLS
-- blocks anon inserts on purpose — the browser never holds a write key.
--
-- Purpose: capture pre-launch media-booking demand now, so we can upsell these
-- leads to the subscription model once it launches. `upsell_stage` tracks that
-- journey; starts at 'media_only'.

CREATE TABLE IF NOT EXISTS public.media_booking_leads (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- who booked
    agent_name          TEXT NOT NULL,
    brokerage           TEXT,
    email               TEXT NOT NULL,
    phone               TEXT,

    -- the shoot
    property_address    TEXT NOT NULL,
    property_type       TEXT NOT NULL,          -- Condo | Semi/Town | Detached | Multiplex | Commercial | Estate
    package_interest    TEXT NOT NULL,          -- Standard | Premium | Luxury | Estate | Not sure — advise me
    tour_addon          BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_date      DATE NOT NULL,
    preferred_window    TEXT,                   -- Morning | Afternoon | Either
    notes               TEXT,

    -- upsell tracking: media_only -> subscription_offered -> subscribed (set later)
    upsell_stage        TEXT NOT NULL DEFAULT 'media_only',
    source              TEXT NOT NULL DEFAULT 'bricks-booking',
    status              TEXT NOT NULL DEFAULT 'new',   -- new | contacted | booked | closed
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_booking_leads_created_at
    ON public.media_booking_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_booking_leads_status
    ON public.media_booking_leads (status);
CREATE INDEX IF NOT EXISTS idx_media_booking_leads_upsell
    ON public.media_booking_leads (upsell_stage);

-- Mirror into the existing landing-lead pipeline so contact_requests stays the
-- single "all leads" view the team already queries.
CREATE OR REPLACE FUNCTION public.fn_media_booking_to_contact()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO public.contact_requests
        (who, full_name, email, company, phone, notes, source, status)
    VALUES
        ('Solo agent', NEW.agent_name, NEW.email, NEW.brokerage, NEW.phone,
         'Media booking: ' || NEW.property_type || ' @ ' || NEW.property_address ||
         ' | pkg: ' || NEW.package_interest ||
         ' | tour: ' || (NEW.tour_addon::TEXT) ||
         ' | date: ' || NEW.preferred_date::TEXT,
         'bricks-booking', 'new');
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_media_booking_to_contact ON public.media_booking_leads;
CREATE TRIGGER trg_media_booking_to_contact
    AFTER INSERT ON public.media_booking_leads
    FOR EACH ROW EXECUTE FUNCTION public.fn_media_booking_to_contact();

ALTER TABLE public.media_booking_leads ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies: inserts are service-role only (edge function).
-- Reads go through the bricks service role / internal API, per service_boundaries.

INSERT INTO public.service_boundaries (table_name, owner_services, read_services, note)
    VALUES
        ('media_booking_leads', ARRAY['bricks'], ARRAY['bricks','bricks-os'],
         'Pre-launch media-booking wizard leads; upsell target for subscription launch')
ON CONFLICT (table_name) DO UPDATE
    SET owner_services = EXCLUDED.owner_services,
        read_services  = EXCLUDED.read_services,
        note           = EXCLUDED.note;
