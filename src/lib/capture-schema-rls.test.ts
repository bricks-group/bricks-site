/**
 * Spec for capture table access through the anon role.
 *
 * Supabase applies migrations/db/init-scripts/00000000000000-initial-schema.sql
 * as the postgres user (migrations/db/migrate.sh). That script's
 * ALTER DEFAULT PRIVILEGES grants anon SELECT/INSERT/UPDATE/DELETE on tables
 * postgres creates in public. PostgREST 16.1 then, on every Data API request,
 * runs set_config('role', <jwt role>, true) before the query
 * (PostgREST.Query.PreQuery.txVarQuery / SqlFragment.setConfigLocal) and maps
 * GET/POST/PATCH/PUT/DELETE to SELECT/INSERT/UPDATE/INSERT..ON CONFLICT/DELETE
 * (PostgREST.ApiRequest.getAction, Query.QueryBuilder.mutatePlanToQuery).
 *
 * These tests open a transaction as authenticator, switch to anon the same way,
 * and run that SQL against supabase/migrations/20260824_capture_schema.sql.
 * They fail while the anon FOR ALL policies allow every row.
 */
import { test, before, beforeEach, describe } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DB = 'bricks_capture_rls_test'
const JOB_A = '11111111-1111-1111-1111-111111111111'
const JOB_B = '22222222-2222-2222-2222-222222222222'
const SESSION_A = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const SESSION_B = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const ROOM_A = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
const ROOM_B = 'dddddddd-dddd-dddd-dddd-dddddddddddd'
const ADDR_A = '14 Client Lane'
const ADDR_B = '88 Other Road'

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../supabase/migrations/20260824_capture_schema.sql',
)

type SqlResult = { ok: boolean; stdout: string; stderr: string }

function psql(database: string, sql: string): SqlResult {
  try {
    const stdout = execFileSync(
      'sudo',
      ['-n', '-u', 'postgres', 'psql', '-d', database, '-v', 'ON_ERROR_STOP=1', '-X', '-q'],
      { input: sql, encoding: 'utf8' },
    )
    return { ok: true, stdout, stderr: '' }
  } catch (error) {
    const failed = error as { stdout?: string; stderr?: string }
    return { ok: false, stdout: failed.stdout ?? '', stderr: failed.stderr ?? '' }
  }
}

function must(database: string, sql: string): string {
  const result = psql(database, sql)
  assert.equal(result.ok, true, result.stderr || result.stdout)
  return result.stdout
}

/** Same role switch PostgREST runs before the main statement. */
function asAnon(statement: string): SqlResult {
  const sql = statement.trim().replace(/;?\s*$/, ';')
  return psql(
    DB,
    [
      'BEGIN;',
      'SET LOCAL ROLE authenticator;',
      // \\gset runs set_config and hides its result row. The GUC switch is
      // SET LOCAL role, which is what set_config(name, value, true) does.
      "SELECT set_config('role', 'anon', true) \\gset",
      '\\pset tuples_only on',
      '\\pset format unaligned',
      sql,
      'COMMIT;',
      '',
    ].join('\n'),
  )
}

function ownerRows(statement: string): string {
  const sql = statement.trim().replace(/;?\s*$/, ';')
  const result = psql(DB, `\\pset tuples_only on\n\\pset format unaligned\n${sql}\n`)
  assert.equal(result.ok, true, result.stderr || result.stdout)
  return result.stdout.trim()
}

const DENIED = /permission denied|row-level security policy/i

function expectNoAnonRows(statement: string): void {
  const result = asAnon(statement)
  if (!result.ok) {
    assert.match(result.stderr, DENIED, result.stderr)
    return
  }
  assert.equal(result.stdout.trim(), '', `anon read returned rows:\n${result.stdout}`)
}

function expectUnchanged(statement: string, readBack: string, expected: string): void {
  const attack = asAnon(statement)
  if (!attack.ok) assert.match(attack.stderr, DENIED, attack.stderr)
  assert.equal(ownerRows(readBack), expected)
}

before(() => {
  must('postgres', `DROP DATABASE IF EXISTS ${DB};`)
  must('postgres', `CREATE DATABASE ${DB};`)
  // Roles and default privileges copied from the postgres image init script
  // that migrate.sh runs as postgres, plus the later ALTER ROLE … INHERIT.
  must(DB, `
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOINHERIT NOLOGIN;
  END IF;
END $$;
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER ROLE anon INHERIT;
ALTER ROLE authenticated INHERIT;
ALTER ROLE service_role INHERIT;
CREATE TABLE public.jobs (id uuid PRIMARY KEY);
INSERT INTO public.jobs (id) VALUES ('${JOB_A}'), ('${JOB_B}');
`)
  must(DB, readFileSync(migrationPath, 'utf8'))
})

