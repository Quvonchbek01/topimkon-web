'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const DAYS = [14, 7, 3, 1] as const;

// Meniki qatoridagi eslatma kunlari. Optimistik: xato bo‘lsa orqaga qaytadi.
export function ReminderPicker({ opportunityId, initial }: { opportunityId: string; initial: number[] }) {
  const [days, setDays] = useState<number[]>(initial);

  async function toggle(d: number) {
    const on = days.includes(d);
    setDays(on ? days.filter((x) => x !== d) : [...days, d]);
    const sb = createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    let failed = !user;
    if (user) {
      const res = on
        ? await sb.from('reminders').delete().eq('user_id', user.id).eq('opportunity_id', opportunityId).eq('days_before', d)
        : await sb.from('reminders').insert({ user_id: user.id, opportunity_id: opportunityId, days_before: d });
      failed = !!res.error && res.error.code !== '23505';
    }
    if (failed) setDays(days);
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-muted" aria-hidden>🔔</span>
      {DAYS.map((d) => (
        <button
          key={d}
          type="button"
          aria-pressed={days.includes(d)}
          aria-label={`${d} kun oldin eslatish`}
          onClick={() => toggle(d)}
          className={`chip !px-2.5 !py-1 text-xs ${days.includes(d) ? 'chip-on' : ''}`}
        >
          {d} kun
        </button>
      ))}
    </div>
  );
}
