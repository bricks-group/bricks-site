-- NOT APPLIED (Sentinel 2026-11-02). Durable store for www public-form rate limits.
-- Until applied, www falls back to per-instance in-memory limits.
CREATE TABLE IF NOT EXISTS public.www_rate_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0
);
ALTER TABLE public.www_rate_limits ENABLE ROW LEVEL SECURITY; -- no policies: service_role only
REVOKE ALL ON public.www_rate_limits FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.www_rate_limit_hit(p_key text, p_window_seconds integer)
RETURNS integer LANGUAGE sql SECURITY INVOKER SET search_path = public AS $$
  INSERT INTO public.www_rate_limits AS r (key, window_start, count) VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    window_start = CASE WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN now() ELSE r.window_start END,
    count        = CASE WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN 1 ELSE r.count + 1 END
  RETURNING count;
$$;
REVOKE EXECUTE ON FUNCTION public.www_rate_limit_hit(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.www_rate_limit_hit(text, integer) TO service_role;
