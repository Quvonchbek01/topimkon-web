import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { todayTashkent } from '@/lib/deadline';
import { computeMatch, type MatchProfile } from '@/lib/match';
import type { Filters } from '@/lib/search-params';
import type { Opportunity } from '@/lib/types';

export const PAGE_SIZE = 12;

export interface ListItem extends Opportunity {
  fields: string[];
  degrees: string[];
}

type Joined = Opportunity & {
  opportunity_fields?: { field: string }[];
  opportunity_degrees?: { degree: string }[];
};

function toItem(row: unknown): ListItem {
  const r = row as Joined;
  return {
    ...r,
    fields: r.opportunity_fields?.map((x) => x.field) ?? [],
    degrees: r.opportunity_degrees?.map((x) => x.degree) ?? [],
  };
}

const JOIN = '*, opportunity_fields(field), opportunity_degrees(degree)';
// Muddati o‘tmaganlar (yoki doimiy qabul) — Toshkent sanasi bo‘yicha.
const notExpired = () => `deadline.is.null,deadline.gte.${todayTashkent()}`;

/** /imkoniyatlar sahifasi: filtr + qidiruv + saralash + sahifalash. */
export async function listOpportunities(f: Filters, profile: MatchProfile | null = null): Promise<{ items: ListItem[]; total: number }> {
  const sb = createClient();
  const g = f.groups;
  // !inner — faqat tanlangan soha/daraja bo‘yicha mos kelganlarni qoldiradi.
  const select =
    `*, opportunity_fields${g.field.length ? '!inner' : ''}(field), ` +
    `opportunity_degrees${g.degree.length ? '!inner' : ''}(degree)`;

  let q = sb.from('opportunities').select(select, { count: 'exact' }).eq('status', 'published');

  if (!f.expired) q = q.or(notExpired());
  if (f.q) {
    // PostgREST filtr belgilarini olib tashlaymiz (in‘ektsiyadan himoya).
    const s = f.q.replace(/[,()%*_\\"]/g, ' ').trim();
    if (s) q = q.or(`title.ilike.%${s}%,org.ilike.%${s}%,country.ilike.%${s}%,summary.ilike.%${s}%`);
  }
  if (g.type.length) q = q.in('type', g.type);
  if (g.format.length) q = q.in('format', g.format);
  if (g.funding.length) q = q.in('funding', g.funding);
  if (g.country.length) q = q.in('country', g.country);
  if (g.language.length) q = q.in('language', g.language);
  if (g.degree.length) q = q.in('opportunity_degrees.degree', g.degree);
  if (g.field.length) q = q.in('opportunity_fields.field', g.field);

  if (f.sort === 'new') q = q.order('created_at', { ascending: false });
  else if (f.sort === 'deadline') q = q.order('deadline', { ascending: true, nullsFirst: false });
  else
    q = q
      .order('featured', { ascending: false })
      .order('deadline', { ascending: true, nullsFirst: false });

  // "Eng mos" + kirgan foydalanuvchi: moslik foizi bo‘yicha saralash (eng ko‘pi bilan 300 ta olinadi).
  if (f.sort === 'best' && profile?.degree_level) {
    const { data, error } = await q.limit(300);
    if (error) throw new Error(error.message);
    const scored = ((data ?? []) as unknown[]).map(toItem).map((it) => ({ it, s: computeMatch(profile, it)?.score ?? 0 }));
    scored.sort((a, b) => b.s - a.s); // saralash barqaror: teng ballarda oldingi tartib saqlanadi
    const from = (f.page - 1) * PAGE_SIZE;
    return { items: scored.slice(from, from + PAGE_SIZE).map((x) => x.it), total: scored.length };
  }

  const from = (f.page - 1) * PAGE_SIZE;
  const { data, count, error } = await q.range(from, from + PAGE_SIZE - 1);
  if (error) throw new Error(error.message);
  return { items: ((data ?? []) as unknown[]).map(toItem), total: count ?? 0 };
}

/** Bosh sahifa: tavsiya etilgan, deadline yaqin va statistika. */
export async function getHomeData() {
  const sb = createClient();
  const today = todayTashkent();
  const [featured, closing, total, scholarships, forUz] = await Promise.all([
    sb.from('opportunities').select(JOIN).eq('status', 'published').eq('featured', true)
      .or(notExpired()).order('deadline', { ascending: true, nullsFirst: false }).limit(3),
    sb.from('opportunities').select(JOIN).eq('status', 'published')
      .gte('deadline', today).order('deadline', { ascending: true }).limit(3),
    sb.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'published').or(notExpired()),
    sb.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'published')
      .eq('type', 'scholarship').or(notExpired()),
    sb.from('opportunities').select('id', { count: 'exact', head: true }).eq('status', 'published')
      .eq('for_uzbekistan', true).or(notExpired()),
  ]);
  const err = featured.error ?? closing.error ?? total.error;
  if (err) throw new Error(err.message);
  return {
    featured: ((featured.data ?? []) as unknown[]).map(toItem),
    closing: ((closing.data ?? []) as unknown[]).map(toItem),
    stats: { total: total.count ?? 0, scholarships: scholarships.count ?? 0, forUz: forUz.count ?? 0 },
  };
}

