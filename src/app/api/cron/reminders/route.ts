import { timingSafeEqual } from 'node:crypto';
import { runReminders } from '@/lib/reminders';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Vercel Cron CRON_SECRET o‘rnatilgan bo‘lsa "Authorization: Bearer <secret>" yuboradi.
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const got = Buffer.from(req.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret}`);
  return got.length === want.length && timingSafeEqual(got, want);
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response('Ruxsat yo‘q', { status: 401 });
  try {
    return Response.json({ ok: true, ...(await runReminders()) });
  } catch (e) {
    console.error('Eslatma cron xatosi:', e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
