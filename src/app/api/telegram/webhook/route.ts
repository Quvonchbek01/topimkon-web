import { webhookCallback } from 'grammy';
import { createBot } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

type Handler = (req: Request) => Promise<Response>;
let handler: Handler | null = null;

// Telegram har so‘rovda "X-Telegram-Bot-Api-Secret-Token" sarlavhasini yuboradi.
// grammY uni TELEGRAM_WEBHOOK_SECRET bilan solishtiradi, mos kelmasa 401 qaytaradi.
export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!process.env.TELEGRAM_BOT_TOKEN || !secret) return new Response('Bot sozlanmagan', { status: 503 });
  handler ??= webhookCallback(createBot(), 'std/http', { secretToken: secret }) as Handler;
  return handler(req);
}
