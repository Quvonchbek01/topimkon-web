# TopImkon — 6-bosqich: sifat, SEO va xavfsizlik

Bu arxiv Stage 5 kodiga qo‘shimcha ravishda quyidagilarni o‘z ichiga oladi:

- CSP va xavfsizlik HTTP headerlari; production muhitida HSTS.
- Profil, saqlanganlar, solishtirish va admin sahifalariga `private, no-store` hamda `noindex` headerlari.
- `robots.txt`, Supabase'dagi e'lon qilingan imkoniyatlardan tuziladigan `sitemap.xml`.
- Umumiy va har bir imkoniyat uchun dinamik Open Graph rasmi.
- PWA manifest, SVG ikonka, minimal service worker va oflayn xato sahifasi.
- O‘zbek tilidagi maxfiylik siyosati va foydalanish shartlari.
- Brauzer xotirasi haqida cookie xabari; marketing cookie ishlatilmaydi.
- Vercel Analytics integratsiyasi (cookie'siz analitika; Vercel deployda statistikani ko‘rish mumkin).
- Prototip palitrasi qaytarildi: navy `#10233f`, yashil `#16a36a`, fon `#f7f9fb`, chiziq `#e5e9ef`, amber `#c98200`, qizil `#c24141`.

## Ishga tushirish

1. Stage 6 ZIP faylini alohida papkaga oching.
2. `.env.example` faylini `.env.local` qilib nusxalang va Supabase kalitlarini kiriting.
3. `npm install` bajaring. Bu bosqichda `@vercel/analytics` paketi ham o‘rnatiladi.
4. `npm run typecheck`, `npm test`, `npm run lint` va `npm run build` buyruqlarini ishga tushiring.
5. `npm run dev` bilan lokalda oching.
6. Deploydan so‘ng `NEXT_PUBLIC_SITE_URL` qiymatini haqiqiy HTTPS domeniga o‘rnating.

## Muhim xavfsizlik eslatmalari

- `SUPABASE_SERVICE_ROLE_KEY` faqat serverda qolishi kerak; hech qachon `NEXT_PUBLIC_` prefiksi bermang.
- CSP hozir Next.js inline bootstrap skriptlari uchun `unsafe-inline`ga ruxsat beradi. Production'da `unsafe-eval` o‘chirilgan. Nonce asosidagi CSP'ga o‘tish uchun Next.js scriptlarining nonce bilan ishlashi alohida joriy etilishi kerak.
- `connect-src https: wss:` Supabase va OAuth integratsiyalari bilan moslik uchun kengroq ruxsat beradi. Production domenlari aniq ma’lum bo‘lgach, buni faqat kerakli domenlar bilan cheklang.
- HSTS `includeSubDomains; preload` ishlatiladi. Uni yoqishdan oldin domenning barcha subdomenlari HTTPS bilan ishlashini tasdiqlang.
- Maxfiylik va foydalanish shartlari boshlang‘ich matnlar; haqiqiy operator, aloqa manzili, saqlash muddatlari va qonuniy talablar bilan tekshirib to‘ldirish zarur.
- Service worker faqat navigatsiya so‘rovi tarmoqda ishlamaganda oflayn sahifani ko‘rsatadi; u shaxsiy sahifalarni yoki foydalanuvchi ma’lumotlarini keshlamaydi.

## Stage 6 doirasi va cheklov

Bu bosqich SEO metadata, xavfsizlik headerlari, huquqiy sahifalar, manifest va oflayn fallbackni qo‘shadi. WCAG AA, Lighthouse 90+, uch tilning to‘liq tarjimasi va barcha xavfsizlik nazoratlari haqiqiy production muhitida alohida sinov talab qiladi. Ular avtomatik ravishda kafolatlangan deb hisoblanmasin.
