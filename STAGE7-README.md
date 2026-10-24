# Stage 7 — Test va deploy hujjatlari

Ushbu bosqich GitHub Actions CI, Playwright smoke testlari, o‘zbek tilidagi README va raqamlangan deploy qo‘llanmasini qo‘shadi.

Avval `npm run lint`, `npm run typecheck`, `npm test` va `npm run build`ni lokal bajaring. Playwright uchun Supabase bilan sozlangan lokal/staging server kerak: bir terminalda `npm run dev`, boshqasida `npm run test:e2e`.

Bu bosqichning qo‘shilgan testlari public yo‘llarni tekshiradi; ular auth provider, real email, cron va Telegram tashqi xizmatlarini to‘liq end-to-end tasdiqlamaydi. Production'dan oldin bularni staging hisoblarida qo‘lda tekshirish shart.
