-- =====================================================================
-- TopImkon — stage4b.sql  ("Meniki" bo‘limi uchun QO‘SHIMCHA SQL)
-- stage4.sql'dan KEYIN, SQL Editor'da bir marta ishga tushiring.
-- =====================================================================

-- "Topshirdim" belgisi: imkoniyat qachon topshirilgan (NULL = hali topshirilmagan).
alter table public.saved_opportunities add column applied_at timestamptz;

-- Foydalanuvchi faqat O‘Z qatorining faqat shu ustunini o‘zgartira oladi.
create policy saved_own_update on public.saved_opportunities for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.saved_opportunities from authenticated;
grant update (applied_at) on public.saved_opportunities to authenticated;
