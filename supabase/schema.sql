-- =====================================================================
-- TopImkon — schema.sql
-- Supabase → SQL Editor → New query → hammasini qo‘yib RUN bosing.
-- Faqat BIR MARTA ishga tushiring (bo‘sh loyihada). Keyin seed.sql'ni ishga tushiring.
-- =====================================================================

create extension if not exists pg_trgm;   -- sarlavha bo‘yicha "taxminiy" qidiruv uchun

-- ---------------------------------------------------------------------
-- 1) Yordamchi funksiyalar
-- ---------------------------------------------------------------------

-- updated_at ni avtomatik yangilaydi (oddiy jadvallar uchun)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- opportunities uchun: faqat "views" o‘zgarganda updated_at o‘zgarmasin
create or replace function public.opportunities_touch()
returns trigger language plpgsql as $$
begin
  if (to_jsonb(new) - 'views' - 'updated_at') is distinct from (to_jsonb(old) - 'views' - 'updated_at') then
    new.updated_at = now();
  else
    new.updated_at = old.updated_at;
  end if;
  return new;
end $$;

-- ---------------------------------------------------------------------
-- 2) opportunities — asosiy jadval (asosiy matn o‘zbekcha)
-- ---------------------------------------------------------------------
create table public.opportunities (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null,
  org              text not null,
  country          text not null,
  type             text not null
                     check (type in ('scholarship','grant','internship','course','exchange','competition')),
  format           text not null
                     check (format in ('onsite','online','hybrid')),
  funding          text not null
                     check (funding in ('full','partial','paid','none')),
  language         text not null default 'en',                 -- asosiy til kodi: en, uz, ru, de, tr ...
  level            text not null default 'none'                -- talab qilinadigan til darajasi (CEFR)
                     check (level in ('none','A2','B1','B2','C1','C2')),
  fee              numeric(10,2) not null default 0 check (fee >= 0),   -- ariza to‘lovi, AQSH dollarida
  deadline         date,                                       -- NULL = doimiy qabul
  summary          text not null,
  description      text not null default '',
  eligibility      text not null default '',
  how_to_apply     text not null default '',
  source_url       text not null check (source_url ~* '^https?://'),    -- rasmiy manba (majburiy)
  last_verified_at timestamptz,                                -- oxirgi tekshirilgan sana (NULL = hali tekshirilmagan)
  featured         boolean not null default false,
  for_uzbekistan   boolean not null default false,             -- O‘zbekiston talabalari ariza topshira oladimi
  is_sample        boolean not null default false,             -- true = NAMUNA yozuv, haqiqiy deb ko‘rsatilmasin
  status           text not null default 'draft'
                     check (status in ('draft','published','archived')),
  views            integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- to‘liq matnli qidiruv ("simple" konfiguratsiya: o‘zbek tili uchun tayyor stemmer yo‘q)
  search_vector    tsvector generated always as (
    to_tsvector('simple',
      coalesce(title,'') || ' ' || coalesce(org,'') || ' ' || coalesce(country,'') || ' ' || coalesce(summary,''))
  ) stored
);

create index opportunities_deadline_idx on public.opportunities (deadline);
create index opportunities_status_idx   on public.opportunities (status);
create index opportunities_published_deadline_idx
  on public.opportunities (deadline) where status = 'published';
create index opportunities_search_idx   on public.opportunities using gin (search_vector);
create index opportunities_title_trgm_idx on public.opportunities using gin (title gin_trgm_ops);

create trigger opportunities_touch_trg
  before update on public.opportunities
  for each row execute function public.opportunities_touch();

-- ---------------------------------------------------------------------
-- 3) Tarjimalar, soha va daraja
-- ---------------------------------------------------------------------
create table public.opportunity_translations (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  locale         text not null check (locale in ('ru','en')),   -- uz — asosiy jadvalda
  title          text not null,
  summary        text not null,
  description    text not null default '',
  primary key (opportunity_id, locale)
);

create table public.opportunity_fields (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  field          text not null,   -- masalan: technology, business, digital_economy
  primary key (opportunity_id, field)
);
create index opportunity_fields_field_idx on public.opportunity_fields (field);

create table public.opportunity_degrees (
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  degree         text not null check (degree in ('bachelor','master','phd')),
  primary key (opportunity_id, degree)
);

-- ---------------------------------------------------------------------
-- 4) Foydalanuvchi jadvallari
-- ---------------------------------------------------------------------
create table public.profiles (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  full_name             text not null default '',
  country_of_residence  text not null default 'UZ',
  degree_level          text check (degree_level in ('bachelor','master','phd')),
  field_interests       text[] not null default '{}',
  languages             text[] not null default '{}',     -- masalan: {uz,ru,en}
  preferred_types       text[] not null default '{}',
  telegram_chat_id      bigint unique,                    -- faqat server (bot) yozadi
  is_admin              boolean not null default false,   -- faqat SQL orqali beriladi
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger profiles_updated_at_trg
  before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.saved_opportunities (
  user_id        uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);
create index saved_opportunities_opp_idx on public.saved_opportunities (opportunity_id);

create table public.reminders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  days_before    integer not null check (days_before in (14,7,3,1)),
  sent_at        timestamptz,                              -- NULL = hali yuborilmagan
  created_at     timestamptz not null default now(),
  unique (user_id, opportunity_id, days_before)
);
create index reminders_pending_idx on public.reminders (opportunity_id) where sent_at is null;

