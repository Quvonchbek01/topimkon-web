import Link from 'next/link';

// Profil to‘ldirilmagan kirgan foydalanuvchiga yengil taklif (majburlash emas).
export function ProfilePrompt() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/50 bg-brand-soft p-4 text-sm">
      <p><b className="text-brand-dark">Sizga qanchalik mosligini ko‘ring.</b> Profilni to‘ldirish 1 daqiqa oladi.</p>
      <Link href="/onboarding" className="btn-primary !min-h-[40px]">To‘ldirish</Link>
    </div>
  );
}
