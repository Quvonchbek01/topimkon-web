import 'server-only';

// Cron eslatma yuborishi uchun oddiy fetch (grammY'ni ishga tushirish shart emas).
export async function sendTelegram(chatId: number | string, html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