export async function getBySlug(slug: string): Promise<ListItem | null> {
  const { data, error } = await createClient()
    .from('opportunities').select(JOIN).eq('slug', slug).eq('status', 'published').maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toItem(data) : null;
}

/** O‘xshash: shu turdagi, muddati o‘tmagan boshqa imkoniyatlar. */
export async function getSimilar(item: ListItem): Promise<ListItem[]> {
  const { data } = await createClient()
    .from('opportunities').select(JOIN).eq('status', 'published').eq('type', item.type)
    .neq('id', item.id).or(notExpired())
    .order('deadline', { ascending: true, nullsFirst: false }).limit(3);
  return ((data ?? []) as unknown[]).map(toItem);
}

/** Filtr modali uchun mavjud davlat va tillar ro‘yxati. */
export async function getFilterOptions(): Promise<{ countries: string[]; languages: string[] }> {
  const { data } = await createClient().from('opportunities').select('country, language').eq('status', 'published');
  const rows = (data ?? []) as { country: string; language: string }[];
  const uniq = (xs: string[]) => Array.from(new Set(xs)).sort((a, b) => a.localeCompare(b));
  return { countries: uniq(rows.map((r) => r.country)), languages: uniq(rows.map((r) => r.language)) };
}

export async function bumpViews(slug: string): Promise<void> {
  await createClient().rpc('increment_views', { p_slug: slug });
}

export interface CartEntry {
  item: ListItem;
  appliedAt: string | null;
  reminders: number[]; // tanlangan eslatma kunlari
}

/** "Meniki": foydalanuvchi qo‘shgan imkoniyatlar (oxirgi qo‘shilgani birinchi), eslatmalari bilan. */
export async function getCart(userId: string): Promise<CartEntry[]> {
  const sb = createClient();
  const [saved, rem] = await Promise.all([
    sb.from('saved_opportunities')
      .select('created_at, applied_at, opportunities(*, opportunity_fields(field), opportunity_degrees(degree))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    sb.from('reminders').select('opportunity_id, days_before').eq('user_id', userId),
  ]);
  if (saved.error) throw new Error(saved.error.message);
  const byOpp = new Map<string, number[]>();
  for (const r of (rem.data ?? []) as { opportunity_id: string; days_before: number }[]) {
    byOpp.set(r.opportunity_id, [...(byOpp.get(r.opportunity_id) ?? []), r.days_before]);
  }
  return ((saved.data ?? []) as unknown as { applied_at: string | null; opportunities: unknown }[])
    .filter((r) => r.opportunities)
    .map((r) => {
      const item = toItem(r.opportunities);
      return { item, appliedAt: r.applied_at, reminders: byOpp.get(item.id) ?? [] };
    });
}

/** Solishtirish uchun: berilgan slug'lar (so‘ralgan tartibda). */
export async function getBySlugs(slugs: string[]): Promise<ListItem[]> {
  const { data, error } = await createClient().from('opportunities').select(JOIN).eq('status', 'published').in('slug', slugs);
  if (error) throw new Error(error.message);
  const items = ((data ?? []) as unknown[]).map(toItem);
  return slugs.map((s) => items.find((i) => i.slug === s)).filter((i): i is ListItem => !!i);
}
