# TopImkon — 5-bosqich: Admin panel

Ushbu bosqichda mavjud loyihaga server tomonda admin tekshiruvi va imkoniyatlarni boshqarish interfeysi qo‘shildi.

## Qo‘shilgan imkoniyatlar
- `/admin`: imkoniyatlar ro‘yxati, umumiy ko‘rsatkichlar va holatni boshqarish.
- `/admin/yangi`: yangi imkoniyat yaratish.
- `/admin/[id]`: mavjud imkoniyatni tahrirlash.
- `zod` orqali server-side validatsiya; rasmiy havola faqat HTTP(S) bo‘lishi mumkin.
- RU va EN tarjima yozuvlarini saqlash.
- Soha va darajalarni boshqarish.
- “Tekshirildi” amali `last_verified_at`ni yangilaydi.
- Har bir admin sahifasi va server action foydalanuvchining `profiles.is_admin` qiymatini serverda tekshiradi. Service-role client faqat shu tekshiruvdan keyin ishlatiladi.

## Ishga tushirish
1. `.env.local` faylida Supabase URL, anon key va `SUPABASE_SERVICE_ROLE_KEY` serverda sozlangan bo‘lsin. Service role kalitini `NEXT_PUBLIC_` bilan nomlamang.
2. Supabase `schema.sql`, `stage4.sql` va `stage4b.sql` avvalgi bosqichdagi holatida qo‘llangan bo‘lishi kerak.
3. `supabase/make_admin.sql` ko‘rsatmasi bo‘yicha ishonchli hisobga admin huquqini bering. Bu SQL'ni faqat o‘zingizning aniq foydalanuvchi ID'ingiz bilan bajaring.
4. `npm install`, keyin `npm run dev`.
5. Saytga admin hisob bilan kiring va `/admin` sahifasini oching.

## Muhim
- Bu bosqichda SQL sxemasi o‘zgartirilmagan; mavjud `opportunities`, `opportunity_translations`, `opportunity_fields`, `opportunity_degrees` jadvallaridan foydalanadi.
- Admin amallari bir nechta jadvalga ketma-ket yozadi. Shuning uchun DB tranzaksiyasi talab qilinadigan katta hajmli ishlab chiqarish ish jarayoni uchun keyingi xavfsizlik bosqichida bu amallarni bitta PostgreSQL RPC tranzaksiyasiga ko‘chirish tavsiya qilinadi.
- Ushbu muhitda `npm install`, `npm run typecheck`, `npm run lint` va `npm run build` bajarilmadi. Deploy qilishdan oldin lokalda tekshiring.
