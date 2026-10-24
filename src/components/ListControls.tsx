'use client';

import { useRouter } from 'next/navigation';
import { SORTS } from '@/lib/labels';
import { toParams, type Filters } from '@/lib/search-params';

// Saralash va "Muddati o‘tganlarni ko‘rsatish" tumbleri.
export function ListControls({ filters }: { filters: Filters }) {
  const router = useRouter();
  const go = (override: Partial<Filters>) =>
    router.push(`/imkoniyatlar?${toParams(filters, { ...override, page: 1 }).toString()}`);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-5 w-5 accent-[rgb(var(--brand-dark))]"
          checked={filters.expired}
          onChange={(e) => go({ expired: e.target.checked })}
        />
        Muddati o‘tganlarni ko‘rsatish
      </label>
      <label className="sr-only" htmlFor="sort">Saralash</label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(e) => go({ sort: e.target.value as Filters['sort'] })}
        className="input !w-auto"
      >
        {Object.entries(SORTS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
    </div>
  );
}
