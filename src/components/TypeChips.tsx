import Link from 'next/link';
import { OPPORTUNITY_TYPES } from '@/lib/types';

export function TypeChips() {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Tezkor tur tanlash">
      {Object.entries(OPPORTUNITY_TYPES).map(([key, name]) => (
        <Link key={key} href={`/imkoniyatlar?type=${key}`} className="chip">
          {name}
        </Link>
      ))}
    </div>
  );
}
