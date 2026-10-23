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

-- --------------------------------------------------------- your admin account
-- After you create your user in Authentication -> Users, run this once with the
-- SAME email address, so that user is allowed into the panel:
--
--   insert into public.admins (email) values ('you@example.com')
--   on conflict (email) do nothing;
