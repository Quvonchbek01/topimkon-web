import { DEGREES, FORMATS, FUNDING, OPPORTUNITY_TYPES } from './types';

// Filtr holati URL query'da saqlanadi (ulashsa bo‘ladi).
// Mantiq: guruh ichida OR, guruhlar o‘rtasida AND.
export const GROUP_KEYS = ['type', 'field', 'degree', 'format', 'funding', 'country', 'language'] as const;
export type GroupKey = (typeof GROUP_KEYS)[number];
export type Groups = Record<GroupKey, string[]>;
export type SortKey = 'best' | 'deadline' | 'new';

export interface Filters {
  q: string;
  groups: Groups;
  sort: SortKey;
  expired: boolean; // true = muddati o‘tganlarni ham ko‘rsatish
  page: number;
}

type Raw = Record<string, string | string[] | undefined>;

// Qiymatlari qat'iy ro‘yxatdan bo‘lgan guruhlar — begona qiymat o‘tkazilmaydi.
const ALLOWED: Partial<Record<GroupKey, string[]>> = {
  type: Object.keys(OPPORTUNITY_TYPES),
  degree: Object.keys(DEGREES),
  format: Object.keys(FORMATS),
  funding: Object.keys(FUNDING),
};

export function emptyGroups(): Groups {
  return { type: [], field: [], degree: [], format: [], funding: [], country: [], language: [] };
}

export function parseFilters(raw: Raw): Filters {
  const groups = emptyGroups();
  for (const key of GROUP_KEYS) {
    const v = raw[key];
    const arr = Array.isArray(v) ? v : v ? [v] : [];
    const allowed = ALLOWED[key];
    groups[key] = Array.from(
      new Set(
        arr
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && s.length <= 60 && (!allowed || allowed.includes(s))),
      ),
    ).slice(0, 10);
  }
  const q = (typeof raw.q === 'string' ? raw.q : '').trim().slice(0, 80);
  const sort: SortKey = raw.sort === 'deadline' || raw.sort === 'new' ? raw.sort : 'best';
  const pageNum = parseInt(typeof raw.page === 'string' ? raw.page : '1', 10);
  const page = Math.min(500, Math.max(1, Number.isFinite(pageNum) ? pageNum : 1));
  return { q, groups, sort, expired: raw.expired === '1', page };
}

export function toParams(f: Filters, override: Partial<Filters> = {}): URLSearchParams {
  const m = { ...f, ...override };
  const p = new URLSearchParams();
  if (m.q) p.set('q', m.q);
  for (const key of GROUP_KEYS) for (const v of m.groups[key]) p.append(key, v);
  if (m.sort !== 'best') p.set('sort', m.sort);
  if (m.expired) p.set('expired', '1');
  if (m.page > 1) p.set('page', String(m.page));
  return p;
}

export function countActive(groups: Groups): number {
  return GROUP_KEYS.reduce((n, k) => n + groups[k].length, 0);
}
