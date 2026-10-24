// Moslik algoritmi — sof funksiyalar (server ham, brauzer ham ishlata oladi).
// Vaznlar: daraja 30, soha 25, tur 20, til 15, moliyalashtirish 10 (jami 100).

export const WEIGHTS = { degree: 30, field: 25, type: 20, language: 15, funding: 10 } as const;

export interface MatchProfile {
  degree_level: string | null;
  field_interests: string[];
  languages: string[];
  preferred_types: string[];
}

export interface MatchTarget {
  degrees: string[];
  fields: string[];
  type: string;
  language: string;
  level: string;
  funding: string;
}

export interface Match {
  score: number; // 0..100
  reason: string; // "Daraja va soha mos, til talabi yuqori"
}

type Key = keyof typeof WEIGHTS;
type Parts = Record<Key, number | null>; // null = profilda ma'lumot yo‘q, hisobga olinmaydi

// Moliyalashtirish — profilga bog‘liq emas, imkoniyatning o‘ziga qarab.
const FUNDING_SCORE: Record<string, number> = { full: 1, paid: 0.8, partial: 0.5, none: 0.2 };
const HIGH_LEVELS = ['B2', 'C1', 'C2'];
const NAMES: Record<'degree' | 'field' | 'type' | 'language', string> = {
  degree: 'daraja',
  field: 'soha',
  type: 'tur',
  language: 'til',
};

function parts(p: MatchProfile, o: MatchTarget): Parts {
  return {
    degree: p.degree_level === null ? null : o.degrees.length === 0 ? 1 : o.degrees.includes(p.degree_level) ? 1 : 0,
    field:
      p.field_interests.length === 0 ? null : o.fields.length === 0 ? 1 : o.fields.some((f) => p.field_interests.includes(f)) ? 1 : 0,
    type: p.preferred_types.length === 0 ? null : p.preferred_types.includes(o.type) ? 1 : 0,
    language: p.languages.length === 0 ? null : p.languages.includes(o.language) ? 1 : o.level === 'none' ? 0.5 : 0,
    funding: FUNDING_SCORE[o.funding] ?? 0.5,
  };
}

function joinUz(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} va ${items[items.length - 1]}`;
}

/** Profil bo‘lmasa yoki hech narsa to‘ldirilmagan bo‘lsa null qaytaradi (foiz ko‘rsatilmaydi). */
export function computeMatch(p: MatchProfile, o: MatchTarget): Match | null {
  const s = parts(p, o);
  if (s.degree === null && s.field === null && s.type === null && s.language === null) return null;

  let sum = 0;
  let total = 0;
  (Object.keys(WEIGHTS) as Key[]).forEach((k) => {
    const v = s[k];
    if (v !== null) {
      sum += WEIGHTS[k] * v;
      total += WEIGHTS[k];
    }
  });
  const score = Math.round((sum / total) * 100);

  const matched = (['degree', 'field', 'type', 'language'] as const).filter((k) => s[k] === 1).map((k) => NAMES[k]);
  const notes: string[] = [];
  if (s.degree === 0) notes.push('daraja mos emas');
  if (s.language === 0 && HIGH_LEVELS.includes(o.level)) notes.push('til talabi yuqori');

  const head = matched.length ? `${joinUz(matched)} mos` : '';
  const text = [head, ...notes].filter(Boolean).join(', ') || 'Qisman mos';
  return { score, reason: text.charAt(0).toUpperCase() + text.slice(1) };
}
