# TopImkon

**Shior:** Imkoniyatlar to‘p. O‘zingnikini top.

TopImkon — O‘zbekistonlik talabalar va yoshlar uchun grant, stipendiya, stajirovka, kurs, almashinuv va konkurslarni qidirish, solishtirish va deadline'larni kuzatish platformasi.

## Texnologiyalar

- Next.js 14 App Router, React 18, TypeScript strict
- Tailwind CSS
- Supabase Postgres, Auth va Row Level Security
- Zod, React Hook Form
- grammY, Resend, Vercel Cron
- Vitest va Playwright
- Vercel deploy

## Talablar

- Node.js 20 tavsiya qilinadi (kamida `package.json`dagi Node.js versiyasi talabiga rioya qiling)
- npm
- Supabase loyihasi

## Lokal ishga tushirish

1. Repozitoriyani kompyuteringizga oling va loyiha papkasiga kiring.
2. `.env.example` faylidan `.env.local` nusxa yarating.
3. Supabase Project Settings → API bo‘limidagi URL va anon key qiymatlarini `.env.local`ga kiriting. `SUPABASE_SERVICE_ROLE_KEY` faqat serverda ishlatiladi; uni `NEXT_PUBLIC_` bilan nomlamang va hech qachon GitHub'ga yuklamang.
4. Supabase SQL Editor'da `supabase/schema.sql`, keyin `supabase/seed.sql`, `supabase/stage4.sql` va `supabase/stage4b.sql` fayllarini faqat tegishli bosqichlar hali qo‘llanmagan bo‘lsa ishga tushiring. Qayta bajarishdan oldin mavjud sxemani tekshiring.
5. Bog‘liqliklarni o‘rnating: `npm install`.
6. Kod sifatini tekshiring: `npm run lint`, `npm run typecheck`, `npm test`.
7. Lokal serverni ishga tushiring: `npm run dev`.
8. Brauzerda `http://localhost:3000` manzilini oching.

## Buyruqlar

| Buyruq | Vazifasi |
| --- | --- |
| `npm run dev` | Lokal ishlab chiqish serveri |
| `npm run lint` | ESLint tekshiruvi |
| `npm run typecheck` | TypeScript tekshiruvi |
| `npm test` | Vitest unit testlari |
| `npm run test:e2e` | Playwright E2E testlari |
| `npm run build` | Production build |
| `npm start` | Build qilingan ilovani ishga tushirish |

## Muhit o‘zgaruvchilari

Barcha qiymatlar `.env.example` faylida izohlangan. Production qiymatlarini Vercel → Project → Settings → Environment Variables bo‘limiga kiriting. Hech qanday maxfiy qiymatni kodga yoki GitHub repozitoriyasiga yozmang.

## E2E testlar

E2E testlar ishlashi uchun haqiqiy Supabase test/staging loyihasi bilan saytni ishga tushiring. Bir terminalda `npm run dev`, ikkinchisida `npm run test:e2e` bajaring. Boshqa manzilga qarshi test qilish uchun `E2E_BASE_URL` ni belgilang. Testlar real email yuborish yoki haqiqiy foydalanuvchi hisobini o‘chirish kabi tashqi amallarni bajarmaydi.

## GitHub va CI

`main` yoki `master` branch'iga push va pull request bo‘lganda GitHub Actions lint, TypeScript, unit test va production build tekshiruvlarini bajaradi. Barcha tekshiruvlar muvaffaqiyatli bo‘lishini kutib, keyin deploy qiling.

## Muhim eslatma

`seed.sql` ichidagi imkoniyat ma'lumotlari demo/namuna bo‘lsa, ularni real grant sifatida e'lon qilishdan oldin rasmiy manba, deadline va oxirgi tekshirilgan sanani qo‘lda tekshiring. Kod CI'dan o‘tishi production xavfsizligi, real email yuborilishi yoki Supabase siyosatlari to‘g‘riligini o‘zi kafolatlamaydi.
