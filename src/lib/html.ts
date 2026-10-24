// Telegram (HTML rejimi) va email uchun matnni xavfsiz qilish: < > & belgilari almashtiriladi.
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
