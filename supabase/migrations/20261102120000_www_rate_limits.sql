-- Durable store for www public-form rate limits (src/lib/rate-limit.ts).
-- Applied to prod rbywjnnctjglhcdemnnj on 2026-11-02 (Kam approved).
-- Access model: service_role only. RLS on with no policies; anon/authenticated
-- have no table or function privileges. The function is SECURITY INVOKER, so it
-- runs as the caller (service_role, which bypasses RLS) and grants nothing extra.
CREATE TABLE IF NOT EXISTS public.www_rate_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0
);
ALTER TABLE public.www_rate_limits ENABLE ROW LEVEL SECURITY; -- no policies: service_role only
REVOKE ALL ON TABLE public.www_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.www_rate_limits TO service_role;
COMMENT ON TABLE public.www_rate_limits IS 'www public-form fixed-window rate limit counters. service_role only (via public.www_rate_limit_hit).';

CREATE OR REPLACE FUNCTION public.www_rate_limit_hit(p_key text, p_window_seconds integer)
RETURNS integer LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  INSERT INTO public.www_rate_limits AS r (key, window_start, count) VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    window_start = CASE WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN now() ELSE r.window_start END,
    count        = CASE WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN 1 ELSE r.count + 1 END
  RETURNING count;
$$;
REVOKE EXECUTE ON FUNCTION public.www_rate_limit_hit(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.www_rate_limit_hit(text, integer) TO service_role;
