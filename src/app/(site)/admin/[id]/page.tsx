import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminOpportunityForm } from '@/components/AdminOpportunityForm';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Opportunity } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Imkoniyatni tahrirlash' };
export default async function EditOpportunityPage({ params, searchParams }: { params: { id: string }; searchParams: { error?: string } }) {
  await requireAdmin();
  const sb = createAdminClient();
  const [{ data: item, error }, { data: fields }, { data: degrees }, { data: translations }] = await Promise.all([
    sb.from('opportunities').select('*').eq('id', params.id).maybeSingle(),
    sb.from('opportunity_fields').select('field').eq('opportunity_id', params.id),
    sb.from('opportunity_degrees').select('degree').eq('opportunity_id', params.id),
    sb.from('opportunity_translations').select('locale,title,summary,description').eq('opportunity_id', params.id),
  ]);
  if (error || !item) notFound();
  return <div className="mx-auto max-w-4xl px-4 py-8"><Link className="text-sm font-semibold text-brand-dark" href="/admin">← Admin panel</Link><h1 className="my-4 text-3xl font-extrabold">Imkoniyatni tahrirlash</h1><AdminOpportunityForm item={item as Opportunity} fields={(fields ?? []).map((x)=>x.field)} degrees={(degrees ?? []).map((x)=>x.degree)} translations={translations ?? []} error={searchParams.error}/></div>;
}
