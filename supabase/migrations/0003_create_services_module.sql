-- ============================================================================
-- Services Module — Supabase migration
-- ============================================================================
-- WHERE TO RUN THIS:
--   Supabase Dashboard → your project → SQL Editor → New query →
--   paste this entire file → Run (as ONE execution, not split into parts).
--
-- Run this AFTER 0001_create_projects_module.sql and
-- 0002_create_testimonials_module.sql. It does NOT insert any demo/sample
-- services — the table is intentionally left empty.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id                    uuid primary key default gen_random_uuid(),

  title                 text not null,
  description           text not null,
  detailed_description   text,

  -- Optional — the public site and Admin Panel show a clean default service
  -- icon when this is null. Uploads are never required.
  icon                  text,

  display_order         integer not null default 0,
  featured              boolean not null default false,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

comment on table public.services is 'Services shown on the public site and managed via the Admin CMS.';


-- ----------------------------------------------------------------------------
-- 2. INDEXES
-- ----------------------------------------------------------------------------
create index if not exists services_display_order_idx on public.services (display_order);
create index if not exists services_featured_idx on public.services (featured) where featured = true;


-- ----------------------------------------------------------------------------
-- 3. updated_at TRIGGER
-- ----------------------------------------------------------------------------
-- Reuses the same trigger function created in 0001/0002 (safe to redefine
-- identically here too, in case this migration is ever run on its own).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row
  execute function public.set_updated_at();


-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.services enable row level security;

drop policy if exists "Public can view services" on public.services;
create policy "Public can view services"
  on public.services
  for select
  using (true);

drop policy if exists "Authenticated users can insert services" on public.services;
create policy "Authenticated users can insert services"
  on public.services
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update services" on public.services;
create policy "Authenticated users can update services"
  on public.services
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete services" on public.services;
create policy "Authenticated users can delete services"
  on public.services
  for delete
  to authenticated
  using (true);


-- ----------------------------------------------------------------------------
-- 5. GRANTS
-- ----------------------------------------------------------------------------
-- Table-level privileges are checked by Postgres BEFORE row-level security
-- policies — required in addition to RLS, not instead of it (this was the
-- exact cause of the "permission denied for table projects" issue earlier).
grant usage on schema public to anon, authenticated;
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;


-- ----------------------------------------------------------------------------
-- 6. STORAGE — bucket for optional service icons
-- ----------------------------------------------------------------------------
-- Service Icon is optional on every service. This bucket only gets used
-- when an admin actually uploads an icon — nothing requires it.
insert into storage.buckets (id, name, public)
values ('service-media', 'service-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view service media" on storage.objects;
create policy "Public can view service media"
  on storage.objects
  for select
  using (bucket_id = 'service-media');

drop policy if exists "Authenticated users can upload service media" on storage.objects;
create policy "Authenticated users can upload service media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'service-media');

drop policy if exists "Authenticated users can update service media" on storage.objects;
create policy "Authenticated users can update service media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'service-media')
  with check (bucket_id = 'service-media');

drop policy if exists "Authenticated users can delete service media" on storage.objects;
create policy "Authenticated users can delete service media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'service-media');

-- ============================================================================
-- End of migration. No demo/sample services are inserted — the services
-- table is intentionally left empty until added via the Admin Panel.
-- ============================================================================
