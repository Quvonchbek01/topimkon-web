import 'server-only';
import { Resend } from 'resend';
import { formatDate } from '@/lib/deadline';
import { escapeHtml } from '@/lib/html';
import { dueText } from '@/lib/reminder-logic';

export function emailConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && process.env.EMAIL_FROM && process.env.REMINDER_SECRET);
}

export function reminderEmail(p: { title: string; days: number; deadline: string; url: string; cancelUrl: string }) {
  const when = dueText(p.days);
  const title = escapeHtml(p.title);
  const subject = `Deadline yaqin: ${p.title} — ${when.toLowerCase()}`;
  const text =
    `${p.title}\n${when}. Oxirgi muddat: ${formatDate(p.deadline)}.\n\nBatafsil: ${p.url}\n\n` +
    `Bu eslatmani olishni xohlamasangiz: ${p.cancelUrl}`;
  const html = `<!doctype html><html lang="uz"><body style="margin:0;background:#fbf8ef;font-family:Arial,sans-serif;color:#1b3a2d">
<div style="max-width:520px;margin:0 auto;padding:24px">
  <p style="font-size:20px;font-weight:800;margin:0 0 16px">Top<span style="color:#12804f">Imkon</span></p>
  <div style="background:#fffefa;border:1px solid #e9e4d3;border-radius:14px;padding:20px">
    <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#c98200">⏰ ${escapeHtml(when)}</p>
    <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3">${title}</h1>
    <p style="margin:0 0 18px;color:#5f7065">Oxirgi muddat: ${escapeHtml(formatDate(p.deadline))}</p>
    <a href="${escapeHtml(p.url)}" style="display:inline-block;background:#5fcf93;color:#1b3a2d;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:12px">Batafsil ko‘rish</a>
  </div>
  <p style="font-size:12px;color:#5f7065;margin-top:16px">Bu xat siz saqlagan imkoniyat uchun yuborildi.
  <a href="${escapeHtml(p.cancelUrl)}" style="color:#5f7065">Eslatmani bekor qilish</a></p>
</div></body></html>`;
  return { subject, html, text };
}

export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
      text,
    });
    return !error;
  } catch {
    return false;
  }
}
