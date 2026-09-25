create extension if not exists pgcrypto;

create table if not exists public.diagnostic_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  responsible jsonb not null default '{}'::jsonb,
  company jsonb not null default '{}'::jsonb,
  model text not null,
  services jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '{}'::jsonb,
  task_details text not null default '',
  operations jsonb not null default '{}'::jsonb,
  situation jsonb not null default '{}'::jsonb,
  objectives jsonb not null default '{}'::jsonb,
  notification_status text not null default 'pending',
  notification_error text,
  notified_at timestamptz
);

alter table public.diagnostic_submissions enable row level security;

drop policy if exists "public can submit diagnostics" on public.diagnostic_submissions;
create policy "public can submit diagnostics"
  on public.diagnostic_submissions
  for insert
  to anon, authenticated
  with check (model in ('AVENCA','PONTUAL'));

create index if not exists diagnostic_submissions_submitted_at_idx
  on public.diagnostic_submissions (submitted_at desc);
