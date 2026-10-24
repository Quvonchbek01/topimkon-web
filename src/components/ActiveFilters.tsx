import Link from 'next/link';
import { DEGREES, FORMATS, FUNDING, OPPORTUNITY_TYPES } from '@/lib/types';
import { FIELDS, LANGUAGES, label } from '@/lib/labels';
import { GROUP_KEYS, toParams, type Filters, type GroupKey } from '@/lib/search-params';

const NAMES: Record<GroupKey, Record<string, string>> = {
  type: OPPORTUNITY_TYPES,
  field: FIELDS,
  degree: DEGREES,
  format: FORMATS,
  funding: FUNDING,
  country: {},
  language: LANGUAGES,
};

// Tanlangan filtrlar: har biri bosilsa o‘chadi (server komponent, oddiy havolalar).
export function ActiveFilters({ filters }: { filters: Filters }) {
  const chips = GROUP_KEYS.flatMap((key) =>
    filters.groups[key].map((value) => ({ key, value, name: label(NAMES[key], value) })),
  );
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => {
        const groups = { ...filters.groups, [c.key]: filters.groups[c.key].filter((v) => v !== c.value) };
        return (
          <Link
            key={`${c.key}-${c.value}`}
            href={`/imkoniyatlar?${toParams(filters, { groups, page: 1 }).toString()}`}
            className="chip chip-on"
            aria-label={`${c.name} filtrini olib tashlash`}
          >
            {c.name} ✕
          </Link>
        );
      })}
      <Link href="/imkoniyatlar" className="text-sm font-semibold text-brand-dark underline">Hammasini tozalash</Link>
    </div>
  );
}
