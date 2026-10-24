'use client';

import { useState } from 'react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const emailSchema = z.string().trim().email('Email manzilni to‘g‘ri kiriting');

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'sent' | 'error'; text?: string }>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function magic(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setState({ kind: 'error', text: parsed.error.issues[0]?.message });
    setBusy(true);
    const { error } = await createClient().auth.signInWithOtp({
      email: parsed.data,
      options: { emailRedirectTo: redirectTo() },
    });
    setBusy(false);
    setState(error ? { kind: 'error', text: 'Xat yuborib bo‘lmadi. Birozdan keyin qayta urinib ko‘ring.' } : { kind: 'sent' });
  }

  async function google() {
    const { error } = await createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } });
    if (error) setState({ kind: 'error', text: 'Google orqali kirib bo‘lmadi.' });
  }

  if (state.kind === 'sent') {
    return (
      <div className="rounded-xl border border-brand/50 bg-brand-soft p-5 text-brand-dark" role="status">
        <p className="font-bold">Xat yuborildi ✓</p>
        <p className="mt-1 text-sm">{email} manziliga kirish havolasi jo‘natildi. Havolani shu brauzerda oching.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={magic} className="space-y-3" noValidate>
        <label htmlFor="email" className="block text-sm font-bold">Email</label>
        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ism@gmail.com" autoComplete="email" required />
        <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Yuborilmoqda...' : 'Email orqali kirish havolasi'}</button>
      </form>
      <p className="text-center text-xs text-muted">yoki</p>
      <button type="button" onClick={google} className="btn-ghost w-full">Google orqali kirish</button>
      {state.kind === 'error' && <p className="text-sm text-danger" role="alert">{state.text}</p>}
    </div>
  );
}
