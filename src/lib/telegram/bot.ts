import 'server-only';
import { Bot } from 'grammy';
import { registerHandlers } from '@/lib/telegram/handlers';

export function createBot(): Bot {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN o‘rnatilmagan');
  const bot = new Bot(token);
  registerHandlers(bot);
  // Xato bo‘lsa webhook 500 qaytarmasin (Telegram bir xil xabarni qayta-qayta yuboradi).
  bot.catch((err) => console.error('Bot xatosi:', err.message));
  return bot;
}
