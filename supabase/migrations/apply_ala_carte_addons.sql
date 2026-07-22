-- Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
-- Adds the reel/rush add-on columns for the à la carte booking flow.
-- extended3d_addon is left in place (unused going forward, harmless) rather
-- than dropped, to avoid a destructive schema change here.

ALTER TABLE public.media_booking_leads
    ADD COLUMN IF NOT EXISTS reel_addon  BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS rush_addon  BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE FUNCTION public.fn_media_booking_to_contact()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO public.contact_requests
        (who, full_name, email, company, phone, notes, source, status)
    VALUES
        ('Solo agent', NEW.agent_name, NEW.email, NEW.brokerage, NEW.phone,
         'Media booking: ' || NEW.property_type || ' @ ' || NEW.property_address ||
         ' | services: ' || NEW.package_interest ||
         ' | reel: ' || (NEW.reel_addon::TEXT) ||
         ' | tour: ' || (NEW.tour_addon::TEXT) ||
         ' | twilight: ' || (NEW.twilight_addon::TEXT) ||
         ' | rush: ' || (NEW.rush_addon::TEXT) ||
         ' | total: ' || COALESCE(NEW.quote_total::TEXT, 'n/a') ||
         ' | date: ' || NEW.preferred_date::TEXT,
         'bricks-booking', 'new');
    RETURN NEW;
END;
$$;