-- Yangi foydalanuvchi ro‘yxatdan o‘tganda bo‘sh profil avtomatik yaratiladi
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Joriy foydalanuvchi admin'mi? (security definer: RLS'da cheksiz sikl bo‘lmasligi uchun)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where user_id = auth.uid()), false)
$$;

-- Ko‘rishlar sonini oshirish (har kim chaqira oladi, faqat published uchun ishlaydi)
create or replace function public.increment_views(p_slug text)
returns void language sql security definer set search_path = public as $$
  update public.opportunities set views = views + 1
  where slug = p_slug and status = 'published'
$$;

-- ---------------------------------------------------------------------
-- 5) Row Level Security
-- ---------------------------------------------------------------------
alter table public.opportunities             enable row level security;
alter table public.opportunity_translations  enable row level security;
alter table public.opportunity_fields        enable row level security;
alter table public.opportunity_degrees       enable row level security;
alter table public.profiles                  enable row level security;
alter table public.saved_opportunities       enable row level security;
alter table public.reminders                 enable row level security;

-- opportunities: hamma faqat published'ni o‘qiydi; admin hammasini o‘qiydi va yozadi
create policy opp_read on public.opportunities for select
  using (status = 'published' or public.is_admin());
create policy opp_admin_insert on public.opportunities for insert
  with check (public.is_admin());
create policy opp_admin_update on public.opportunities for update
  using (public.is_admin()) with check (public.is_admin());
create policy opp_admin_delete on public.opportunities for delete
  using (public.is_admin());

-- tarjimalar / soha / daraja: ota yozuv published bo‘lsa ko‘rinadi; yozish faqat admin
create policy trans_read on public.opportunity_translations for select
  using (public.is_admin() or exists (
    select 1 from public.opportunities o where o.id = opportunity_id and o.status = 'published'));
create policy trans_admin_write on public.opportunity_translations for all
  using (public.is_admin()) with check (public.is_admin());

create policy fields_read on public.opportunity_fields for select
  using (public.is_admin() or exists (
    select 1 from public.opportunities o where o.id = opportunity_id and o.status = 'published'));
create policy fields_admin_write on public.opportunity_fields for all
  using (public.is_admin()) with check (public.is_admin());

create policy degrees_read on public.opportunity_degrees for select
  using (public.is_admin() or exists (
    select 1 from public.opportunities o where o.id = opportunity_id and o.status = 'published'));
create policy degrees_admin_write on public.opportunity_degrees for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles: faqat o‘zinikini
create policy profiles_own_select on public.profiles for select using (user_id = auth.uid());
create policy profiles_own_insert on public.profiles for insert with check (user_id = auth.uid());
create policy profiles_own_update on public.profiles for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy profiles_own_delete on public.profiles for delete using (user_id = auth.uid());

-- saqlanganlar: faqat o‘zinikini
create policy saved_own_select on public.saved_opportunities for select using (user_id = auth.uid());
create policy saved_own_insert on public.saved_opportunities for insert with check (user_id = auth.uid());
create policy saved_own_delete on public.saved_opportunities for delete using (user_id = auth.uid());

-- eslatmalar: faqat o‘zinikini
create policy reminders_own_select on public.reminders for select using (user_id = auth.uid());
create policy reminders_own_insert on public.reminders for insert with check (user_id = auth.uid());
create policy reminders_own_delete on public.reminders for delete using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- 6) Ustun darajasidagi huquqlar (qo‘shimcha himoya)
--    Foydalanuvchi o‘zini admin qila olmasin, telegram_chat_id va sent_at'ni
--    soxtalashtira olmasin. Bularni faqat server (service_role) o‘zgartiradi.
-- ---------------------------------------------------------------------
revoke all on public.profiles  from anon, authenticated;
grant select, delete on public.profiles to authenticated;
grant insert (user_id, full_name, country_of_residence, degree_level, field_interests, languages, preferred_types)
  on public.profiles to authenticated;
grant update (full_name, country_of_residence, degree_level, field_interests, languages, preferred_types)
  on public.profiles to authenticated;

revoke all on public.reminders from anon, authenticated;
grant select, delete on public.reminders to authenticated;
grant insert (user_id, opportunity_id, days_before) on public.reminders to authenticated;

-- mehmonlar (anon) faqat o‘qiydi; yozish faqat RLS orqali admin'ga
revoke insert, update, delete on public.opportunities, public.opportunity_translations,
  public.opportunity_fields, public.opportunity_degrees from anon;
revoke all on public.saved_opportunities from anon;
