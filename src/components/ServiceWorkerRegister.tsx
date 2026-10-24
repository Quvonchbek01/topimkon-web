'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA qo‘shimcha qulaylik: ro‘yxatdan o‘tmasa, asosiy sayt baribir ishlaydi.
    });
  }, []);
  return null;
}
