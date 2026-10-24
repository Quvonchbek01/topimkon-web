import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Foydalanish shartlari',
  description: 'TopImkon platformasidan foydalanish qoidalari.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Foydalanish shartlari</h1>
      <p className="mt-3 text-sm text-muted">Oxirgi yangilanish: 2026-yil 24-oktabr</p>
      <p className="mt-6 text-muted">TopImkon grant, stipendiya, stajirovka, kurs, almashinuv va tanlovlar haqidagi ma’lumotlarni topishga yordam beruvchi platformadir. Saytdan foydalanib, quyidagi qoidalarni tushunganingizni bildirasiz.</p>
      <h2 className="mt-8 text-xl font-bold">Ma’lumotlarning aniqligi</h2>
      <p className="mt-3 text-muted">Biz imkoniyatlarning rasmiy manbasini ko‘rsatishga va tekshirilgan sanani qayd etishga intilamiz. Tashkilotlar shartlar, moliyalashtirish va deadline’larni o‘zgartirishi mumkin. Ariza topshirishdan oldin rasmiy manbadagi eng so‘nggi ma’lumotni tekshirish sizning mas’uliyatingizda. Platformadagi ma’lumotlar grant yoki qabul qilinish kafolati emas.</p>
      <h2 className="mt-8 text-xl font-bold">Hisob va xavfsizlik</h2>
      <p className="mt-3 text-muted">Hisobingizdagi ma’lumotlarni to‘g‘ri saqlang va kirish vositalarini boshqalar bilan bo‘lishmang. Boshqa foydalanuvchining hisobiga kirish, platformani buzishga urinish, avtomatik so‘rovlar bilan xizmatga zarar yetkazish yoki ruxsatsiz ma’lumot olish taqiqlanadi.</p>
      <h2 className="mt-8 text-xl font-bold">Tashqi havolalar</h2>
      <p className="mt-3 text-muted">Rasmiy tashkilotlar va tashqi xizmatlarga olib boruvchi havolalar uchinchi tomon nazoratida. TopImkon ularning mazmuni, mavjudligi yoki maxfiylik amaliyotini boshqarmaydi.</p>
      <h2 className="mt-8 text-xl font-bold">Platformadan foydalanish</h2>
      <p className="mt-3 text-muted">Xizmatni yaxshilash, xavfsizlik yoki qonuniy talablar sababli ayrim funksiyalar o‘zgarishi yoki vaqtincha ishlamasligi mumkin. Ruxsatsiz foydalanish aniqlansa, hisobga kirish cheklanishi mumkin.</p>
      <h2 className="mt-8 text-xl font-bold">Shartlarning o‘zgarishi</h2>
      <p className="mt-3 text-muted">Yangilangan shartlar ushbu sahifada e’lon qilinadi. Platformani ommaviy ishga tushirishdan oldin operatorning yuridik ma’lumotlari va aloqa kanallari shu sahifaga qo‘shilishi kerak.</p>
      <p className="mt-8 rounded-xl border border-line bg-tint p-4 text-sm text-muted">Eslatma: bu boshlang‘ich shartlar matni, yuridik maslahat emas. Ommaviy ishga tushirishdan oldin amaldagi qonunchilikka mosligini tekshiring.</p>
    </article>
  );
}
