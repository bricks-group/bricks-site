-- Run this ONCE in Supabase Dashboard → SQL Editor → New query → Run.
-- Security Advisor: fn_media_booking_to_contact has a mutable search_path.
-- Pinning it doesn't change behavior -- it only prevents a role with CREATE
-- privilege on another schema from shadowing an object this function calls.

ALTER FUNCTION public.fn_media_booking_to_contact() SET search_path = 'public';
