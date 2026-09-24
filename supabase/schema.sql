-- ---------------------------------------------------------------------------
-- PIM 2 Community Ecosystem Mapping - skema Supabase / PostgreSQL
-- Jalankan seluruh isi file ini di Supabase Studio > SQL Editor.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- Tabel induk komunitas ------------------------------------------------------
create table if not exists public.communities (
  id                        uuid primary key default gen_random_uuid(),
  name                      text not null,
  category                  text not null default 'lainnya'
                              constraint communities_category_check
                              check (category in ('badminton','futsal','gym','pilates','lainnya')),
  address                   text not null default '',
  lat                       double precision not null,
  lng                       double precision not null,
  -- Dihitung di klien dengan haversine dari titik cabang PIM 2.
  distance_km               double precision not null default 0,
  radius_band               text not null default '>5km'
                              check (radius_band in ('<1km','1-3km','3-5km','>5km')),
  estimated_members         integer,
  pic_name                  text not null default '',
  pic_phone                 text not null default '',
  activity_schedule         text not null default '',
  -- null = belum dinilai tim.
  business_owner_potential  text
                              check (business_owner_potential in ('low','medium','high')),
  funding_potential_idr     bigint,
  product_opportunity       text[] not null default '{}',
  status                    text not null default 'not_contacted'
                              check (status in ('not_contacted','approached','follow_up','acquired','rejected')),
  next_action               text not null default '',
  next_action_date          date,
  notes                     text not null default '',
  ntb_acquired              integer not null default 0,
  updated_at                timestamptz not null default now()
);

-- Migrasi untuk tabel yang dibuat dengan versi lama skema ini (aman dijalankan ulang).
alter table public.communities drop column if exists priority_score;
alter table public.communities alter column business_owner_potential drop not null;
alter table public.communities alter column business_owner_potential drop default;
-- Kategori padel dihapus: pindahkan sisa baris lama ke 'lainnya', lalu perketat constraint.
update public.communities set category = 'lainnya' where category = 'padel';
alter table public.communities drop constraint if exists communities_category_check;
alter table public.communities add constraint communities_category_check
  check (category in ('badminton','futsal','gym','pilates','lainnya'));

create index if not exists communities_status_idx        on public.communities (status);
create index if not exists communities_category_idx      on public.communities (category);
create index if not exists communities_radius_band_idx   on public.communities (radius_band);
create index if not exists communities_distance_idx      on public.communities (distance_km);
create index if not exists communities_next_action_idx   on public.communities (next_action_date);

-- Tabel aktivitas ------------------------------------------------------------
create table if not exists public.activities (
  id            uuid primary key default gen_random_uuid(),
  community_id  uuid not null references public.communities (id) on delete cascade,
  date          date not null default current_date,
  type          text not null default 'visit'
                  check (type in ('visit','call','event','onboarding')),
  pic_internal  text not null default '',
  result        text not null default '',
  ntb_added     integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists activities_community_idx on public.activities (community_id);
create index if not exists activities_date_idx      on public.activities (date desc);

-- updated_at otomatis --------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists communities_touch_updated_at on public.communities;
create trigger communities_touch_updated_at
  before update on public.communities
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Hanya sesi yang sudah masuk (akun tim di Supabase Auth) yang boleh membaca
-- dan menulis. Anon key yang ikut ter-bundle di klien TIDAK cukup untuk
-- mengakses data. File ini aman dijalankan ulang: policy lama `anon` dihapus.
-- ---------------------------------------------------------------------------
alter table public.communities enable row level security;
alter table public.activities  enable row level security;

revoke all on public.communities from anon;
revoke all on public.activities  from anon;
grant select, insert, update, delete on public.communities to authenticated;
grant select, insert, update, delete on public.activities  to authenticated;

drop policy if exists communities_all_anon on public.communities;
drop policy if exists communities_team on public.communities;
create policy communities_team
  on public.communities for all
  to authenticated
  using (true) with check (true);

drop policy if exists activities_all_anon on public.activities;
drop policy if exists activities_team on public.activities;
create policy activities_team
  on public.activities for all
  to authenticated
  using (true) with check (true);
