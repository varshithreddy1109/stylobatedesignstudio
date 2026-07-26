-- ============================================================================
-- Testimonials Module — Supabase migration
-- ============================================================================
-- WHERE TO RUN THIS:
--   Supabase Dashboard → your project → SQL Editor → New query →
--   paste this entire file → Run (as ONE execution, not split into parts).
--
-- Run this AFTER 0001_create_projects_module.sql. It does NOT insert any
-- demo/sample testimonials — the table is intentionally left empty.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id                uuid primary key default gen_random_uuid(),

  client_name       text not null,
  company_name      text,
  designation       text,
  message           text not null,
  rating            integer not null default 5,

  -- Optional — the public site shows a professional initials avatar when
  -- this is null. Uploads are never required.
  image             text,

  display_order     integer not null default 0,
  featured          boolean not null default false,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint testimonials_rating_range check (rating between 1 and 5)
);

comment on table public.testimonials is 'Client testimonials shown on the public site and managed via the Admin CMS.';


-- ----------------------------------------------------------------------------
-- 2. INDEXES
-- ----------------------------------------------------------------------------
create index if not exists testimonials_display_order_idx on public.testimonials (display_order);
create index if not exists testimonials_featured_idx on public.testimonials (featured) where featured = true;


-- ----------------------------------------------------------------------------
-- 3. updated_at TRIGGER
-- ----------------------------------------------------------------------------
-- Reuses the same trigger function created in 0001 (safe to redefine
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

drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row
  execute function public.set_updated_at();


-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.testimonials enable row level security;

drop policy if exists "Public can view testimonials" on public.testimonials;
create policy "Public can view testimonials"
  on public.testimonials
  for select
  using (true);

drop policy if exists "Authenticated users can insert testimonials" on public.testimonials;
create policy "Authenticated users can insert testimonials"
  on public.testimonials
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update testimonials" on public.testimonials;
create policy "Authenticated users can update testimonials"
  on public.testimonials
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete testimonials" on public.testimonials;
create policy "Authenticated users can delete testimonials"
  on public.testimonials
  for delete
  to authenticated
  using (true);


-- ----------------------------------------------------------------------------
-- 5. GRANTS
-- ----------------------------------------------------------------------------
-- Table-level privileges are checked by Postgres BEFORE row-level security
-- policies. Explicit here (not just relying on RLS) for the same reason
-- this was required for the projects table.
grant usage on schema public to anon, authenticated;
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;


-- ----------------------------------------------------------------------------
-- 6. STORAGE — bucket for optional client photos
-- ----------------------------------------------------------------------------
-- Client Image is optional on every testimonial. This bucket only gets used
-- when an admin actually uploads a photo — nothing requires it to be used.
insert into storage.buckets (id, name, public)
values ('testimonial-media', 'testimonial-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view testimonial media" on storage.objects;
create policy "Public can view testimonial media"
  on storage.objects
  for select
  using (bucket_id = 'testimonial-media');

drop policy if exists "Authenticated users can upload testimonial media" on storage.objects;
create policy "Authenticated users can upload testimonial media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'testimonial-media');

drop policy if exists "Authenticated users can update testimonial media" on storage.objects;
create policy "Authenticated users can update testimonial media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'testimonial-media')
  with check (bucket_id = 'testimonial-media');

drop policy if exists "Authenticated users can delete testimonial media" on storage.objects;
create policy "Authenticated users can delete testimonial media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'testimonial-media');

-- ============================================================================
-- End of migration. No demo/sample testimonials are inserted — the
-- testimonials table is intentionally left empty until added via the
-- Admin Panel.
-- ============================================================================
