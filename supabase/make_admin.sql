-- O‘zingizni admin qilish (kamida bir marta saytga kirib, hisob yaratganingizdan keyin).
-- 'sizning@email.uz' ni o‘z emailingizga almashtiring, so‘ng SQL Editor'da RUN bosing.
update public.profiles
set is_admin = true
where user_id = (select id from auth.users where email = 'sizning@email.uz');
