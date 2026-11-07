-- Bricks help automation (2026-11-07)
-- Chat escalations (support_cases) and the help@ inbound email pipeline
-- (events, threads, messages, outbound reply ledger). Server-only: RLS is on and
-- anon/authenticated get no privileges, so a website visitor can never read
-- another visitor's case. Writes happen only from bricks-site API routes using
-- the service role. Human work queue stays public.ops_escalations.

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  channel text not null check (channel in ('chat','email')),
  status text not null default 'open' check (status in ('open','in_progress','resolved','spam')),
  contact_email text not null,
  consent_at timestamptz not null,
  reasons text[] not null default '{}',
  summary text not null,
  transcript jsonb not null default '[]'::jsonb,
  page_path text,
  index_version text,
  ops_escalation_id uuid references public.ops_escalations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.support_cases is 'Help assistant escalations: visitor consented to share transcript + email. Mirrored into ops_escalations (escalation_type=support_chat). Server-only.';

create table if not exists public.support_email_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'resend',
  provider_event_id text not null unique,
  email_id text,
  event_type text not null,
  status text not null default 'received' check (status in ('received','processing','processed','ignored','suppressed','pending_fetch','failed','dead_letter')),
  attempts integer not null default 0,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.support_email_events is 'Signed inbound webhook deliveries (dedupe on provider_event_id = svix-id). dead_letter after max attempts.';

create table if not exists public.support_email_threads (
  id uuid primary key default gen_random_uuid(),
  thread_key text not null unique,
  subject text,
  customer_email text not null,
  status text not null default 'open' check (status in ('open','escalated','drafted','answered','closed')),
  category text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.support_email_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.support_email_threads(id) on delete cascade,
  direction text not null default 'inbound' check (direction in ('inbound','outbound')),
  provider_email_id text unique,
  rfc_message_id text unique,
  in_reply_to text,
  references_header text,
  from_email text not null,
  to_emails text[] not null default '{}',
  subject text,
  text_body text,
  received_at timestamptz,
  classification jsonb,
  suppressed_reason text,
  created_at timestamptz not null default now()
);
create index if not exists support_email_messages_thread_idx on public.support_email_messages(thread_id, created_at);

create table if not exists public.support_email_outbound (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.support_email_threads(id) on delete cascade,
  inbound_message_id uuid references public.support_email_messages(id) on delete set null,
  idempotency_key text not null unique,
  mode text not null default 'shadow' check (mode in ('shadow','auto')),
  status text not null default 'shadow' check (status in ('shadow','queued','sent','suppressed','failed','cancelled')),
  category text,
  needs_kam boolean not null default true,
  escalation_reasons text[] not null default '{}',
  to_email text not null,
  subject text,
  body_text text not null,
  citations jsonb not null default '[]'::jsonb,
  index_version text,
  ops_escalation_id uuid references public.ops_escalations(id) on delete set null,
  provider_message_id text,
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
comment on table public.support_email_outbound is 'Reply ledger for help@. mode=shadow rows are drafts only and are never sent. Auto-send requires SUPPORT_AUTOSEND_ENABLED and an allowlisted category.';

alter table public.support_cases enable row level security;
alter table public.support_email_events enable row level security;
alter table public.support_email_threads enable row level security;
alter table public.support_email_messages enable row level security;
alter table public.support_email_outbound enable row level security;

revoke all on public.support_cases, public.support_email_events, public.support_email_threads, public.support_email_messages, public.support_email_outbound from anon, authenticated;

-- Explicit deny-by-default: only the service role (server routes) may touch support tables.
do $$
declare t text;
begin
  foreach t in array array['support_cases','support_email_events','support_email_threads','support_email_messages','support_email_outbound'] loop
    execute format('drop policy if exists %I on public.%I', t || '_service_role_all', t);
    execute format('create policy %I on public.%I for all to service_role using (true) with check (true)', t || '_service_role_all', t);
  end loop;
end $$;
