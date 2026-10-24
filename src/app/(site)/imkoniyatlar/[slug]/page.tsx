import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OpportunityCard } from '@/components/OpportunityCard';
import { SaveButton } from '@/components/SaveButton';
import { ShareButton } from '@/components/ShareButton';
import { daysLeft, deadlineLabel, deadlineTone, formatDate } from '@/lib/deadline';
import { FIELDS, LANGUAGES, label } from '@/lib/labels';
import { bumpViews, getBySlug, getSimilar } from '@/lib/opportunities';
import { DEGREES, FORMATS, FUNDING, OPPORTUNITY_TYPES } from '@/lib/types';
import { cardExtras, getViewer } from '@/lib/viewer';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getBySlug(params.slug);
  if (!item) return { title: 'Topilmadi' };
  return { title: item.title, description: item.summary };
}

const TONE_BOX = {
  urgent: 'border-danger/40 bg-danger/10 text-danger',
  soon: 'border-amber/40 bg-amber/10 text-amber',
  normal: 'border-line bg-tint text-ink',
  open: 'border-brand/50 bg-brand-soft text-brand-dark',
  expired: 'border-line bg-tint text-muted',
} as const;

export default async function OpportunityPage({ params }: Props) {
  const item = await getBySlug(params.slug);
  if (!item) notFound();
  await bumpViews(item.slug);
  const [similar, viewer] = await Promise.all([getSimilar(item), getViewer()]);
  const extras = cardExtras(viewer, item);

  const days = daysLeft(item.deadline);
  const tone = deadlineTone(days);
  const facts: [string, string][] = [
    ['Format', FORMATS[item.format]],
    ['Moliyalashtirish', FUNDING[item.funding]],
    ['Til', `${label(LANGUAGES, item.language)}${item.level !== 'none' ? ` · ${item.level}` : ''}`],
    ['Ariza to‘lovi', item.fee > 0 ? `${item.fee} USD` : 'Bepul'],
    ['Daraja', item.degrees.map((d) => DEGREES[d as keyof typeof DEGREES] ?? d).join(', ') || '—'],
    ['Soha', item.fields.map((f) => label(FIELDS, f)).join(', ') || '—'],
  ];

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <nav className="text-sm text-muted" aria-label="Yo‘l">
        <Link href="/imkoniyatlar" className="hover:text-brand-dark">← Barcha imkoniyatlar</Link>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="badge">{OPPORTUNITY_TYPES[item.type]}</span>
        {item.is_sample && <span className="badge-sample">Namuna</span>}
        {tone === 'expired' && <span className="badge-expired">Muddati o‘tgan</span>}
      </div>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">{item.title}</h1>
      <p className="mt-2 text-muted">{item.org} · {item.country}</p>

      {item.is_sample && (
        <p className="mt-5 rounded-xl border border-line bg-butter/60 p-4 text-sm">
          <b>Bu namuna yozuv.</b> Ma‘lumotlar haqiqiy emas yoki to‘liq tekshirilmagan. Rasmiy manbaga tayanmang.
        </p>
      )}

      <div className={`mt-6 rounded-xl border p-4 ${TONE_BOX[tone]}`}>
        <p className="text-xs font-bold uppercase tracking-wide opacity-80">Deadline</p>
        <p className="mt-1 text-xl font-extrabold">{deadlineLabel(days)}</p>
        {item.deadline && <p className="text-sm opacity-90">{formatDate(item.deadline)}</p>}
      </div>

      {extras.match && (
        <p className="mt-4 rounded-xl border border-brand/50 bg-brand-soft p-4 text-sm">
          <b className="text-brand-dark">Sizga {extras.match.score}% mos</b> — {extras.match.reason}
        </p>
      )}

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {facts.map(([k, v]) => (
          <div key={k} className="card px-4 py-3">
            <dt className="text-xs text-muted">{k}</dt>
            <dd className="mt-0.5 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 space-y-7">
        <section><h2 className="text-xl font-bold">Qisqacha</h2><p className="mt-2 text-muted">{item.summary}</p></section>
        {item.description && <section><h2 className="text-xl font-bold">Tavsif</h2><p className="mt-2 text-muted">{item.description}</p></section>}
        {item.eligibility && <section><h2 className="text-xl font-bold">Shartlar</h2><p className="mt-2 text-muted">{item.eligibility}</p></section>}
        {item.how_to_apply && <section><h2 className="text-xl font-bold">Qanday topshiriladi</h2><p className="mt-2 text-muted">{item.how_to_apply}</p></section>}
      </div>

      <div className="card mt-8 flex flex-wrap items-center gap-3 p-5">
        <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
          Rasmiy manbaga o‘tish ↗
        </a>
        <SaveButton opportunityId={item.id} initialSaved={extras.saved} loggedIn={extras.loggedIn} />
        <ShareButton title={item.title} />
        <p className="w-full text-xs text-muted">
          Oxirgi tekshirilgan sana:{' '}
          {item.last_verified_at ? formatDate(item.last_verified_at) : 'hali tekshirilmagan'}. Ariza topshirishdan oldin
          shartlarni rasmiy saytda tasdiqlang.
        </p>
      </div>

      {similar.length > 0 && (
        <section className="mt-12" aria-labelledby="similar">
          <h2 id="similar" className="mb-4 text-xl font-bold">O‘xshash imkoniyatlar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((o) => <OpportunityCard key={o.id} item={o} {...cardExtras(viewer, o)} />)}
          </div>
        </section>
      )}
    </article>
  );
}
