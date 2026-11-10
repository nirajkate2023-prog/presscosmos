-- PressCosmos admin — Supabase schema.
--
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Creates:
--   * public.releases — the press releases the admin panel manages
--   * public.admins   — an explicit allowlist of who may administer the panel
--   * public.is_admin() — helper the policies use
--
-- Security model:
--   * anonymous (the public site)        -> may read PUBLISHED releases only
--   * signed-in users on the allowlist   -> full read/write
--   * signed-in users NOT on the allowlist -> nothing
--
-- The allowlist matters because public sign-up is a Supabase project setting. If
-- it is ever left on, an allowlist still keeps strangers out of the panel; the
-- policies below do not grant anything merely for being "authenticated".

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- releases
create table if not exists public.releases (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  summary    text,
  body       text,
  status     text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists releases_created_at_idx on public.releases (created_at desc);
create index if not exists releases_status_idx on public.releases (status);

alter table public.releases enable row level security;

-- ------------------------------------------------------------ admin allowlist
create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Deliberately no policies on public.admins: it is readable and writable only
-- from the Supabase dashboard (service role), never from a browser. The helper
-- below reads it as the table owner, so no policy is required.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- ----------------------------------------------------------------- policies
-- Public site: read published releases, nothing else.
drop policy if exists "anon reads published releases" on public.releases;
create policy "anon reads published releases"
  on public.releases for select to anon
  using (status = 'published');

-- Allowlisted admins: full access.
drop policy if exists "admins read releases" on public.releases;
create policy "admins read releases"
  on public.releases for select to authenticated
  using (public.is_admin());

drop policy if exists "admins insert releases" on public.releases;
create policy "admins insert releases"
  on public.releases for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admins update releases" on public.releases;
create policy "admins update releases"
  on public.releases for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete releases" on public.releases;
create policy "admins delete releases"
  on public.releases for delete to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------- trigger
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists releases_touch_updated_at on public.releases;
create trigger releases_touch_updated_at
  before update on public.releases
  for each row execute function public.touch_updated_at();

-- ===========================================================================
-- CMS content layer (added for the full dashboard)
--
--   * public.content       global site content — one row per entity (JSON)
--   * public.pages         per-page SEO + optional HTML body override
--   * public.media         uploaded images (backed by Storage bucket "media")
--   * public.revisions     history snapshots for undo
--   * public.publish_jobs  insert a row to trigger a site rebuild
--   * public.admins.role   owner / editor / viewer
--
-- Anonymous visitors still only ever read published releases. Everything here
-- is readable and writable by allowlisted admins only.
-- ===========================================================================

-- ------------------------------------------------------- admins: roles / name
alter table public.admins add column if not exists role text not null default 'editor';
alter table public.admins add column if not exists display_name text;

do $$ begin
  alter table public.admins
    add constraint admins_role_check check (role in ('owner', 'editor', 'viewer'));
exception when duplicate_object then null; end $$;

create or replace function public.admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select a.role from public.admins a
  where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''));
$$;
revoke all on function public.admin_role() from anon;
grant execute on function public.admin_role() to authenticated;

-- ---------------------------------------------------------------- content
create table if not exists public.content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.content enable row level security;

-- ---------------------------------------------------------------- pages
create table if not exists public.pages (
  slug          text primary key,
  title         text,
  description   text,
  keywords      text[] default '{}',
  html          text,
  type          text default 'website',
  category      text,
  noindex       boolean default false,
  priority      numeric(2,1) default 0.7,
  changefreq    text default 'weekly',
  published_iso text,
  modified_iso  text,
  og_image      text,
  updated_at    timestamptz not null default now(),
  updated_by    text
);
alter table public.pages enable row level security;

-- ---------------------------------------------------------------- media
create table if not exists public.media (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null,
  url          text not null,
  alt          text,
  title        text,
  width        int,
  height       int,
  bytes        bigint,
  mime         text,
  created_at   timestamptz not null default now(),
  created_by   text
);
alter table public.media enable row level security;

-- ---------------------------------------------------------------- revisions
create table if not exists public.revisions (
  id         uuid primary key default gen_random_uuid(),
  entity     text not null,
  value      jsonb not null,
  created_at timestamptz not null default now(),
  created_by text
);
create index if not exists revisions_entity_idx on public.revisions (entity, created_at desc);
alter table public.revisions enable row level security;

-- ---------------------------------------------------------------- publish_jobs
create table if not exists public.publish_jobs (
  id         uuid primary key default gen_random_uuid(),
  status     text not null default 'requested' check (status in ('requested', 'building', 'done', 'failed')),
  note       text,
  created_at timestamptz not null default now(),
  created_by text
);
alter table public.publish_jobs enable row level security;

-- --------------------------------------------------------- content policies
drop policy if exists "admins manage content" on public.content;
create policy "admins manage content" on public.content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage pages" on public.pages;
create policy "admins manage pages" on public.pages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage media" on public.media;
create policy "admins manage media" on public.media
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage revisions" on public.revisions;
create policy "admins manage revisions" on public.revisions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage publish_jobs" on public.publish_jobs;
create policy "admins manage publish_jobs" on public.publish_jobs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Let admins read the allowlist (for the Settings screen). Writes stay dashboard-only.
drop policy if exists "admins read allowlist" on public.admins;
create policy "admins read allowlist" on public.admins
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to public using (bucket_id = 'media');

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- --------------------------------------------------------- your admin account
-- After you create your user in Authentication -> Users, run this once with the
-- SAME email address, so that user is allowed into the panel (role owner/editor/viewer):
--
--   insert into public.admins (email, role) values ('you@example.com', 'owner')
--   on conflict (email) do update set role = excluded.role;
