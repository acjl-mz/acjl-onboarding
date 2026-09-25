create extension if not exists pgcrypto;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key,
  role_id uuid references public.roles(id),
  full_name text not null,
  email text unique not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null,
  trade_name text,
  sector text,
  activity_description text,
  incorporation_year int,
  activity_start_year int,
  location text,
  establishments_count int,
  organization_type text,
  employee_range text,
  activity_volume text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  role text,
  phone text,
  email text,
  preferred_channel text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id),
  source text,
  status text not null default 'NOVO',
  owner_user_id uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  active boolean not null default true,
  allows_retainer boolean not null default true,
  allows_one_off boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  lead_id uuid references public.leads(id),
  token_hash text unique not null,
  token_expires_at timestamptz,
  submitted_at timestamptz,
  status text not null default 'FORMULÁRIO ENVIADO',
  preferred_model text,
  main_objective text,
  truth_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnostic_service_requests (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  service_id uuid not null references public.services(id),
  selection_order int,
  created_at timestamptz not null default now(),
  unique(diagnostic_id, service_id)
);

create table if not exists public.questionnaires (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id),
  name text not null,
  active boolean not null default true,
  version int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  questionnaire_id uuid not null references public.questionnaires(id) on delete cascade,
  code text not null,
  text text not null,
  question_type text not null,
  required boolean not null default false,
  sort_order int not null default 0,
  conditional_rule jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(questionnaire_id, code)
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int not null default 0
);

create table if not exists public.diagnostic_answers (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  value jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(diagnostic_id, question_id)
);

create table if not exists public.service_factors (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  code text not null,
  name text not null,
  weight numeric(8,4),
  active boolean not null default true,
  unique(service_id, code)
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  service_id uuid not null references public.services(id),
  automatic_score numeric(10,4),
  automatic_level text,
  final_score numeric(10,4),
  final_level text,
  review_note text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(diagnostic_id, service_id)
);

create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  model text not null,
  status text not null default 'DRAFT',
  subtotal numeric(14,2) not null default 0,
  adjustment numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  iva numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  approved_by uuid references public.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricing_items (
  id uuid primary key default gen_random_uuid(),
  pricing_id uuid not null references public.pricing(id) on delete cascade,
  service_id uuid references public.services(id),
  scope text,
  effort_level text,
  base_price numeric(14,2) not null default 0,
  adjustment numeric(14,2) not null default 0,
  discount numeric(14,2) not null default 0,
  final_price numeric(14,2) not null default 0,
  extra_costs numeric(14,2) not null default 0
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id),
  pricing_id uuid references public.pricing(id),
  number text unique,
  template_code text,
  status text not null default 'DRAFT',
  sent_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  diagnostic_id uuid references public.diagnostics(id),
  proposal_id uuid references public.proposals(id),
  status text not null default 'PENDING',
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  diagnostic_id uuid references public.diagnostics(id),
  user_id uuid references public.users(id),
  type text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  field_name text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

insert into public.roles (code,name) values
('ADMIN','Administrador'),
('COMERCIAL','Comercial'),
('TECNICO','Técnico/Analista'),
('PRECIFICACAO','Responsável pela Precificação'),
('GESTOR','Gestor/Direcção')
on conflict (code) do nothing;

insert into public.services (code,name,sort_order) values
('FISCAL','Gestão de Impostos / Gestão Fiscal',1),
('CONTABILIDADE','Contabilidade',2),
('PAYROLL','Processamento de Salários',3),
('ADMINISTRATIVO','Assistência Administrativa',4),
('AUDITORIA','Auditorias',5),
('TREINAMENTO','Treinamentos',6),
('ESPECIALIZADO','Serviços Especializados / Outros',7)
on conflict (code) do nothing;
