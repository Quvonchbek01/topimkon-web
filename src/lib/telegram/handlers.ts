import 'server-only';
import type { Bot, Context } from 'grammy';
import { daysLeft, deadlineLabel, formatDate, todayTashkent } from '@/lib/deadline';
import { escapeHtml } from '@/lib/html';
import { createAdminClient } from '@/lib/supabase/admin';

const base = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const notExpired = () => `deadline.is.null,deadline.gte.${todayTashkent()}`;

interface Item {
  slug: string;
  title: string;
  deadline: string | null;
}

const WELCOME =
  '👋 <b>TopImkon</b> botiga xush kelibsiz!\n\n' +
  'Deadline eslatmalarini olish uchun saytda <b>Profil → Telegramni ulash</b> tugmasini bosing.\n\n' +
  'Buyruqlar:\n/yangi — oxirgi 5 ta imkoniyat\n/deadline — eng yaqin 5 ta deadline\n' +
  '/meniki — Meniki’dagilar\n/uzish — hisobni uzish';

function renderList(items: Item[]): string {
  return items
    .map((o, i) => {
      const when = o.deadline ? `${deadlineLabel(daysLeft(o.deadline))} · ${formatDate(o.deadline)}` : 'Doimiy qabul';
      return `${i + 1}. <a href="${base()}/imkoniyatlar/${o.slug}">${escapeHtml(o.title)}</a>\n    ${escapeHtml(when)}`;
    })
    .join('\n\n');
}

const say = (ctx: Context, html: string) =>
  ctx.reply(html, { parse_mode: 'HTML', link_preview_options: { is_disabled: true } });

/** /start <kod>: bir martalik kod orqali Telegram'ni hisobga bog‘laydi. */
async function linkAccount(ctx: Context, code: string) {
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(code)) return say(ctx, 'Havola noto‘g‘ri. Saytdagi “Telegramni ulash” tugmasidan foydalaning.');

  const sb = createAdminClient();
  const now = new Date().toISOString();
  // Bitta so‘rovda: kod ishlatilmagan va muddati o‘tmagan bo‘lsagina "ishlatildi" deb belgilanadi (qayta ishlatib bo‘lmaydi).
  const { data } = await sb
    .from('telegram_link_codes')
    .update({ used_at: now })
    .eq('code', code)
    .is('used_at', null)
    .gt('expires_at', now)
    .select('user_id');
  const userId = (data as { user_id: string }[] | null)?.[0]?.user_id;
  if (!userId) return say(ctx, 'Kod eskirgan yoki ishlatilgan. Saytda yangi havola oling (10 daqiqa amal qiladi).');

  // Bu chat boshqa hisobga bog‘langan bo‘lsa, avval uziladi (bir chat — bitta hisob).
  await sb.from('profiles').update({ telegram_chat_id: null }).eq('telegram_chat_id', chatId).neq('user_id', userId);
  const { error } = await sb.from('profiles').update({ telegram_chat_id: chatId }).eq('user_id', userId);
  if (error) return say(ctx, 'Ulab bo‘lmadi. Birozdan keyin qayta urinib ko‘ring.');
  return say(ctx, '✅ Hisobingiz ulandi. Endi saqlagan imkoniyatlaringiz deadline’i yaqinlashganda shu yerga eslatma keladi.');
}

async function userOfChat(ctx: Context): Promise<string | null> {
  const chatId = ctx.chat?.id;
  if (!chatId) return null;
  const { data } = await createAdminClient().from('profiles').select('user_id').eq('telegram_chat_id', chatId).maybeSingle();
  return (data as { user_id: string } | null)?.user_id ?? null;
}

export function registerHandlers(bot: Bot) {
  // Faqat shaxsiy chatlar (guruhlarda jim turadi)
  bot.use(async (ctx, next) => {
    if (ctx.chat?.type !== 'private') return;
    await next();
  });

  bot.command('start', async (ctx) => {
    const code = typeof ctx.match === 'string' ? ctx.match.trim() : '';
    if (!code) return say(ctx, WELCOME);
    return linkAccount(ctx, code);
  });

  bot.command('yangi', async (ctx) => {
    const { data } = await createAdminClient()
      .from('opportunities').select('slug, title, deadline').eq('status', 'published')
      .or(notExpired()).order('created_at', { ascending: false }).limit(5);
    const items = (data ?? []) as Item[];
    return say(ctx, items.length ? `🆕 <b>Oxirgi imkoniyatlar</b>\n\n${renderList(items)}` : 'Hozircha imkoniyat yo‘q.');
  });

  bot.command('deadline', async (ctx) => {
    const { data } = await createAdminClient()
      .from('opportunities').select('slug, title, deadline').eq('status', 'published')
      .gte('deadline', todayTashkent()).order('deadline', { ascending: true }).limit(5);
    const items = (data ?? []) as Item[];
    return say(ctx, items.length ? `⏰ <b>Eng yaqin deadline’lar</b>\n\n${renderList(items)}` : 'Yaqin deadline yo‘q.');
  });

  bot.command(['meniki', 'saqlanganlar'], async (ctx) => {
    const userId = await userOfChat(ctx);
    if (!userId) return say(ctx, 'Avval hisobni ulang: saytda Profil → Telegramni ulash.');
    const { data } = await createAdminClient()
      .from('saved_opportunities').select('opportunities(slug, title, deadline, status)').eq('user_id', userId);
    const today = todayTashkent();
    const items = ((data ?? []) as unknown as { opportunities: (Item & { status: string }) | null }[])
      .map((r) => r.opportunities)
      .filter((o): o is Item & { status: string } => !!o && o.status === 'published' && (!o.deadline || o.deadline >= today))
      .sort((a, b) => (a.deadline ?? '9999').localeCompare(b.deadline ?? '9999'))
      .slice(0, 10);
    return say(ctx, items.length ? `🛍 <b>Meniki</b>\n\n${renderList(items)}` : 'Meniki’da (muddati o‘tmagan) imkoniyat yo‘q.');
  });

  bot.command('uzish', async (ctx) => {
    const userId = await userOfChat(ctx);
    if (!userId) return say(ctx, 'Bu chat hech qaysi hisobga ulanmagan.');
    await createAdminClient().from('profiles').update({ telegram_chat_id: null }).eq('user_id', userId);
    return say(ctx, 'Hisob uzildi. Eslatmalar endi Telegramga kelmaydi.');
  });

  bot.on('message', (ctx) => say(ctx, WELCOME));
}
