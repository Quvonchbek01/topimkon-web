import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/LoginForm';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = { title: 'Kirish' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; xato?: string } }) {
  const next = searchParams.next?.startsWith('/') && !searchParams.next.startsWith('//') ? searchParams.next : '/';
  if (await getViewer()) redirect(next);
  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-3xl font-extrabold">Kirish</h1>
      <p className="mb-6 mt-2 text-muted">
        Imkoniyatlarni Meniki’ga qo‘shish, moslikni ko‘rish va deadline eslatmalarini olish uchun.
      </p>
      {searchParams.xato && (
        <p className="mb-4 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger" role="alert">
          Kirish havolasi eskirgan yoki boshqa brauzerda ochilgan. Qaytadan urinib ko‘ring.
        </p>
      )}
      <div className="card p-6"><LoginForm next={next} /></div>
    </div>
  );
}
