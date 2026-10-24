import 'server-only';
import { todayTashkent, formatDate } from '@/lib/deadline';
import { emailConfigured, reminderEmail, sendEmail } from '@/lib/email';
import { escapeHtml } from '@/lib/html';
import { dueText, pickDue, type ReminderRow } from '@/lib/reminder-logic';
import { signToken } from '@/lib/reminder-token';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegram } from '@/lib/telegram/send';

interface DbRow {
  id: string;
  user_id: string;
  opportunity_id: string;
  days_before: number;
  opportunities: { slug: string; title: string; deadline: string | null; status: string };
}

export interface RunResult {
  checked: number;
  groups: number;
  sentTelegram: number;
  sentEmail: number;
  failed: number;
}

/** Kunlik cron: yuborilmagan, muddati kelgan eslatmalarni yuboradi. Takrorlanishdan sent_at himoya qiladi. */
export async function runReminders(): Promise<RunResult> {
  const sb = createAdminClient();
  const today = todayTashkent();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const { data, error } = await sb
    .from('reminders')
    .select('id, user_id, opportunity_id, days_before, opportunities!inner(slug, title, deadline, status)')
    .is('sent_at', null)
    .eq('opportunities.status', 'published')
    .gte('opportunities.deadline', today)
    .limit(1000);
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as DbRow[];
  const info = new Map(rows.map((r) => [r.opportunity_id, r.opportunities]));
  const flat: ReminderRow[] = rows
    .filter((r) => r.opportunities.deadline)
    .map((r) => ({
      id: r.id,
      user_id: r.user_id,
      opportunity_id: r.opportunity_id,
      days_before: r.days_before,
      deadline: r.opportunities.deadline as string,
    }));

  const groups = pickDue(flat, today);
  const result: RunResult = { checked: rows.length, groups: groups.length, sentTelegram: 0, sentEmail: 0, failed: 0 };
  if (groups.length === 0) return result;

  const userIds = Array.from(new Set(groups.map((g) => g.userId)));
  const { data: profs } = await sb.from('profiles').select('user_id, telegram_chat_id').in('user_id', userIds);
  const chatOf = new Map(
    ((profs ?? []) as { user_id: string; telegram_chat_id: number | null }[]).map((p) => [p.user_id, p.telegram_chat_id]),
  );
  const emailOf = new Map<string, string | null>();

  for (const g of groups) {
    const opp = info.get(g.opportunityId);
    if (!opp || !opp.deadline) continue;
    const url = `${base}/imkoniyatlar/${opp.slug}`;
    let ok = false;

    const chat = chatOf.get(g.userId);
    if (chat) {
      const text =
        `⏰ <b>${escapeHtml(dueText(g.days))}</b>\n<b>${escapeHtml(opp.title)}</b>\n` +
        `Oxirgi muddat: ${escapeHtml(formatDate(opp.deadline))}\n<a href="${url}">Batafsil ko‘rish</a>`;
      if (await sendTelegram(chat, text)) {
        ok = true;
        result.sentTelegram++;
      }
    }

    if (emailConfigured()) {
      if (!emailOf.has(g.userId)) {
        const { data: u } = await sb.auth.admin.getUserById(g.userId);
        emailOf.set(g.userId, u.user?.email ?? null);
      }
      const to = emailOf.get(g.userId);
      if (to) {
        const cancelUrl = `${base}/eslatma/bekor?t=${signToken(g.userId, g.opportunityId)}`;
        const mail = reminderEmail({ title: opp.title, days: g.days, deadline: opp.deadline, url, cancelUrl });
        if (await sendEmail(to, mail.subject, mail.html, mail.text)) {
          ok = true;
          result.sentEmail++;
        }
      }
    }

    if (ok) {
      await sb.from('reminders').update({ sent_at: new Date().toISOString() }).in('id', g.ids);
    } else {
      result.failed++; // sent_at qo‘yilmaydi — ertaga qayta uriniladi
    }
  }
  return result;
}
