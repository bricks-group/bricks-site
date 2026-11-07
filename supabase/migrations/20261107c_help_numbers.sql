-- Human case numbers ("Help #1001"), one shared sequence for email threads and chat cases.
create sequence if not exists public.support_help_no_seq start with 1001;
alter table public.support_email_threads add column if not exists help_no bigint unique default nextval('public.support_help_no_seq');
alter table public.support_cases add column if not exists help_no bigint unique default nextval('public.support_help_no_seq');
