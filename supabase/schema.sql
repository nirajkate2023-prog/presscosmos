-- PressCosmos admin — Supabase schema.
--
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- It creates the `releases` table the admin panel manages, locks it down with
-- Row Level Security, and grants the minimum each role needs:
--   * anonymous (the public site)  -> may read published releases only
--   * authenticated (signed-in admins) -> full read/write
--
-- Because RLS is enforced by the database, the public anon key shipped in
-- admin/config.js cannot be used to read drafts or to write anything.

create extension if not exists "pgcrypto";

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

alter table public.releases enable row level security;

-- Public (anon) may read published releases and nothing else.
drop policy if exists "anon reads published releases" on public.releases;
create policy "anon reads published releases"
  on public.releases for select to anon
  using (status = 'published');

-- Signed-in admins have full access.
drop policy if exists "admins read releases" on public.releases;
create policy "admins read releases"
  on public.releases for select to authenticated
  using (true);

drop policy if exists "admins insert releases" on public.releases;
create policy "admins insert releases"
  on public.releases for insert to authenticated
  with check (true);

drop policy if exists "admins update releases" on public.releases;
create policy "admins update releases"
  on public.releases for update to authenticated
  using (true) with check (true);

drop policy if exists "admins delete releases" on public.releases;
create policy "admins delete releases"
  on public.releases for delete to authenticated
  using (true);

-- Keep updated_at current.
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
