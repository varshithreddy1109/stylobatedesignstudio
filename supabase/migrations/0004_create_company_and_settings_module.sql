-- ============================================================================
-- Company Details & Website Settings Module — Supabase migration
-- ============================================================================
-- WHERE TO RUN THIS:
--   Supabase Dashboard → your project → SQL Editor → New query →
--   paste this entire file → Run (as ONE execution, not split into parts).
--
-- Run this AFTER 0001, 0002, and 0003. It does NOT insert any rows into
-- either table — both are intentionally left empty. The first time the
-- admin clicks Save on either page, the app performs an upsert that creates
-- the single settings row with id = 1.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. TABLES
-- ----------------------------------------------------------------------------
-- Both tables are singletons — they hold exactly one settings row, enforced
-- by a fixed primary key (id = 1) rather than a generated uuid. No indexes
-- beyond the primary key are needed, since there is never more than one row
-- to look up.

create table if not exists public.company_details (
  id                 smallint primary key default 1,

  -- Identity (Logo/Favicon only — company name is fixed in the app and is
  -- never stored here)
  logo               text,
  favicon            text,

  -- About
  about              text,
  vision             text,
  mission            text,

  -- Contact
  email              text,
  phone              text,
  whatsapp           text,
  working_hours      text,
  address            text,
  google_maps_link   text,

  -- Social Links
  instagram          text,
  facebook           text,
  linkedin           text,
  youtube            text,

  updated_at         timestamptz not null default now(),

  constraint company_details_singleton check (id = 1)
);

comment on table public.company_details is 'Singleton studio contact/identity/social settings, managed via the Admin CMS.';


create table if not exists public.website_settings (
  id                 smallint primary key default 1,

  -- Theme Colors (persisted for future use — see note in app code; not
  -- yet applied to the compiled Tailwind design system)
  primary_color      text,
  accent_color       text,
  background_color   text,

  -- Footer
  footer_text        text,

  -- SEO Defaults
  seo_title          text,
  seo_description     text,

  -- Contact
  contact_email      text,
  contact_phone      text,

  updated_at         timestamptz not null default now(),

  constraint website_settings_singleton check (id = 1)
);

comment on table public.website_settings is 'Singleton site-wide settings (theme colors, footer, SEO, contact), managed via the Admin CMS.';


-- ----------------------------------------------------------------------------
-- 2. updated_at TRIGGERS
-- ----------------------------------------------------------------------------
-- Reuses the same trigger function created in earlier migrations (safe to
-- redefine identically here too, in case this migration is ever run alone).
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists company_details_set_updated_at on public.company_details;
create trigger company_details_set_updated_at
  before update on public.company_details
  for each row
  execute function public.set_updated_at();

drop trigger if exists website_settings_set_updated_at on public.website_settings;
create trigger website_settings_set_updated_at
  before update on public.website_settings
  for each row
  execute function public.set_updated_at();


-- ----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.company_details enable row level security;
alter table public.website_settings enable row level security;

-- Public read (footer contact info, social links, SEO text, etc. are all
-- shown on the public site).
drop policy if exists "Public can view company details" on public.company_details;
create policy "Public can view company details"
  on public.company_details
  for select
  using (true);

drop policy if exists "Public can view website settings" on public.website_settings;
create policy "Public can view website settings"
  on public.website_settings
  for select
  using (true);

-- Only signed-in users (the Admin CMS) may write. No delete policy on
-- either table by design — these are singleton settings rows that should
-- never be removed, only updated.
drop policy if exists "Authenticated users can insert company details" on public.company_details;
create policy "Authenticated users can insert company details"
  on public.company_details
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update company details" on public.company_details;
create policy "Authenticated users can update company details"
  on public.company_details
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can insert website settings" on public.website_settings;
create policy "Authenticated users can insert website settings"
  on public.website_settings
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update website settings" on public.website_settings;
create policy "Authenticated users can update website settings"
  on public.website_settings
  for update
  to authenticated
  using (true)
  with check (true);


-- ----------------------------------------------------------------------------
-- 4. GRANTS
-- ----------------------------------------------------------------------------
-- Table-level privileges are checked by Postgres BEFORE row-level security
-- policies — required in addition to RLS, not instead of it.
grant usage on schema public to anon, authenticated;

grant select on public.company_details to anon, authenticated;
grant insert, update on public.company_details to authenticated;

grant select on public.website_settings to anon, authenticated;
grant insert, update on public.website_settings to authenticated;


-- ----------------------------------------------------------------------------
-- 5. STORAGE — bucket for Logo and Favicon uploads
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('company-media', 'company-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view company media" on storage.objects;
create policy "Public can view company media"
  on storage.objects
  for select
  using (bucket_id = 'company-media');

drop policy if exists "Authenticated users can upload company media" on storage.objects;
create policy "Authenticated users can upload company media"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'company-media');

drop policy if exists "Authenticated users can update company media" on storage.objects;
create policy "Authenticated users can update company media"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'company-media')
  with check (bucket_id = 'company-media');

drop policy if exists "Authenticated users can delete company media" on storage.objects;
create policy "Authenticated users can delete company media"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'company-media');

-- ============================================================================
-- End of migration. No rows are inserted into company_details or
-- website_settings — both stay empty until the admin saves each page for
-- the first time.
-- ============================================================================
