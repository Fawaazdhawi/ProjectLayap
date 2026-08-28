-- Extension needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ── Tables ──────────────────────────────────────────────────────────
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.practicums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  pc_id text not null,
  pc_image text,
  nama text not null,
  nrp text,
  keperluan text,
  tanggal date not null,
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint reservations_pc_date_unique unique (pc_id, tanggal)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

-- ── Row Level Security ──────────────────────────────────────────────
alter table public.news enable row level security;
alter table public.practicums enable row level security;
alter table public.reservations enable row level security;
alter table public.profiles enable row level security;

-- news: publicly readable (WhatsOn carousel is a public page), writable by any signed-in user
create policy "news_public_read" on public.news for select using (true);
create policy "news_auth_insert" on public.news for insert to authenticated with check (true);
create policy "news_auth_update" on public.news for update to authenticated using (true) with check (true);
create policy "news_auth_delete" on public.news for delete to authenticated using (true);

-- practicums: mirrors news's permissiveness (no evidence Firestore locked it down differently)
create policy "practicums_public_read" on public.practicums for select using (true);
create policy "practicums_auth_insert" on public.practicums for insert to authenticated with check (true);
create policy "practicums_auth_update" on public.practicums for update to authenticated using (true) with check (true);
create policy "practicums_auth_delete" on public.practicums for delete to authenticated using (true);

-- reservations: only ever created by a logged-in booker, require an authenticated session
-- for both the pre-submit conflict check and the insert
create policy "reservations_auth_read" on public.reservations for select to authenticated using (true);
create policy "reservations_auth_insert" on public.reservations for insert to authenticated with check (true);

-- profiles: vestigial today (never read by the app), keep minimal self-access only
create policy "profiles_self_read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- ── Realtime (replaces onSnapshot) ──────────────────────────────────
alter publication supabase_realtime add table public.news, public.practicums;

-- ── Storage buckets + policies (replaces Firebase Storage) ──────────
insert into storage.buckets (id, name, public) values ('news', 'news', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('practicums', 'practicums', true)
  on conflict (id) do nothing;

create policy "news_bucket_public_read" on storage.objects for select using (bucket_id = 'news');
create policy "news_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'news');
create policy "news_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'news') with check (bucket_id = 'news');
create policy "news_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'news');

create policy "practicums_bucket_public_read" on storage.objects for select using (bucket_id = 'practicums');
create policy "practicums_bucket_auth_insert" on storage.objects for insert to authenticated with check (bucket_id = 'practicums');
create policy "practicums_bucket_auth_update" on storage.objects for update to authenticated using (bucket_id = 'practicums') with check (bucket_id = 'practicums');
create policy "practicums_bucket_auth_delete" on storage.objects for delete to authenticated using (bucket_id = 'practicums');
