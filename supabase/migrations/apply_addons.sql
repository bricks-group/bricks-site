-- Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
-- Adds the add-on + total columns the dynamic booking flow needs, and updates the mirror trigger.

ALTER TABLE public.media_booking_leads
    ADD COLUMN IF NOT EXISTS twilight_addon    BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS extended3d_addon  BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS quote_total       NUMERIC(10,2);

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
         ' | twilight: ' || (NEW.twilight_addon::TEXT) ||
         ' | ext3d: ' || (NEW.extended3d_addon::TEXT) ||
         ' | total: ' || COALESCE(NEW.quote_total::TEXT, 'n/a') ||
         ' | date: ' || NEW.preferred_date::TEXT,
         'bricks-booking', 'new');
    RETURN NEW;
END;
$$;
