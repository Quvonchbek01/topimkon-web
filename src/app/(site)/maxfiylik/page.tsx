import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maxfiylik siyosati',
  description: 'TopImkon foydalanuvchi ma’lumotlarini qanday ishlatishi haqida.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-10 text-ink">
      <h1 className="text-3xl font-extrabold">Maxfiylik siyosati</h1>
      <p className="mt-3 text-sm text-muted">Oxirgi yangilanish: 2026-yil 24-oktabr</p>
      <p className="mt-6 text-muted">TopImkon yoshlar uchun imkoniyatlarni topish va kuzatishni osonlashtiradi. Ushbu sahifa platforma ishlashi uchun zarur ma’lumotlar qanday ishlatilishini sodda tilda tushuntiradi.</p>
      <h2 className="mt-8 text-xl font-bold">Qanday ma’lumotlar yig‘ilishi mumkin?</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
        <li>Hisob yaratganingizda: autentifikatsiya provayderi orqali berilgan email va profilingizda o‘zingiz kiritgan ism, yashash davlati, ta’lim darajasi, qiziqishlar va tillar.</li>
        <li>Saqlangan imkoniyatlar va eslatma sozlamalari — siz tanlagan funksiyalarni bajarish uchun.</li>
        <li>Telegramni o‘zingiz bog‘lasangiz, eslatma yuborish va bot buyruqlarini bajarish uchun Telegram chat identifikatori.</li>
        <li>Texnik xavfsizlik va xizmat ishlashini tekshirish uchun hosting provayderi qayd etadigan texnik ma’lumotlar.</li>
      </ul>
      <h2 className="mt-8 text-xl font-bold">Ma’lumotlardan foydalanish</h2>
      <p className="mt-3 text-muted">Ma’lumotlar hisobingizni yuritish, mos imkoniyatlarni hisoblash, saqlangan ro‘yxat va siz yoqqan eslatmalarni taqdim etish, xavfsizlikni ta’minlash uchun ishlatiladi. TopImkon shaxsiy ma’lumotlarni sotishni ko‘zlamaydi.</p>
      <h2 className="mt-8 text-xl font-bold">Tashqi xizmatlar</h2>
      <p className="mt-3 text-muted">Platforma Supabase (ma’lumotlar bazasi va kirish), Google (agar Google orqali kirsangiz), Telegram (agar botni bog‘lasangiz), Resend (email eslatmalar) va Vercel (hosting hamda yoqilgan analitika) xizmatlaridan foydalanishi mumkin. Ushbu xizmatlar o‘z maxfiylik shartlariga ega. Vercel Analytics yoqilgan muhitda foydalanish statistikasi cookie’siz usulda yig‘ilishi mumkin.</p>
      <h2 className="mt-8 text-xl font-bold">Saqlash va himoya</h2>
      <p className="mt-3 text-muted">Ma’lumotlarga kirish rol va maqsad bo‘yicha cheklanadi. Ma’lumotlar bazasida Row Level Security qo‘llanadi; maxfiy server kalitlari brauzerga berilmasligi kerak. Internet orqali uzatish va saqlashning hech bir usuli mutlaq xavfsizlikni kafolatlamaydi.</p>
      <h2 className="mt-8 text-xl font-bold">Ma’lumotlarni boshqarish</h2>
      <p className="mt-3 text-muted">Profilingizni tahrirlashingiz yoki hisobni o‘chirish funksiyasidan foydalanishingiz mumkin. Eslatmalarni bekor qilish havolasi orqali ham to‘xtatish mumkin. Qonuniy yoki xavfsizlik sababli ayrim texnik qaydlar qisqa muddat saqlanishi mumkin.</p>
      <h2 className="mt-8 text-xl font-bold">Brauzer xotirasi</h2>
      <p className="mt-3 text-muted">Sayt mavzu rejimi va xabar tanlovini eslab qolish uchun localStorage’dan foydalanadi. Bu sozlamalar brauzeringizda saqlanadi va brauzer sozlamalaridan o‘chirilishi mumkin.</p>
      <h2 className="mt-8 text-xl font-bold">O‘zgarishlar va aloqa</h2>
      <p className="mt-3 text-muted">Siyosat yangilansa, ushbu sahifadagi sana o‘zgartiriladi. Aloqa emaili loyiha rasmiy domeni sozlangach shu sahifaga qo‘shilishi kerak; hozircha tasdiqlangan aloqa manzili e’lon qilinmagan.</p>
      <p className="mt-8 rounded-xl border border-line bg-tint p-4 text-sm text-muted">Eslatma: bu loyiha uchun tayyorlangan boshlang‘ich siyosat matni, yuridik maslahat emas. Platformani ommaga ishga tushirishdan oldin amaldagi qonunchilik va haqiqiy provayder sozlamalariga mosligini tekshiring.</p>
    </article>
  );
}
