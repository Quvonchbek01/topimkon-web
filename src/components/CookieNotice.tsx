'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'topimkon-cookie-notice-v1';

/** TopImkon hozir marketing cookie ishlatmaydi; bu xabar faqat zarur brauzer saqlashini tushuntiradi. */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== 'accepted');
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // Saqlash bloklangan bo‘lsa, xabar faqat joriy sahifada yopiladi.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      aria-label="Brauzer saqlashi haqida ma’lumot"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-line bg-card p-4 shadow-xl sm:inset-x-5 sm:flex sm:items-center sm:gap-5"
      role="region"
    >
      <p className="flex-1 text-sm text-muted">
        TopImkon mavzu rejimi va ushbu xabarning tanlovini eslab qolish uchun brauzer xotirasidan foydalanadi. Hozircha reklama yoki marketing cookie’lari ishlatilmaydi. Batafsil: <a className="font-bold text-brand-dark underline" href="/maxfiylik">maxfiylik siyosati</a>.
      </p>
      <button type="button" onClick={dismiss} className="btn-primary mt-3 w-full sm:mt-0 sm:w-auto">
        Tushunarli
      </button>
    </aside>
  );
}
