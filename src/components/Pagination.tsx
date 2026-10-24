import Link from 'next/link';
import { PAGE_SIZE } from '@/lib/opportunities';
import { toParams, type Filters } from '@/lib/search-params';

export function Pagination({ filters, total }: { filters: Filters; total: number }) {
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) return null;
  const href = (page: number) => `/imkoniyatlar?${toParams(filters, { page }).toString()}`;
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Sahifalash">
      {filters.page > 1 ? (
        <Link href={href(filters.page - 1)} className="btn-ghost">← Oldingi</Link>
      ) : (
        <span className="btn-ghost pointer-events-none opacity-40">← Oldingi</span>
      )}
      <span className="text-sm text-muted">{filters.page} / {pages}</span>
      {filters.page < pages ? (
        <Link href={href(filters.page + 1)} className="btn-ghost">Keyingi →</Link>
      ) : (
        <span className="btn-ghost pointer-events-none opacity-40">Keyingi →</span>
      )}
    </nav>
  );
}
