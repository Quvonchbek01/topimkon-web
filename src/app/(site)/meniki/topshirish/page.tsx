import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckoutList } from '@/components/CheckoutList';
import { EmptyState } from '@/components/EmptyState';
import { getCart } from '@/lib/opportunities';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = { title: 'Topshirish' };
export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ searchParams }: { searchParams: { s?: string | string[] } }) {
  const viewer = await getViewer();
  if (!viewer) redirect('/kirish?next=/meniki');
  const raw = Array.isArray(searchParams.s) ? searchParams.s : searchParams.s ? [searchParams.s] : [];
  const entries = (await getCart(viewer.userId))
    .filter((e) => raw.includes(e.item.slug))
    .sort((a, b) => (a.item.deadline ?? '9999-12-31').localeCompare(b.item.deadline ?? '9999-12-31'));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/meniki" className="text-sm text-muted hover:text-brand-dark">← Meniki</Link>
      <h1 className="mb-5 mt-2 text-3xl font-extrabold">Topshirish</h1>
      {entries.length === 0 ? (
        <EmptyState title="Hech narsa tanlanmagan" text="Meniki sahifasida imkoniyatlarni belgilang." href="/meniki" action="Meniki’ga qaytish" />
      ) : (
        <CheckoutList entries={entries} />
      )}
    </div>
  );
}
