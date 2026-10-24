# TopImkon — Vercel deploy qo‘llanmasi

## 1. Supabase loyihasi

1. Supabase'da yangi loyiha yarating va Database parolini xavfsiz joyda saqlang.
2. SQL Editor'da `supabase/schema.sql` faylini tekshirib, bir marta ishga tushiring.
3. Demo ma'lumotlar kerak bo‘lsa `supabase/seed.sql`ni ishga tushiring; rasmiy manbalar tekshirilmaguncha demo yozuvlarni haqiqiy imkoniyat deb e'lon qilmang.
4. Agar Stage 4 migratsiyalari hali bajarilmagan bo‘lsa, `supabase/stage4.sql` va `supabase/stage4b.sql`ni tartib bilan bajaring. Avval mavjud ustunlar va siyosatlarni tekshiring, chunki migratsiyalarni takroran ishga tushirish xato berishi mumkin.
5. Authentication → URL Configuration bo‘limida Site URL va Redirect URLs'ga lokal (`http://localhost:3000/**`) hamda production domenni kiriting.
6. Google OAuth ishlatilsa, Google Cloud OAuth credential'larini yarating va Supabase ko‘rsatgan callback URL'ni provider sozlamasiga kiriting.
7. Admin foydalanuvchisini faqat ishonchli foydalanuvchi uchun `supabase/make_admin.sql` ko‘rsatmalariga muvofiq belgilang. Ushbu faylni o‘qib, undagi qiymatlarni o‘zingizning haqiqiy user ID'ingizga moslashtiring.

## 2. Resend va Telegram

1. Resend'da domenni tasdiqlang, DNS yozuvlarini qo‘shing va yuboruvchi manzilini sozlang.
2. BotFather orqali Telegram bot yarating; tokenni maxfiy saqlang.
3. `TELEGRAM_WEBHOOK_SECRET`, `CRON_SECRET` va `REMINDER_SECRET` uchun uzun tasodifiy sirlar yarating. Ularni bir-biridan farqli qiling.
4. Webhook'ni production deploy'dan keyin `https://SIZNING-DOMEN/api/telegram/webhook` manziliga o‘rnating. Telegram API'ga yuboriladigan webhook secret token ilovadagi `TELEGRAM_WEBHOOK_SECRET` bilan mos bo‘lsin.

## 3. GitHub

1. GitHub'da private repository yarating.
2. Lokal loyihada `git init` (agar hali git repo bo‘lmasa), `git add .` va `git commit -m "TopImkon stage 7"` bajaring.
3. `.env.local`, `node_modules` va `.next` commit qilinmaganini `git status` orqali tekshiring.
4. GitHub repository manzilini `origin` qilib qo‘shing va `main` branch'iga push qiling.
5. Actions tabida CI tekshiruvlari muvaffaqiyatli tugaganini tekshiring.

## 4. Vercel

1. Vercel'da GitHub repository'ni import qiling.
2. Framework preset `Next.js` ekanini tekshiring.
3. Project → Settings → Environment Variables bo‘limiga `.env.example`dagi kerakli qiymatlarni kiriting. `NEXT_PUBLIC_` prefiksi faqat brauzerga chiqishi mumkin bo‘lgan qiymatlar uchun ishlatiladi. `SUPABASE_SERVICE_ROLE_KEY`, bot tokenlari, Resend key va secret'lar server-only bo‘lib qolishi shart.
4. Preview va Production environment qiymatlarini alohida ko‘rib chiqing.
5. Deploy qiling va build log'larini tekshiring.

## 5. Cron va domen

1. `vercel.json` ichidagi cron yo‘li va jadvalini tekshiring.
2. `CRON_SECRET` Vercel environment'da belgilangan bo‘lishi kerak. Cron endpoint'ni secretsiz ochiq chaqirish mumkin emas.
3. Vercel'da o‘z domeningizni ulang va ko‘rsatilgan DNS yozuvlarini qo‘shing.
4. Supabase Auth redirect URL'lari, `NEXT_PUBLIC_SITE_URL`, email havolalari va Telegram webhook'ni yangi domenga moslang.
5. Production'da login, logout, profil, saqlash, solishtirish, eslatma, Telegram bog‘lash, admin huquqlari va deadline cron'ni kichik test hisoblarida tekshiring.

## 6. Deploydan keyingi tekshiruv

1. `https://SIZNING-DOMEN/` va `/imkoniyatlar` ochilishini tekshiring.
2. `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` javoblarini tekshiring.
3. Supabase RLS yoqilganini va oddiy foydalanuvchi admin yozuvlarini o‘zgartira olmasligini alohida sinang.
4. Test foydalanuvchisi bilan eslatma yaratib, cron log'lari va email/Telegram yetkazilishini tekshiring.
5. Xatolar, loglar va rate limit holatini kuzating. Muammolar bo‘lsa deploy'ni rollback qiling.
