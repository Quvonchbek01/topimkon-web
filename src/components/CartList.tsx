'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeadlineBadge } from '@/components/DeadlineBadge';
import { ReminderPicker } from '@/components/ReminderPicker';
import { daysLeft, deadlineLabel } from '@/lib/deadline';
import type { CartEntry } from '@/lib/opportunities';
import { createClient } from '@/lib/supabase/client';

// "Meniki" — savatcha. Hammasi oldindan tanlangan; pastdagi panel "Topshirishga o‘tish" tugmasi bilan.
export function CartList({ entries }: { entries: CartEntry[] }) {
  const router = useRouter();
  const active = entries.filter((e) => !e.appliedAt);
  const done = entries.filter((e) => e.appliedAt);
  const [gone, setGone] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>(active.map((e) => e.item.slug));

  const shown = active.filter((e) => !gone.includes(e.item.id));
  const chosen = shown.filter((e) => picked.includes(e.item.slug));
  const nearest = chosen
    .map((e) => daysLeft(e.item.deadline))
    .filter((d): d is number => d !== null && d >= 0)
    .sort((a, b) => a - b)[0];
  const q = chosen.map((e) => `s=${encodeURIComponent(e.item.slug)}`).join('&');

  async function remove(id: string) {
    setGone((g) => [...g, id]);
    const sb = createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return;
    await sb.from('reminders').delete().eq('user_id', user.id).eq('opportunity_id', id);
    const res = await sb.from('saved_opportunities').delete().eq('user_id', user.id).eq('opportunity_id', id);
    if (res.error) setGone((g) => g.filter((x) => x !== id));
    else router.refresh();
  }

  const toggle = (slug: string) => setPicked((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));

  return (
    <>
      <ul className="space-y-3">
        {shown.map(({ item, reminders }) => (
          <li key={item.id} className="card flex gap-3 p-4">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--brand-dark))]"
              checked={picked.includes(item.slug)}
              onChange={() => toggle(item.slug)}
              aria-label={`${item.title} — tanlash`}
            />
            <div className="min-w-0 flex-1">
              <Link href={`/imkoniyatlar/${item.slug}`} className="font-bold leading-snug hover:text-brand-dark">{item.title}</Link>
              <p className="text-sm text-muted">{item.org} · {item.country}</p>
              <div className="mt-1"><DeadlineBadge deadline={item.deadline} /></div>
              {item.deadline && <ReminderPicker opportunityId={item.id} initial={reminders} />}
            </div>
            <button type="button" onClick={() => remove(item.id)} className="h-9 w-9 shrink-0 rounded-lg text-muted hover:bg-tint hover:text-danger" aria-label="Meniki’dan olib tashlash">✕</button>
          </li>
        ))}
      </ul>

      {done.length > 0 && (
        <section className="mt-10" aria-labelledby="done">
          <h2 id="done" className="mb-3 text-lg font-bold">Topshirilgan</h2>
          <ul className="space-y-2">
            {done.map(({ item }) => (
              <li key={item.id} className="card flex items-center justify-between gap-3 p-3 opacity-75">
                <Link href={`/imkoniyatlar/${item.slug}`} className="font-semibold">{item.title}</Link>
                <span className="text-xs font-bold text-brand-dark">✓ Topshirilgan</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Savatchadagi kabi pastki panel */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="text-sm">
            <p className="font-bold">Tanlandi: {chosen.length}</p>
            {nearest !== undefined && <p className="text-xs text-muted">Eng yaqin: {deadlineLabel(nearest)}</p>}
          </div>
          <div className="flex gap-2">
            {chosen.length >= 2 && chosen.length <= 3 && (
              <Link href={`/solishtirish?${q}`} className="btn-ghost">Solishtirish</Link>
            )}
            {chosen.length > 0 ? (
              <Link href={`/meniki/topshirish?${q}`} className="btn-primary">Topshirishga o‘tish</Link>
            ) : (
              <span className="btn-primary pointer-events-none opacity-50" aria-disabled="true">Topshirishga o‘tish</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
