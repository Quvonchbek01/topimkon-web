import type { Metadata } from 'next';
import { ActiveFilters } from '@/components/ActiveFilters';
import { EmptyState } from '@/components/EmptyState';
import { FilterSheet } from '@/components/FilterSheet';
import { ListControls } from '@/components/ListControls';
import { OpportunityCard } from '@/components/OpportunityCard';
import { Pagination } from '@/components/Pagination';
import { ProfilePrompt } from '@/components/ProfilePrompt';
import { SearchBar } from '@/components/SearchBar';
import { TypeChips } from '@/components/TypeChips';
import { getFilterOptions, listOpportunities } from '@/lib/opportunities';
import { parseFilters } from '@/lib/search-params';
import { cardExtras, getViewer } from '@/lib/viewer';

export const metadata: Metadata = { title: 'Barcha imkoniyatlar' };
export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFilters(searchParams);
  const viewer = await getViewer();
  const [{ items, total }, options] = await Promise.all([
    listOpportunities(filters, viewer?.profile ?? null),
    getFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold">Imkoniyatlar</h1>
      <div className="mt-5"><SearchBar defaultValue={filters.q} /></div>
      <div className="mt-4"><TypeChips /></div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="text-sm text-muted" aria-live="polite">{total} ta natija</p>
        <div className="flex flex-wrap items-center gap-3">
          <FilterSheet
            groups={filters.groups}
            countries={options.countries}
            languages={options.languages}
            keep={{ q: filters.q, sort: filters.sort, expired: filters.expired }}
          />
          <ListControls filters={filters} />
        </div>
      </div>

      {viewer && !viewer.profile?.degree_level && <div className="mt-4"><ProfilePrompt /></div>}
      <div className="mt-4"><ActiveFilters filters={filters} /></div>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState
            title="Hech narsa topilmadi"
            text="Filtrlarni kamaytirib yoki boshqa so‘z bilan qidirib ko‘ring."
            href="/imkoniyatlar"
            action="Filtrlarni tozalash"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((o) => <OpportunityCard key={o.id} item={o} {...cardExtras(viewer, o)} />)}
          </div>
        )}
      </div>
      <Pagination filters={filters} total={total} />
    </div>
  );
}
