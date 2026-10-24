import { daysLeft } from '@/lib/deadline';

// Eslatma tanlash mantig‘i — sof funksiyalar (Vitest bilan tekshiriladi).
export interface ReminderRow {
  id: string;
  user_id: string;
  opportunity_id: string;
  days_before: number;
  deadline: string; // YYYY-MM-DD
}

export interface DueGroup {
  userId: string;
  opportunityId: string;
  days: number; // deadline'gacha haqiqatda necha kun qoldi
  ids: string[]; // shu guruhdagi yuborilgan deb belgilanadigan eslatmalar
}

/**
 * Bugun yuborilishi kerak bo‘lgan eslatmalar.
 * - Eslatma "N kun oldin" bo‘lsa: qolgan kun <= N bo‘lganda yuboriladi (kun o‘tkazib yuborilsa ham keyingi kuni ketadi).
 * - Muddati o‘tgan imkoniyatga yuborilmaydi.
 * - Bir foydalanuvchi + bir imkoniyat uchun bir nechta eslatma birdan "pishib qolsa", FAQAT BITTA xabar ketadi
 *   (hammasi "yuborildi" deb belgilanadi), shunda 3 ta bir xil xabar kelmaydi.
 */
export function pickDue(rows: ReminderRow[], today: string): DueGroup[] {
  const groups = new Map<string, DueGroup>();
  for (const r of rows) {
    const days = daysLeft(r.deadline, today);
    if (days === null || days < 0 || days > r.days_before) continue;
    const key = `${r.user_id}|${r.opportunity_id}`;
    const g = groups.get(key);
    if (g) g.ids.push(r.id);
    else groups.set(key, { userId: r.user_id, opportunityId: r.opportunity_id, days, ids: [r.id] });
  }
  return Array.from(groups.values());
}

export function dueText(days: number): string {
  if (days <= 0) return 'Bugun tugaydi';
  if (days === 1) return 'Ertaga tugaydi';
  return `${days} kun qoldi`;
}
