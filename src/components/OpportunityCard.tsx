import Link from 'next/link';
import { DeadlineBadge } from '@/components/DeadlineBadge';
import { SaveButton } from '@/components/SaveButton';
import { daysLeft } from '@/lib/deadline';
import { LANGUAGES, label } from '@/lib/labels';
import type { Match } from '@/lib/match';
import type { ListItem } from '@/lib/opportunities';
import { FORMATS, FUNDING, OPPORTUNITY_TYPES } from '@/lib/types';

interface Props {
  item: ListItem;
  match?: Match | null;
  saved?: boolean;
  loggedIn?: boolean;
}

export function OpportunityCard({ item, match = null, saved = false, loggedIn = false }: Props) {
  const days = daysLeft(item.deadline);
  const expired = days !== null && days < 0;
  return (
    <article
      className={`card relative flex min-h-[250px] flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-soft focus-within:ring-2 focus-within:ring-brand-dark ${
        expired ? 'opacity-70' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge">{OPPORTUNITY_TYPES[item.type]}</span>
        {item.is_sample && <span className="badge-sample">Namuna</span>}
        {expired && <span className="badge-expired">Muddati o‘tgan</span>}
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug">
        {/* Butun karta bosiladigan: havola kartani to‘ldiradi */}
        <Link href={`/imkoniyatlar/${item.slug}`} className="outline-none after:absolute after:inset-0">
          {item.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted">{item.org} · {item.country}</p>
      {match && (
        <p className="mt-2 text-sm">
          <b className="text-brand-dark">Sizga {match.score}% mos</b>
          <span className="text-muted"> — {match.reason}</span>
        </p>
      )}
      <div className="my-3 flex flex-wrap gap-1.5">
        <span className="meta">{FORMATS[item.format]}</span>
        <span className="meta">{FUNDING[item.funding]}</span>
        <span className="meta">{label(LANGUAGES, item.language)}</span>
      </div>
      <p className="line-clamp-3 text-sm text-muted">{item.summary}</p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <DeadlineBadge deadline={item.deadline} />
        <SaveButton opportunityId={item.id} initialSaved={saved} loggedIn={loggedIn} />
      </div>
    </article>
  );
}
