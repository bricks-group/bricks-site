-- help@ owner alerts + manual review (Approve & send / Dismiss)
alter table public.support_email_outbound add column if not exists alerted_at timestamptz;
alter table public.support_email_outbound add column if not exists alert_message_id text;
alter table public.support_email_outbound add column if not exists alert_error text;
alter table public.support_email_outbound add column if not exists reviewed_at timestamptz;
alter table public.support_email_outbound add column if not exists edited boolean not null default false;
alter table public.support_email_outbound drop constraint if exists support_email_outbound_mode_check;
alter table public.support_email_outbound add constraint support_email_outbound_mode_check check (mode in ('shadow','auto','manual'));
