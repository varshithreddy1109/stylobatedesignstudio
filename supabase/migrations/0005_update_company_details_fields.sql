-- ============================================================================
-- Company Details — field update migration
-- ============================================================================
-- WHERE TO RUN THIS:
--   Supabase Dashboard → your project → SQL Editor → New query →
--   paste this entire file → Run (as ONE execution).
--
-- Run this AFTER 0001, 0002, 0003, and 0004.
--
-- Changes:
--  - Drops `logo` — the logo is now a fixed file bundled with the app
--    (public/images/logo.jpg), no longer uploaded/stored via the Admin
--    Panel or Supabase Storage.
--  - Adds `years_experience`, `awards` (both integer — Awards is hidden on
--    the public site entirely when null or 0, not shown as "0").
--  - Adds `our_story` (text) — powers the About page's "Our Story" section.
--  - Adds `apple_maps_link` (text).
-- No data is seeded; existing rows (if any) simply gain empty new columns.
-- ============================================================================

alter table public.company_details
  drop column if exists logo;

alter table public.company_details
  add column if not exists years_experience integer,
  add column if not exists awards integer,
  add column if not exists our_story text,
  add column if not exists apple_maps_link text;

-- ============================================================================
-- End of migration.
-- ============================================================================
