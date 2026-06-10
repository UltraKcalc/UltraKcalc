-- UltraKcalc cloud schema for Supabase.
-- Run this file in the Supabase SQL Editor after creating your project.

create extension if not exists pgcrypto;

create table if not exists public.recordatorios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  participant_id text not null,
  researcher_id text,
  record_group text not null default 'Individual',
  recall_date date not null,
  classification_type text not null default 'NOVA'
    check (classification_type in ('NOVA', 'POF')),
  record_signature text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recordatorios
  add column if not exists record_signature text;

alter table public.recordatorios
  add column if not exists record_group text not null default 'Individual';

create table if not exists public.recordatorio_items (
  id uuid primary key default gen_random_uuid(),
  recordatorio_id uuid not null references public.recordatorios(id) on delete cascade,
  meal text not null,
  food text not null,
  unit text,
  portion text,
  qty text,
  obs text,
  nutrients jsonb not null default '{}'::jsonb,
  class_nova text,
  class_pof text,
  item_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  processing_level text not null default 'nonUltra',
  food_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.custom_food_measures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  food_name text not null,
  normalized_food_name text not null,
  measure_name text not null,
  grams numeric not null check (grams > 0),
  unit text not null default 'g',
  label text not null,
  normalized_label text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorite_foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  food_name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.custom_food_measures
  add column if not exists normalized_label text;

update public.custom_food_measures
set normalized_label = lower(trim(label))
where normalized_label is null;

alter table public.custom_food_measures
  alter column normalized_label set not null;

create index if not exists recordatorios_user_order_idx
  on public.recordatorios (user_id, sort_order, created_at desc);

create unique index if not exists recordatorios_user_signature_idx
  on public.recordatorios (user_id, record_signature)
  where record_signature is not null;

create index if not exists recordatorio_items_recordatorio_order_idx
  on public.recordatorio_items (recordatorio_id, item_order);

create unique index if not exists custom_foods_user_normalized_name_idx
  on public.custom_foods (user_id, normalized_name);

create unique index if not exists custom_food_measures_user_food_label_idx
  on public.custom_food_measures (user_id, normalized_food_name, normalized_label);

create unique index if not exists favorite_foods_user_normalized_name_idx
  on public.favorite_foods (user_id, normalized_name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists recordatorios_set_updated_at on public.recordatorios;
create trigger recordatorios_set_updated_at
before update on public.recordatorios
for each row execute function public.set_updated_at();

drop trigger if exists custom_foods_set_updated_at on public.custom_foods;
create trigger custom_foods_set_updated_at
before update on public.custom_foods
for each row execute function public.set_updated_at();

drop trigger if exists custom_food_measures_set_updated_at on public.custom_food_measures;
create trigger custom_food_measures_set_updated_at
before update on public.custom_food_measures
for each row execute function public.set_updated_at();

drop trigger if exists favorite_foods_set_updated_at on public.favorite_foods;
create trigger favorite_foods_set_updated_at
before update on public.favorite_foods
for each row execute function public.set_updated_at();

alter table public.recordatorios enable row level security;
alter table public.recordatorio_items enable row level security;
alter table public.custom_foods enable row level security;
alter table public.custom_food_measures enable row level security;
alter table public.favorite_foods enable row level security;

drop policy if exists "Users manage their own recalls" on public.recordatorios;
create policy "Users manage their own recalls"
on public.recordatorios
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users read their own recall items" on public.recordatorio_items;
create policy "Users read their own recall items"
on public.recordatorio_items
for select
to authenticated
using (
  exists (
    select 1
    from public.recordatorios r
    where r.id = recordatorio_items.recordatorio_id
      and r.user_id = auth.uid()
  )
);

drop policy if exists "Users insert their own recall items" on public.recordatorio_items;
create policy "Users insert their own recall items"
on public.recordatorio_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.recordatorios r
    where r.id = recordatorio_items.recordatorio_id
      and r.user_id = auth.uid()
  )
);

drop policy if exists "Users update their own recall items" on public.recordatorio_items;
create policy "Users update their own recall items"
on public.recordatorio_items
for update
to authenticated
using (
  exists (
    select 1
    from public.recordatorios r
    where r.id = recordatorio_items.recordatorio_id
      and r.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.recordatorios r
    where r.id = recordatorio_items.recordatorio_id
      and r.user_id = auth.uid()
  )
);

drop policy if exists "Users delete their own recall items" on public.recordatorio_items;
create policy "Users delete their own recall items"
on public.recordatorio_items
for delete
to authenticated
using (
  exists (
    select 1
    from public.recordatorios r
    where r.id = recordatorio_items.recordatorio_id
      and r.user_id = auth.uid()
  )
);

drop policy if exists "Users manage their own custom foods" on public.custom_foods;
create policy "Users manage their own custom foods"
on public.custom_foods
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage their own custom food measures" on public.custom_food_measures;
create policy "Users manage their own custom food measures"
on public.custom_food_measures
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage their own favorite foods" on public.favorite_foods;
create policy "Users manage their own favorite foods"
on public.favorite_foods
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.recordatorios to authenticated;
grant select, insert, update, delete on public.recordatorio_items to authenticated;
grant select, insert, update, delete on public.custom_foods to authenticated;
grant select, insert, update, delete on public.custom_food_measures to authenticated;
grant select, insert, update, delete on public.favorite_foods to authenticated;
