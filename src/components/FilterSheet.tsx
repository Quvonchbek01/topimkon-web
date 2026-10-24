'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEGREES, FORMATS, FUNDING, OPPORTUNITY_TYPES } from '@/lib/types';
import { FIELDS, LANGUAGES, label } from '@/lib/labels';
import { GROUP_KEYS, countActive, emptyGroups, type GroupKey, type Groups } from '@/lib/search-params';

interface Props {
  groups: Groups; // hozir qo‘llangan filtrlar (URL'dan)
  countries: string[];
  languages: string[];
  keep: { q: string; sort: string; expired: boolean }; // filtrdan tashqari holat saqlanadi
}

type Option = [value: string, name: string];

// "Barcha filtrlar" modali. Draft holat: faqat "Qo‘llash" bosilganda URL o‘zgaradi,
// "Bekor qilish" hech narsani o‘zgartirmaydi. Mobilda to‘liq ekranli bottom-sheet.
export function FilterSheet({ groups, countries, languages, keep }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Groups>(groups);

  const sections: { key: GroupKey; title: string; options: Option[] }[] = [
    { key: 'type', title: 'Turi', options: Object.entries(OPPORTUNITY_TYPES) },
    { key: 'field', title: 'Soha', options: Object.entries(FIELDS) },
    { key: 'degree', title: 'Daraja', options: Object.entries(DEGREES) },
    { key: 'format', title: 'Format', options: Object.entries(FORMATS) },
    { key: 'funding', title: 'Moliyalashtirish', options: Object.entries(FUNDING) },
    { key: 'country', title: 'Davlat', options: countries.map((c): Option => [c, c]) },
    { key: 'language', title: 'Til', options: languages.map((l): Option => [l, label(LANGUAGES, l)]) },
  ];

  function openSheet() {
    setDraft(groups);
    setOpen(true);
  }

  function toggle(key: GroupKey, value: string) {
    setDraft((d) => {
      const has = d[key].includes(value);
      return { ...d, [key]: has ? d[key].filter((v) => v !== value) : [...d[key], value] };
    });
  }

  function apply() {
    const p = new URLSearchParams();
    if (keep.q) p.set('q', keep.q);
    for (const key of GROUP_KEYS) for (const v of draft[key]) p.append(key, v);
    if (keep.sort !== 'best') p.set('sort', keep.sort);
    if (keep.expired) p.set('expired', '1');
    router.push(`/imkoniyatlar?${p.toString()}`);
    setOpen(false);
  }

  // Esc bilan yopish + fon aylanmasligi
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const activeCount = countActive(groups);

  return (
    <>
      <button type="button" onClick={openSheet} className="btn-ghost">
        Barcha filtrlar{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/40 md:items-center md:justify-center" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Barcha filtrlar"
            onClick={(e) => e.stopPropagation()}
            className="sheet-in flex h-[100dvh] w-full flex-col bg-card md:h-auto md:max-h-[85vh] md:max-w-2xl md:rounded-xl md:shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-extrabold">Barcha filtrlar</h2>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost !min-h-[40px] !px-3" aria-label="Yopish">✕</button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {sections.map((s) => (
                <fieldset key={s.key}>
                  <legend className="mb-2 text-sm font-bold">{s.title}</legend>
                  <div className="flex flex-wrap gap-2">
                    {s.options.map(([value, name]) => {
                      const on = draft[s.key].includes(value);
                      return (
                        <label key={value} className={`chip cursor-pointer select-none ${on ? 'chip-on' : ''}`}>
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(s.key, value)} />
                          {name}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-line px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => setDraft(emptyGroups())} className="btn-ghost">Tozalash</button>
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost ml-auto">Bekor qilish</button>
              <button type="button" onClick={apply} className="btn-primary">Qo‘llash</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
