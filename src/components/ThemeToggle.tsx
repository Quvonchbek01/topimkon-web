'use client';

import { useEffect, useState } from 'react';

// Dark mode: tizim sozlamasi bo‘yicha boshlanadi, tugma bilan qo‘lda almashtiriladi.
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // brauzer saqlashni taqiqlagan bo‘lsa — e‘tibor bermaymiz
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-ghost !min-h-[40px] !px-3"
      aria-label={dark ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish'}
    >
      <span aria-hidden>{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}
