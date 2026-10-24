'use client';

import { useEffect, useState } from 'react';
import { deleteAccount } from '@/app/actions/profile';

// Sahifada faqat kichik havola; tasdiqlash ixcham oynada.
export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => { setText(''); setError(null); setOpen(true); }} className="text-sm text-muted underline hover:text-danger">
        Hisobni o‘chirish
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="del" onClick={(e) => e.stopPropagation()} className="sheet-in w-full max-w-sm rounded-t-xl bg-card p-5 sm:rounded-xl">
            <h2 id="del" className="text-base font-bold">Hisobni o‘chirasizmi?</h2>
            <p className="mt-1 text-sm text-muted">Profil, Meniki va eslatmalar butunlay o‘chadi. Qaytarib bo‘lmaydi.</p>
            <label htmlFor="confirm" className="sr-only">Tasdiqlash</label>
            <input id="confirm" className="input mt-4" value={text} onChange={(e) => setText(e.target.value)} placeholder="“o‘chirish” deb yozing" autoComplete="off" />
            {error && <p className="mt-2 text-sm text-danger" role="alert">{error}</p>}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-ghost flex-1">Bekor qilish</button>
              <button
                type="button"
                disabled={pending || text.trim() === ''}
                onClick={async () => {
                  setPending(true);
                  const res = await deleteAccount(text);
                  setPending(false);
                  if (res && !res.ok) setError(res.error);
                }}
                className="btn flex-1 bg-danger text-white disabled:opacity-50"
              >
                {pending ? 'O‘chirilmoqda...' : 'O‘chirish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
