-- bricks-capture: schema for capture flow data
-- Apply with:  cd /Volumes/Bricks/bricks-prelaunch && npx supabase db push
-- Needs:       Docker (Colima) running OR service_role key in .env
--
-- These tables back the capture-api.ts functions.
-- Contract (Claude can diff capture-api.ts against this migration):
--   getCaptureSession(jobId)     → capture_rooms (filtered by job_id) +
--                                    capture_pipeline (global, no filter) +
--                                    jobs (meta by id)
--   submitCaptureSession(jobId)  → capture_sessions.status = 'submitted'
--   bumpFrameCount(jobId)        → capture_sessions.frame_count += 1
--
-- IMPORTANT: capture_pipeline is GLOBAL — stages are the same for every job.
-- The API reads it without a job_id filter. Do NOT add job_id FK or filter.

BEGIN;

-- ── capture_sessions ──────────────────────────────────────────────────────────
-- One row per capture session. Created when the vendor starts capture on a job.
-- The capture screens write frame_count + status here as they shoot.
CREATE TABLE IF NOT EXISTS public.capture_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_id          UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- aggregate counters
    frame_count     INTEGER NOT NULL DEFAULT 0,
    rooms_captured  INTEGER NOT NULL DEFAULT 0,

    -- pipeline submission state
    status          TEXT NOT NULL DEFAULT 'in_progress',  -- in_progress | submitted
    submitted_at    TIMESTAMPTZ,

    -- denormalised job snapshot (so the API can return address/meta without joining)
    property_address TEXT,
    property_meta    TEXT,

    CONSTRAINT fk_capture_session_job FOREIGN KEY (job_id)
        REFERENCES public.jobs(id) ON DELETE CASCADE
);

ALTER TABLE public.capture_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can manage capture sessions" ON public.capture_sessions
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_capture_sessions_job
    ON public.capture_sessions(job_id);

-- ── capture_rooms ─────────────────────────────────────────────────────────────
-- Per-room coverage. Filtered by job_id in the API.
-- The capture screen increments `frames` as the vendor shoots each room.
CREATE TABLE IF NOT EXISTS public.capture_rooms (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    job_id      UUID NOT NULL,
    name        TEXT NOT NULL,                        -- "Kitchen", "Living Room", ...
    tone        TEXT NOT NULL DEFAULT 'bad',          -- ok | warn | bad
    frames      INTEGER NOT NULL DEFAULT 0,           -- frame count for this room
    position    INTEGER NOT NULL,                      -- ordering for the dome/grid

    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT fk_capture_room_job FOREIGN KEY (job_id)
        REFERENCES public.jobs(id) ON DELETE CASCADE
);

ALTER TABLE public.capture_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can manage capture rooms" ON public.capture_rooms
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_capture_rooms_job
    ON public.capture_rooms(job_id);

-- ── capture_pipeline ──────────────────────────────────────────────────────────
-- Global pipeline stage definitions — same for every job, no job_id column.
-- The API reads these without filtering by job_id.
CREATE TABLE IF NOT EXISTS public.capture_pipeline (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title     TEXT NOT NULL,                           -- "Camera capture", "Splatting", ...
    detail    TEXT NOT NULL,                           -- "0/24 frames captured", ...
    status    TEXT NOT NULL DEFAULT 'todo',            -- todo | active | done
    position  INTEGER NOT NULL,                        -- ordering for the stepper

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.capture_pipeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can read capture pipeline" ON public.capture_pipeline
    FOR ALL TO anon
    USING (true)
    WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_capture_pipeline_position
    ON public.capture_pipeline(position);

-- Seed default pipeline stages (global — no job_id column on this table).
INSERT INTO public.capture_pipeline (title, detail, status, position)
    SELECT * FROM (VALUES
        ('Camera capture',      '0/24 frames captured',           'todo',    0),
        ('Splatting',           '0/5 passes',                     'todo',    1),
        ('Quality control',     'Awaiting QC sign-off',           'todo',    2),
        ('Delivery',            'Awaiting delivery upload',      'todo',    3)
    ) AS v(title, detail, status, position)
WHERE NOT EXISTS (SELECT 1 FROM public.capture_pipeline LIMIT 1);

COMMIT;
