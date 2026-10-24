'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { opportunityAdminSchema } from '@/lib/admin-schemas';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

function readForm(formData: FormData) {
  const str = (key: string) => String(formData.get(key) ?? '');
  const yes = (key: string) => formData.get(key) === 'on';
  return {
    slug: str('slug'), title: str('title'), org: str('org'), country: str('country'),
    type: str('type'), format: str('format'), funding: str('funding'), language: str('language'),
    level: str('level'), fee: str('fee'), deadline: str('deadline'), summary: str('summary'),
    description: str('description'), eligibility: str('eligibility'), how_to_apply: str('how_to_apply'),
    source_url: str('source_url'), status: str('status'), featured: yes('featured'),
    for_uzbekistan: yes('for_uzbekistan'), is_sample: yes('is_sample'), fields: str('fields'), degrees: str('degrees'),
    ru_title: str('ru_title'), ru_summary: str('ru_summary'), ru_description: str('ru_description'),
    en_title: str('en_title'), en_summary: str('en_summary'), en_description: str('en_description'),
  };
}

export async function saveOpportunity(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '').trim();
  if (id && !/^[0-9a-f-]{36}$/i.test(id)) redirect('/admin?error=ID+noto‘g‘ri');
  const parsed = opportunityAdminSchema.safeParse(readForm(formData));
  if (!parsed.success) redirect(`/admin${id ? `/${encodeURIComponent(id)}` : '/yangi'}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? 'Forma noto‘g‘ri')}`);
  const v = parsed.data;
  const sb = createAdminClient();
  const payload = {
    slug: v.slug, title: v.title, org: v.org, country: v.country, type: v.type,
    format: v.format, funding: v.funding, language: v.language, level: v.level, fee: v.fee,
    deadline: v.deadline, summary: v.summary, description: v.description, eligibility: v.eligibility,
    how_to_apply: v.how_to_apply, source_url: v.source_url, status: v.status, featured: v.featured,
    for_uzbekistan: v.for_uzbekistan, is_sample: v.is_sample,
  };
  let opportunityId = id;
  if (id) {
    const { error } = await sb.from('opportunities').update(payload).eq('id', id);
    if (error) redirect(`/admin/${encodeURIComponent(id)}?error=${encodeURIComponent('Saqlash amalga oshmadi. Slug takrorlangan yoki ma’lumotlar bazasi xato qaytardi.')}`);
  } else {
    const { data, error } = await sb.from('opportunities').insert(payload).select('id').single();
    if (error || !data) redirect(`/admin/yangi?error=${encodeURIComponent('Yaratib bo‘lmadi. Slug takrorlanmaganini tekshiring.')}`);
    opportunityId = data.id;
  }

  const { error: fieldsDeleteError } = await sb.from('opportunity_fields').delete().eq('opportunity_id', opportunityId);
  const { error: degreesDeleteError } = await sb.from('opportunity_degrees').delete().eq('opportunity_id', opportunityId);
  if (fieldsDeleteError || degreesDeleteError) redirect(`/admin/${opportunityId}?error=${encodeURIComponent('Asosiy yozuv saqlandi, lekin soha yoki darajani yangilashda xato yuz berdi.')}`);
  if (v.fields.length) {
    const { error } = await sb.from('opportunity_fields').insert(v.fields.map((field) => ({ opportunity_id: opportunityId, field })));
    if (error) redirect(`/admin/${opportunityId}?error=${encodeURIComponent('Soha kodlaridan biri noto‘g‘ri.')}`);
  }
  const validDegrees = v.degrees.filter((x): x is 'bachelor' | 'master' | 'phd' => ['bachelor','master','phd'].includes(x));
  if (validDegrees.length) {
    const { error } = await sb.from('opportunity_degrees').insert(validDegrees.map((degree) => ({ opportunity_id: opportunityId, degree })));
    if (error) redirect(`/admin/${opportunityId}?error=${encodeURIComponent('Daraja kodlaridan biri noto‘g‘ri.')}`);
  }
  for (const locale of ['ru','en'] as const) {
    const translation = locale === 'ru'
      ? { title: v.ru_title, summary: v.ru_summary, description: v.ru_description }
      : { title: v.en_title, summary: v.en_summary, description: v.en_description };
    const { error } = await sb.from('opportunity_translations').upsert(
      translation.title && translation.summary
        ? { opportunity_id: opportunityId, locale, ...translation }
        : { opportunity_id: opportunityId, locale, title: v.title, summary: v.summary, description: v.description },
      { onConflict: 'opportunity_id,locale' },
    );
    if (error) redirect(`/admin/${opportunityId}?error=${encodeURIComponent('Tarjima saqlanmadi. Ma’lumotlar bazasi sxemasini tekshiring.')}`);
  }
  revalidatePath('/'); revalidatePath('/imkoniyatlar'); revalidatePath(`/imkoniyatlar/${v.slug}`); revalidatePath('/admin');
  redirect('/admin?success=saqlandi');
}

export async function markOpportunityVerified(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect('/admin?error=ID+noto‘g‘ri');
  const { error } = await createAdminClient().from('opportunities').update({ last_verified_at: new Date().toISOString() }).eq('id', id);
  if (error) redirect(`/admin?error=${encodeURIComponent('Tekshirilgan sana yangilanmadi.')}`);
  revalidatePath('/admin');
  redirect('/admin?success=tekshirildi');
}

export async function changeOpportunityStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(id) || !['draft','published','archived'].includes(status)) redirect('/admin?error=Ma’lumot+noto‘g‘ri');
  const { error } = await createAdminClient().from('opportunities').update({ status }).eq('id', id);
  if (error) redirect('/admin?error=Holatni+o‘zgartirib+bo‘lmadi');
  revalidatePath('/'); revalidatePath('/imkoniyatlar'); revalidatePath('/admin');
  redirect('/admin?success=holat');
}

export async function deleteOpportunity(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect('/admin?error=ID+noto‘g‘ri');
  const { error } = await createAdminClient().from('opportunities').delete().eq('id', id);
  if (error) redirect('/admin?error=O‘chirib+bo‘lmadi');
  revalidatePath('/'); revalidatePath('/imkoniyatlar'); revalidatePath('/admin');
  redirect('/admin?success=ochirildi');
}
