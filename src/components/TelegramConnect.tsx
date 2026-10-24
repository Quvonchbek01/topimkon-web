'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTelegramLink, unlinkTelegram } from '@/app/actions/telegram';

// Ixcham qator: ulash / tekshirish / uzish.
export function TelegramConnect({ linked }: { linked: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function connect() {
    setBusy(true);
    const res = await createTelegramLink();
    setBusy(false);
    if (!res.ok) return setMsg(res.error);
    // Telegram ilovasi ochiladi. Botda "Start" bosilgach, shu yerga qaytib "Tekshirish" bosiladi.
    window.location.assign(res.url);
  }

  async function unlink() {
    setBusy(true);
    await unlinkTelegram();
    setBusy(false);
    router.refresh();
  }

  return (
    <section className="card flex flex-wrap items-center justify-between gap-3 p-4" aria-label="Telegram">
      <div>
        <p className="text-sm font-bold">Telegram eslatmalari</p>
        <p className="text-xs text-muted">{linked ? 'Ulangan ✓' : 'Deadline eslatmalarini Telegramda oling'}</p>
      </div>
      <div className="flex gap-2">
        {linked ? (
          <button type="button" onClick={unlink} disabled={busy} className="btn-ghost !min-h-[40px] !px-4">Uzish</button>
        ) : (
          <>
            <button type="button" onClick={connect} disabled={busy} className="btn-primary !min-h-[40px] !px-4">Ulash</button>
            <button type="button" onClick={() => router.refresh()} className="btn-ghost !min-h-[40px] !px-4">Tekshirish</button>
          </>
        )}
      </div>
      {msg && <p className="w-full text-xs text-danger" role="alert">{msg}</p>}
    </section>
  );
}