function reseed(): void {
  must(DB, `
DELETE FROM public.capture_rooms;
DELETE FROM public.capture_sessions;
DELETE FROM public.capture_pipeline;
INSERT INTO public.capture_sessions (id, job_id, property_address, property_meta, status, frame_count, rooms_captured)
VALUES
  ('${SESSION_A}', '${JOB_A}', '${ADDR_A}', 'client shoot A', 'in_progress', 4, 1),
  ('${SESSION_B}', '${JOB_B}', '${ADDR_B}', 'client shoot B', 'in_progress', 2, 1);
INSERT INTO public.capture_rooms (id, job_id, name, tone, frames, position)
VALUES
  ('${ROOM_A}', '${JOB_A}', 'Kitchen', 'bad', 3, 0),
  ('${ROOM_B}', '${JOB_B}', 'Loft', 'warn', 1, 0);
INSERT INTO public.capture_pipeline (title, detail, status, position)
VALUES
  ('Camera capture', '0/24 frames captured', 'todo', 0),
  ('Splatting', '0/5 passes', 'todo', 1),
  ('Quality control', 'Awaiting QC sign-off', 'todo', 2),
  ('Delivery', 'Awaiting delivery upload', 'todo', 3);
`)
}

describe('anon capture access', { concurrency: false }, () => {
beforeEach(() => {
  reseed()
})

test('owner still sees seeded capture rows', () => {
  assert.equal(
    ownerRows(`SELECT property_address || '|' || property_meta || '|' || status || '|' || frame_count FROM public.capture_sessions ORDER BY property_address`),
    `${ADDR_A}|client shoot A|in_progress|4\n${ADDR_B}|client shoot B|in_progress|2`,
  )
  assert.equal(
    ownerRows(`SELECT name || '|' || frames FROM public.capture_rooms ORDER BY name`),
    'Kitchen|3\nLoft|1',
  )
  assert.equal(ownerRows(`SELECT count(*) FROM public.capture_pipeline`), '4')
})

test('anon GET capture_sessions returns no rows', () => {
  expectNoAnonRows(`SELECT id, job_id, property_address, property_meta, status, frame_count, rooms_captured FROM public.capture_sessions`)
  expectNoAnonRows(`SELECT property_address, property_meta FROM public.capture_sessions WHERE job_id = '${JOB_B}'`)
})

test('anon POST capture_sessions does not insert', () => {
  expectUnchanged(
    `INSERT INTO public.capture_sessions (job_id, property_address, property_meta, status) VALUES ('${JOB_A}', 'injected address', 'injected meta', 'submitted')`,
    `SELECT count(*) FROM public.capture_sessions`,
    '2',
  )
})

test('anon PATCH capture_sessions does not rewrite any job', () => {
  expectUnchanged(
    `UPDATE public.capture_sessions SET status = 'submitted', frame_count = 99, property_address = 'rewritten' WHERE job_id = '${JOB_A}'`,
    `SELECT id || '|' || status || '|' || frame_count || '|' || property_address FROM public.capture_sessions ORDER BY id`,
    `${SESSION_A}|in_progress|4|${ADDR_A}\n${SESSION_B}|in_progress|2|${ADDR_B}`,
  )
  expectUnchanged(
    `UPDATE public.capture_sessions SET property_meta = 'sabotaged'`,
    `SELECT property_meta FROM public.capture_sessions ORDER BY id`,
    'client shoot A\nclient shoot B',
  )
})

test('anon DELETE capture_sessions does not remove a job', () => {
  expectUnchanged(
    `DELETE FROM public.capture_sessions WHERE job_id = '${JOB_B}'`,
    `SELECT id FROM public.capture_sessions ORDER BY id`,
    `${SESSION_A}\n${SESSION_B}`,
  )
})

test('anon PUT capture_sessions does not upsert over a job', () => {
  expectUnchanged(
    `INSERT INTO public.capture_sessions (id, job_id, property_address, property_meta, status, frame_count)
     VALUES ('${SESSION_A}', '${JOB_A}', 'upserted address', 'upserted meta', 'submitted', 50)
     ON CONFLICT (id) DO UPDATE SET property_address = EXCLUDED.property_address, property_meta = EXCLUDED.property_meta, status = EXCLUDED.status, frame_count = EXCLUDED.frame_count`,
    `SELECT property_address || '|' || status || '|' || frame_count FROM public.capture_sessions WHERE id = '${SESSION_A}'`,
    `${ADDR_A}|in_progress|4`,
  )
})

test('anon GET capture_rooms returns no rows', () => {
  expectNoAnonRows(`SELECT id, job_id, name, tone, frames, position FROM public.capture_rooms`)
  expectNoAnonRows(`SELECT name, frames FROM public.capture_rooms WHERE job_id = '${JOB_A}'`)
})

test('anon POST capture_rooms does not insert', () => {
  expectUnchanged(
    `INSERT INTO public.capture_rooms (job_id, name, tone, frames, position) VALUES ('${JOB_B}', 'Injected Room', 'ok', 9, 1)`,
    `SELECT count(*) FROM public.capture_rooms`,
    '2',
  )
})

test('anon PATCH capture_rooms does not rewrite any job', () => {
  expectUnchanged(
    `UPDATE public.capture_rooms SET frames = 0, tone = 'ok' WHERE job_id = '${JOB_A}'`,
    `SELECT id || '|' || frames || '|' || tone FROM public.capture_rooms ORDER BY id`,
    `${ROOM_A}|3|bad\n${ROOM_B}|1|warn`,
  )
  expectUnchanged(
    `UPDATE public.capture_rooms SET name = 'sabotaged'`,
    `SELECT name FROM public.capture_rooms ORDER BY id`,
    'Kitchen\nLoft',
  )
})

test('anon DELETE capture_rooms does not remove a job', () => {
  expectUnchanged(
    `DELETE FROM public.capture_rooms WHERE job_id = '${JOB_A}'`,
    `SELECT id FROM public.capture_rooms ORDER BY id`,
    `${ROOM_A}\n${ROOM_B}`,
  )
})

test('anon PUT capture_rooms does not upsert over a job', () => {
  expectUnchanged(
    `INSERT INTO public.capture_rooms (id, job_id, name, tone, frames, position)
     VALUES ('${ROOM_B}', '${JOB_B}', 'upserted', 'ok', 40, 0)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tone = EXCLUDED.tone, frames = EXCLUDED.frames`,
    `SELECT name || '|' || frames || '|' || tone FROM public.capture_rooms WHERE id = '${ROOM_B}'`,
    'Loft|1|warn',
  )
})

test('anon POST capture_pipeline does not add a stage', () => {
  expectUnchanged(
    `INSERT INTO public.capture_pipeline (title, detail, status, position) VALUES ('Injected', 'nope', 'active', 9)`,
    `SELECT count(*) FROM public.capture_pipeline WHERE title = 'Injected'`,
    '0',
  )
})

test('anon PATCH capture_pipeline does not change global stages', () => {
  expectUnchanged(
    `UPDATE public.capture_pipeline SET status = 'done', detail = 'sabotaged' WHERE position = 0`,
    `SELECT title || '|' || detail || '|' || status FROM public.capture_pipeline ORDER BY position`,
    [
      'Camera capture|0/24 frames captured|todo',
      'Splatting|0/5 passes|todo',
      'Quality control|Awaiting QC sign-off|todo',
      'Delivery|Awaiting delivery upload|todo',
    ].join('\n'),
  )
})

test('anon DELETE capture_pipeline does not remove a stage', () => {
  expectUnchanged(
    `DELETE FROM public.capture_pipeline WHERE position = 0`,
    `SELECT count(*) FROM public.capture_pipeline`,
    '4',
  )
})

test('anon PUT capture_pipeline does not upsert a stage', () => {
  const stageId = ownerRows(`SELECT id FROM public.capture_pipeline WHERE position = 0`)
  expectUnchanged(
    `INSERT INTO public.capture_pipeline (id, title, detail, status, position)
     VALUES ('${stageId}', 'Replaced', 'sabotaged', 'done', 0)
     ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, detail = EXCLUDED.detail, status = EXCLUDED.status`,
    `SELECT title || '|' || detail || '|' || status FROM public.capture_pipeline WHERE id = '${stageId}'`,
    'Camera capture|0/24 frames captured|todo',
  )
})

})
