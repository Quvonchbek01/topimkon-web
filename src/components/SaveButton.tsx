'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// "+ Meniki" — imkoniyatni savatchaga qo‘shadi. Optimistik: xato bo‘lsa orqaga qaytadi.
export function SaveButton({ opportunityId, initialSaved, loggedIn }: { opportunityId: string; initialSaved: boolean; loggedIn: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedIn) return router.push(`/kirish?next=${encodeURIComponent(path + window.location.search)}`);
    if (busy) return;

    const next = !saved;
    setSaved(next);
    setBusy(true);
    const sb = createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    let failed = !user;
    if (user) {
      if (next) {
        const res = await sb.from('saved_opportunities').insert({ user_id: user.id, opportunity_id: opportunityId });
        failed = !!res.error && res.error.code !== '23505'; // 23505 = allaqachon Meniki'da
      } else {
        // Meniki'dan olinsa, shu imkoniyatning eslatmalari ham o‘chadi
        await sb.from('reminders').delete().eq('user_id', user.id).eq('opportunity_id', opportunityId);
        const res = await sb.from('saved_opportunities').delete().eq('user_id', user.id).eq('opportunity_id', opportunityId);
        failed = !!res.error;
      }
    }
    if (failed) setSaved(!next);
    else router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`relative z-10 inline-flex min-h-[40px] items-center gap-1 rounded-xl border px-3 text-sm font-bold transition ${
        saved ? 'border-brand bg-brand-soft text-brand-dark' : 'border-line bg-card hover:border-brand'
      }`}
    >
      {saved ? '✓ Meniki’da' : '+ Meniki'}
    </button>
  );
}
