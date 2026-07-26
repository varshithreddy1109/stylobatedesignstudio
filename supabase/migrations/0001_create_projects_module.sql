-- ============================================================================
-- Projects Module — Supabase migration
-- ============================================================================
-- WHERE TO RUN THIS:
--   Supabase Dashboard → your project → SQL Editor → New query →
--   paste this entire file → Run.
--
-- This migration is idempotent-ish (uses IF NOT EXISTS / ON CONFLICT DO
-- NOTHING where possible) so it is safe to re-run, but it is intended to be
-- run ONCE against a fresh project. It does NOT insert any demo/sample rows.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. TABLE
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id                    uuid primary key default gen_random_uuid(),

  -- General
  title                 text not null,
  slug                  text not null,
  category              text not null,
  project_type          text,
  status                text,

  -- Project Details
  description           text not null,
  detailed_description   text,

  -- Project Information
  client_name           text,
  architect_name        text,
  location              text not null,
  area                  text not null,
  completion_date       date,

  -- Media
  image                 text not null,
  gallery               text[] not null default '{}',
  youtube_url           text,

  -- Homepage
  featured              boolean not null default false,
  display_order         integer not null default 0,

  -- SEO
  meta_title            text,
  meta_description       text,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint projects_slug_unique unique (slug),
  constraint projects_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint projects_category_check check (
    category in ('Residential', 'Commercial', 'Institutional', 'Interior', 'Urban Planning')
  ),
  constraint projects_project_type_check check (
    project_type is null or project_type in ('New Construction', 'Renovation', 'Interior Fit-out', 'Masterplanning')
  ),
  constraint projects_status_check check (
    status is null or status in ('Completed', 'Ongoing', 'Concept')
  )
);

comment on table public.projects is 'Architecture projects shown on the public site and managed via the Admin CMS.';


-- ----------------------------------------------------------------------------
-- 1b. GRANTS
-- ----------------------------------------------------------------------------
-- Table-level privileges are checked by Postgres BEFORE row-level security
-- policies — without these, every request is rejected regardless of how
-- permissive the RLS policies below are. Creating a table via raw SQL (as
-- opposed to the Supabase Dashboard's Table Editor) does not always grant
-- these automatically, so they're made explicit here.
grant usage on schema public to anon, authenticated;
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;


-- ----------------------------------------------------------------------------
-- 2. INDEXES
-- ----------------------------------------------------------------------------
-- projects_slug_unique above already creates a unique index on slug.
create index if not exists projects_display_order_idx on public.projects (display_order);
create index if not exists projects_featured_idx on public.projects (featured) where featured = true;
create index if not exists projects_category_idx on public.projects (category);


-- ----------------------------------------------------------------------------
-- 3. updated_at TRIGGER
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();


-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.projects enable row level security;

-- Public (anon) + signed-in admins can read every project. There is no
-- "draft/published" concept in this schema — Status (Completed / Ongoing /
-- Concept) is informational content, not an access-control flag.
drop policy if exists "Public can view projects" on public.projects;
create policy "Public can view projects"
  on public.projects
  for select
  using (true);

-- Only signed-in users (the Admin CMS, protected by src/middleware.ts) may
-- write. This project has a single admin role, so any authenticated user
-- is treated as an admin.
drop policy if exists "Authenticated users can insert projects" on public.projects;
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);


-- ----------------------------------------------------------------------------
-- 5. STORAGE — bucket for cover + gallery images
-- ----------------------------------------------------------------------------
-- Public bucket: cover/gallery images are marketing assets meant to be
-- viewed by anyone visiting the public site.
insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do nothing;

-- Anyone can read/download files in this bucket (needed for the public
-- website to display images without an auth token).
drop policy if exists "Public can view project media" on storage.objects;
create policy "Public can view project media"
  on storage.objects
  for select
  using (bucket_id = 'project-media');

-- Only signed-in users (the Admin CMS) can upload, replace, or delete files.
drop policy if exists "Authenticated users can upload project media" on storage.objects;
create policy "Authenticated users can upload project media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'project-media');

drop policy if exists "Authenticated users can update project media" on storage.objects;
create policy "Authenticated users can update project media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'project-media')
  with check (bucket_id = 'project-media');

drop policy if exists "Authenticated users can delete project media" on storage.objects;
create policy "Authenticated users can delete project media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'project-media');

-- ============================================================================
-- End of migration. No demo/sample projects are inserted — the projects
-- table is intentionally left empty. The public Projects page will show a
-- "No projects have been added yet." empty state until the admin adds the
-- first project through the Admin Panel.
-- ============================================================================
