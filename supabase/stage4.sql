-- =====================================================================
-- TopImkon — stage4.sql  (4-bosqich uchun QO‘SHIMCHA SQL)
-- Supabase → SQL Editor → New query → qo‘yib RUN bosing. Bir marta ishga tushiring.
-- schema.sql va seed.sql'ga TEGMANG — ular o‘zgarmagan.
-- =====================================================================

-- Telegram'ni hisobga bog‘lash uchun bir martalik kodlar (10 daqiqa amal qiladi).
create table public.telegram_link_codes (
  code        text primary key check (length(code) between 16 and 64),
  user_id     uuid not null references auth.users(id) on delete cascade,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index telegram_link_codes_user_idx on public.telegram_link_codes (user_id);

-- RLS yoqiladi va HECH QANDAY siyosat yozilmaydi: brauzer bu jadvalga umuman yeta olmaydi,
-- faqat server (service_role) ishlatadi.
alter table public.telegram_link_codes enable row level security;
revoke all on public.telegram_link_codes from anon, authenticated;
