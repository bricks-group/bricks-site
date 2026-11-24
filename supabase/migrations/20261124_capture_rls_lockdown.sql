-- Lock down capture tables on databases where 20260824_capture_schema.sql
-- already ran with its anon FOR ALL policies. Safe to re-run.
--   capture_sessions / capture_rooms → service role only
--   capture_pipeline                 → read-only for anon/authenticated

BEGIN;

DROP POLICY IF EXISTS "anon can manage capture sessions" ON public.capture_sessions;
DROP POLICY IF EXISTS "anon can manage capture rooms" ON public.capture_rooms;
DROP POLICY IF EXISTS "anon can read capture pipeline" ON public.capture_pipeline;

DROP POLICY IF EXISTS "service role manages capture sessions" ON public.capture_sessions;
DROP POLICY IF EXISTS "service role manages capture rooms" ON public.capture_rooms;
DROP POLICY IF EXISTS "service role manages capture pipeline" ON public.capture_pipeline;

ALTER TABLE public.capture_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_pipeline ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.capture_sessions, public.capture_rooms, public.capture_pipeline FROM anon, authenticated;
GRANT SELECT ON public.capture_pipeline TO anon, authenticated;

CREATE POLICY "service role manages capture sessions" ON public.capture_sessions
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "service role manages capture rooms" ON public.capture_rooms
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "anon can read capture pipeline" ON public.capture_pipeline
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "service role manages capture pipeline" ON public.capture_pipeline
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

COMMIT;
