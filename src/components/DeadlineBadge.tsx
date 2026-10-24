import { daysLeft, deadlineLabel, deadlineTone, formatDate } from '@/lib/deadline';

const TONE = {
  urgent: 'text-danger',
  soon: 'text-amber',
  normal: 'text-ink',
  open: 'text-brand-dark',
  expired: 'text-muted',
} as const;

export function DeadlineBadge({ deadline, showDate = true }: { deadline: string | null; showDate?: boolean }) {
  const days = daysLeft(deadline);
  return (
    <span className={`text-xs font-bold ${TONE[deadlineTone(days)]}`}>
      {deadlineLabel(days)}
      {showDate && deadline ? ` · ${formatDate(deadline)}` : ''}
    </span>
  );
}
