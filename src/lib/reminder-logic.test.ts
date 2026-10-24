import { describe, expect, it } from 'vitest';
import { dueText, pickDue, type ReminderRow } from './reminder-logic';

const row = (id: string, days_before: number, deadline: string, user = 'u1', opp = 'o1'): ReminderRow => ({
  id, user_id: user, opportunity_id: opp, days_before, deadline,
});

describe('pickDue', () => {
  it('hali erta bo‘lsa yubormaydi', () => {
    expect(pickDue([row('a', 7, '2026-11-20')], '2026-11-01')).toEqual([]);
  });

  it('aynan N kun qolganda yuboradi', () => {
    const r = pickDue([row('a', 7, '2026-11-08')], '2026-11-01');
    expect(r).toEqual([{ userId: 'u1', opportunityId: 'o1', days: 7, ids: ['a'] }]);
  });

  it('kun o‘tkazib yuborilgan bo‘lsa ham keyingi kuni yuboradi', () => {
    const r = pickDue([row('a', 7, '2026-11-08')], '2026-11-03');
    expect(r[0]?.days).toBe(5);
  });

  it('muddati o‘tgan imkoniyatga yubormaydi', () => {
    expect(pickDue([row('a', 1, '2026-10-30')], '2026-11-01')).toEqual([]);
  });

  it('deadline kunining o‘zida ham yuboradi (0 kun qoldi)', () => {
    expect(pickDue([row('a', 1, '2026-11-01')], '2026-11-01')[0]?.days).toBe(0);
  });

  it('bir imkoniyat uchun bir nechta eslatma pishsa — bitta xabar, hammasi belgilanadi', () => {
    const r = pickDue([row('a', 14, '2026-11-03'), row('b', 7, '2026-11-03'), row('c', 3, '2026-11-03')], '2026-11-01');
    expect(r).toHaveLength(1);
    expect(r[0]?.ids).toEqual(['a', 'b', 'c']);
  });

  it('turli foydalanuvchilar alohida guruh bo‘ladi', () => {
    const r = pickDue([row('a', 3, '2026-11-03', 'u1'), row('b', 3, '2026-11-03', 'u2')], '2026-11-01');
    expect(r).toHaveLength(2);
  });
});

describe('dueText', () => {
  it('matnlar', () => {
    expect(dueText(0)).toBe('Bugun tugaydi');
    expect(dueText(1)).toBe('Ertaga tugaydi');
    expect(dueText(5)).toBe('5 kun qoldi');
  });
});
