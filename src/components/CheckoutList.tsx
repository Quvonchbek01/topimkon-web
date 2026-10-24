'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeadlineBadge } from '@/components/DeadlineBadge';
import type { CartEntry } from '@/lib/opportunities';
import { createClient } from '@/lib/supabase/client';

// Topshirish tartibi: eng yaqin deadline birinchi. Rasmiy saytda topshirilgach "Topshirdim" bosiladi.
export function CheckoutList({ entries }: { entries: CartEntry[] }) {
  const router = useRouter();
  const [applied, setApplied] = useState<string[]>(entries.filter((e) => e.appliedAt).map((e) => e.item.id));

  async function mark(id: string) {
    const was = applied.includes(id);
    setApplied(was ? applied.filter((x) => x !== id) : [...applied, id]);
    const sb = createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    let failed = !user;
    if (user) {
      const res = await sb
        .from('saved_opportunities')
        .update({ applied_at: was ? null : new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('opportunity_id', id);
      failed = !!res.error;
      // Topshirilgach eslatma kerak emas
      if (!failed && !was) await sb.from('reminders').delete().eq('user_id', user.id).eq('opportunity_id', id);
    }
    if (failed) setApplied(applied);
    else router.refresh();
  }

  return (
    <ol className="space-y-3">
      {entries.map(({ item }, i) => {
        const done = applied.includes(item.id);
        return (
          <li key={item.id} className={`card flex flex-wrap items-center gap-3 p-4 ${done ? 'opacity-70' : ''}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-extrabold text-ink">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-snug">{item.title}</p>
              <DeadlineBadge deadline={item.deadline} />
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 sm:flex-none">Topshirish ↗</a>
              <button
                type="button"
                onClick={() => mark(item.id)}
                aria-pressed={done}
                className={`btn-ghost flex-1 sm:flex-none ${done ? '!border-brand !bg-brand-soft !text-brand-dark' : ''}`}
              >
                {done ? '✓ Topshirdim' : 'Topshirdim'}
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
