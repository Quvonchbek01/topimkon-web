import Link from 'next/link';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { markOpportunityVerified, changeOpportunityStatus, deleteOpportunity } from '@/app/actions/admin';
import { OPPORTUNITY_TYPES } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin panel' };

export default async function AdminPage({ searchParams }: { searchParams: { success?: string; error?: string } }) {
  await requireAdmin();
  const sb = createAdminClient();
  const [{ data: items, error }, { count: opportunityCount }, { count: savedCount }, { count: userCount }] = await Promise.all([
    sb.from('opportunities').select('id, slug, title, org, type, status, deadline, last_verified_at, views, created_at').order('created_at', { ascending: false }).limit(200),
    sb.from('opportunities').select('*', { count: 'exact', head: true }),
    sb.from('saved_opportunities').select('*', { count: 'exact', head: true }),
    sb.from('profiles').select('*', { count: 'exact', head: true }),
  ]);
  return <div className="mx-auto max-w-6xl px-4 py-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold text-brand-dark">TOPIMKON / BOSHQARUV</p><h1 className="mt-1 text-3xl font-extrabold">Admin panel</h1><p className="mt-2 text-sm text-muted">Imkoniyatlarni boshqarish va ma’lumotlarni tekshirish.</p></div><Link className="btn-primary" href="/admin/yangi">+ Yangi imkoniyat</Link></div>
    {searchParams.success && <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-800">Amal bajarildi: {searchParams.success === 'saqlandi' ? 'ma’lumot saqlandi' : searchParams.success === 'tekshirildi' ? 'tekshirilgan sana yangilandi' : searchParams.success === 'ochirildi' ? 'yozuv o‘chirildi' : 'holat yangilandi'}.</p>}
    {searchParams.error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">{searchParams.error}</p>}
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-800">Ma’lumotlarni yuklab bo‘lmadi. Supabase sxemasi va ruxsatlarni tekshiring.</p>}
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[{label:'Jami imkoniyat',value:opportunityCount ?? 0},{label:'Saqlashlar',value:savedCount ?? 0},{label:'Profil',value:userCount ?? 0},{label:'Ko‘rishlar',value:(items ?? []).reduce((sum,x)=>sum+(x.views ?? 0),0)}].map((s)=><div key={s.label} className="card p-4"><p className="text-2xl font-extrabold">{s.value}</p><p className="mt-1 text-xs text-muted">{s.label}</p></div>)}</div>
    <div className="mt-7 overflow-x-auto rounded-2xl border border-line bg-white"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-surface text-muted"><tr><th className="p-3">Imkoniyat</th><th className="p-3">Tur</th><th className="p-3">Holat</th><th className="p-3">Deadline</th><th className="p-3">Tekshirilgan</th><th className="p-3">Amallar</th></tr></thead><tbody>{(items ?? []).map((item)=><tr key={item.id} className="border-t border-line align-top"><td className="p-3"><p className="font-bold">{item.title}</p><p className="mt-1 text-xs text-muted">{item.org} · {item.slug}</p><p className="mt-1 text-xs text-muted">Ko‘rishlar: {item.views}</p></td><td className="p-3">{OPPORTUNITY_TYPES[item.type as keyof typeof OPPORTUNITY_TYPES] ?? item.type}</td><td className="p-3">{item.status}</td><td className="p-3">{item.deadline ?? 'Doimiy'}</td><td className="p-3">{item.last_verified_at ? new Date(item.last_verified_at).toLocaleDateString('uz-UZ') : 'Tekshirilmagan'}</td><td className="p-3"><div className="flex flex-wrap gap-2"><Link className="rounded-lg border border-line px-2 py-1" href={`/admin/${item.id}`}>Tahrirlash</Link><form action={markOpportunityVerified}><input type="hidden" name="id" value={item.id}/><button className="rounded-lg border border-line px-2 py-1" type="submit">Tekshirildi</button></form><form action={changeOpportunityStatus}><input type="hidden" name="id" value={item.id}/><select aria-label={`${item.title} holati`} name="status" defaultValue={item.status} className="rounded-lg border border-line px-2 py-1">{['draft','published','archived'].map(s=><option key={s} value={s}>{s}</option>)}</select><button className="ml-1 rounded-lg border border-line px-2 py-1" type="submit">Saqlash</button></form><form action={deleteOpportunity}><input type="hidden" name="id" value={item.id}/><button className="rounded-lg border border-red-200 px-2 py-1 text-red-700" type="submit">O‘chirish</button></form></div></td></tr>)}</tbody></table>{(!items || items.length===0) && <p className="p-8 text-center text-muted">Hozircha imkoniyatlar yo‘q.</p>}</div>
    <p className="mt-3 text-xs text-muted">Ro‘yxatda eng so‘nggi 200 ta yozuv ko‘rsatiladi. Admin panelga kirish server tomonda tekshiriladi.</p>
  </div>;
}
