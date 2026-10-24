import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { daysLeft, deadlineLabel, formatDate } from '@/lib/deadline';
import { FIELDS, LANGUAGES, label } from '@/lib/labels';
import { computeMatch } from '@/lib/match';
import { getBySlugs, type ListItem } from '@/lib/opportunities';
import { DEGREES, FORMATS, FUNDING, OPPORTUNITY_TYPES } from '@/lib/types';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = { title: 'Solishtirish' };
export const dynamic = 'force-dynamic';

export default async function ComparePage({ searchParams }: { searchParams: { s?: string | string[] } }) {
  const raw = Array.isArray(searchParams.s) ? searchParams.s : searchParams.s ? [searchParams.s] : [];
  const slugs = Array.from(new Set(raw.filter((s) => /^[a-z0-9-]{1,120}$/.test(s)))).slice(0, 3);
  const [items, viewer] = await Promise.all([slugs.length >= 2 ? getBySlugs(slugs) : Promise.resolve([]), getViewer()]);

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState title="Solishtirish uchun 2–3 ta imkoniyat kerak" text="Meniki sahifasida kerakli imkoniyatlarni belgilang." href="/meniki" action="Meniki’ga o‘tish" />
      </div>
    );
  }

  const rows: [string, (i: ListItem) => React.ReactNode][] = [
    ['Turi', (i) => OPPORTUNITY_TYPES[i.type]],
    ['Tashkilot', (i) => i.org],
    ['Davlat', (i) => i.country],
    ['Deadline', (i) => (i.deadline ? `${deadlineLabel(daysLeft(i.deadline))} · ${formatDate(i.deadline)}` : 'Doimiy qabul')],
    ['Format', (i) => FORMATS[i.format]],
    ['Moliyalashtirish', (i) => FUNDING[i.funding]],
    ['Til', (i) => `${label(LANGUAGES, i.language)}${i.level !== 'none' ? ` · ${i.level}` : ''}`],
    ['Ariza to‘lovi', (i) => (i.fee > 0 ? `${i.fee} USD` : 'Bepul')],
    ['Daraja', (i) => i.degrees.map((d) => DEGREES[d as keyof typeof DEGREES] ?? d).join(', ') || '—'],
    ['Soha', (i) => i.fields.map((f) => label(FIELDS, f)).join(', ') || '—'],
    ['Moslik', (i) => { const m = viewer?.profile ? computeMatch(viewer.profile, i) : null; return m ? `${m.score}% — ${m.reason}` : '—'; }],
    ['Rasmiy manba', (i) => <a href={i.source_url} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-dark underline">Ochish ↗</a>],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/meniki" className="text-sm text-muted hover:text-brand-dark">← Meniki</Link>
      <h1 className="mb-5 mt-2 text-3xl font-extrabold">Solishtirish</h1>
      {/* Mobilda jadval yon tomonga suriladi, birinchi ustun qotib turadi */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 w-32 bg-tint p-3" scope="col"><span className="sr-only">Mezon</span></th>
              {items.map((i) => (
                <th key={i.id} scope="col" className="min-w-[200px] border-l border-line p-3 align-top">
                  <Link href={`/imkoniyatlar/${i.slug}`} className="font-bold hover:text-brand-dark">{i.title}</Link>
                  {i.is_sample && <span className="badge-sample ml-2">Namuna</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, cell]) => (
              <tr key={name} className="border-t border-line">
                <th scope="row" className="sticky left-0 bg-tint p-3 text-xs font-bold text-muted">{name}</th>
                {items.map((i) => <td key={i.id} className="border-l border-line p-3 align-top">{cell(i)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
