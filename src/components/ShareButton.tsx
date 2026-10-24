'use client';

import { useState } from 'react';

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // foydalanuvchi bekor qildi — jim o‘tamiz
    }
  }

  return (
    <button type="button" onClick={share} className="btn-ghost">
      {copied ? 'Havola nusxalandi ✓' : 'Ulashish'}
    </button>
  );
}
