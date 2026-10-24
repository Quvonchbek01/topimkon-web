import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Email'dagi "eslatmalarni bekor qilish" havolasi uchun imzolangan token.
// Token ichida: foydalanuvchi + imkoniyat. Soxtalashtirib bo‘lmaydi (HMAC, REMINDER_SECRET bilan).
const secret = () => process.env.REMINDER_SECRET ?? '';

export function signToken(userId: string, opportunityId: string): string {
  const payload = Buffer.from(`${userId}.${opportunityId}`).toString('base64url');
  const sig = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): { userId: string; opportunityId: string } | null {
  if (!secret()) return null;
  const [payload, sig, extra] = token.split('.');
  if (!payload || !sig || extra !== undefined) return null;
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const [userId, opportunityId] = Buffer.from(payload, 'base64url').toString().split('.');
  return userId && opportunityId ? { userId, opportunityId } : null;
}
