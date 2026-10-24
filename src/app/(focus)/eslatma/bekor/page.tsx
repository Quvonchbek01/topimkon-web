import type { Metadata } from 'next';
import Link from 'next/link';
import { cancelReminders } from '@/app/actions/reminders';
import { verifyToken } from '@/lib/reminder-token';
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata: Metadata = { title: 'Eslatmani bekor qilish' };
export const dynamic = 'force-dynamic';

// Havolani faqat ochish hech narsani o‘chirmaydi (pochta skanerlari havolani o‘zi ochib ko‘radi).
// O‘chirish faqat tugma bosilganda, POST orqali bajariladi.
export default async function CancelReminderPage({ searchParams }: { searchParams: { t?: string; done?: string; xato?: string } }) {
  const box = 'card mx-auto max-w-md p-6 text-center';

  if (searchParams.done) {
    return (
      <div className="px-4 py-10">
        <div className={box}>
          <p className="text-3xl" aria-hidden>✅</p>
          <h1 className="mt-2 text-xl font-extrabold">Eslatmalar o‘chirildi</h1>
          <p className="mt-1 text-sm text-muted">Bu imkoniyat bo‘yicha endi xat kelmaydi.</p>
          <Link href="/imkoniyatlar" className="btn-primary mt-5">Imkoniyatlarga o‘tish</Link>
        </div>
      </div>
    );
  }

  const data = searchParams.t ? verifyToken(searchParams.t) : null;
  if (!data) {
    return (
      <div className="px-4 py-10">
        <div className={box}>
          <h1 className="text-xl font-extrabold">Havola yaroqsiz</h1>
          <p className="mt-1 text-sm text-muted">Havola buzilgan yoki noto‘g‘ri. Eslatmalarni Meniki sahifasidan boshqarishingiz mumkin.</p>
          <Link href="/" className="btn-ghost mt-5">Bosh sahifa</Link>
        </div>
      </div>
    );
  }

  const { data: opp } = await createAdminClient().from('opportunities').select('title').eq('id', data.opportunityId).maybeSingle();
  return (
    <div className="px-4 py-10">
      <div className={box}>
        <h1 className="text-xl font-extrabold">Eslatmalarni o‘chiraymi?</h1>
        <p className="mt-2 text-sm text-muted">
          {(opp as { title: string } | null)?.title ?? 'Bu imkoniyat'} bo‘yicha barcha eslatmalar o‘chiriladi.
        </p>
        <form action={cancelReminders} className="mt-5">
          <input type="hidden" name="t" value={searchParams.t} />
          <button type="submit" className="btn-primary">Ha, o‘chirish</button>
        </form>
      </div>
    </div>
  );
}
