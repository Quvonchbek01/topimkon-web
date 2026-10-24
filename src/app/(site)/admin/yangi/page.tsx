import Link from 'next/link';
import { AdminOpportunityForm } from '@/components/AdminOpportunityForm';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Yangi imkoniyat' };
export default async function NewOpportunityPage({ searchParams }: { searchParams: { error?: string } }) {
  await requireAdmin();
  return <div className="mx-auto max-w-4xl px-4 py-8"><Link className="text-sm font-semibold text-brand-dark" href="/admin">← Admin panel</Link><h1 className="my-4 text-3xl font-extrabold">Yangi imkoniyat</h1><AdminOpportunityForm error={searchParams.error}/></div>;
}
