import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CartList } from '@/components/CartList';
import { EmptyState } from '@/components/EmptyState';
import { getCart } from '@/lib/opportunities';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = { title: 'Meniki' };
export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/kirish?next=/meniki');
  const entries = await getCart(viewer.userId);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-8">
      <h1 className="mb-5 text-3xl font-extrabold">Meniki</h1>
      {entries.length === 0 ? (
        <EmptyState title="Meniki bo‘sh" text="Imkoniyat kartasidagi “+ Meniki” tugmasini bosing." href="/imkoniyatlar" action="Imkoniyatlarni ko‘rish" />
      ) : (
        <CartList entries={entries} />
      )}
    </div>
  );
}
