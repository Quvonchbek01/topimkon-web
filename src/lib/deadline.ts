// Deadline hisoblash — sof funksiyalar (7-bosqichda Vitest bilan tekshiriladi).
const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];

export type Tone = 'open' | 'urgent' | 'soon' | 'normal' | 'expired';

/** Bugungi sana Toshkent vaqti bilan, "YYYY-MM-DD" ko‘rinishida. */
export function todayTashkent(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(now);
}

/** Deadline'gacha necha kun qoldi. null = doimiy qabul. Manfiy = muddati o‘tgan. */
export function daysLeft(deadline: string | null, today: string = todayTashkent()): number | null {
  if (!deadline) return null;
  const diff = Date.parse(`${deadline}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`);
  return Math.round(diff / 86_400_000);
}

/** 7 kundan kam — qizil, 30 kundan kam — amber. */
export function deadlineTone(days: number | null): Tone {
  if (days === null) return 'open';
  if (days < 0) return 'expired';
  if (days < 7) return 'urgent';
  if (days < 30) return 'soon';
  return 'normal';
}

export function deadlineLabel(days: number | null): string {
  if (days === null) return 'Doimiy qabul';
  if (days < 0) return 'Muddati o‘tgan';
  if (days === 0) return 'Bugun';
  if (days === 1) return 'Ertaga';
  return `${days} kun qoldi`;
}

/** "2027-02-20" → "20 fevral 2027" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1] ?? ''} ${y}`;
}
