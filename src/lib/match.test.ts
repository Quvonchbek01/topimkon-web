import { describe, expect, it } from 'vitest';
import { computeMatch, type MatchProfile, type MatchTarget } from './match';

const profile: MatchProfile = {
  degree_level: 'bachelor',
  field_interests: ['business'],
  languages: ['en'],
  preferred_types: ['scholarship'],
};

const target: MatchTarget = {
  degrees: ['bachelor', 'master'],
  fields: ['business', 'economics'],
  type: 'scholarship',
  language: 'en',
  level: 'B2',
  funding: 'full',
};

describe('computeMatch', () => {
  it('hammasi mos kelsa 100%', () => {
    expect(computeMatch(profile, target)).toEqual({ score: 100, reason: 'Daraja, soha, tur va til mos' });
  });

  it('daraja mos kelmasa 30 ball yo‘qoladi va sabab aytiladi', () => {
    const m = computeMatch(profile, { ...target, degrees: ['master'] });
    expect(m?.score).toBe(70);
    expect(m?.reason).toBe('Soha, tur va til mos, daraja mos emas');
  });

  it('til mos kelmasa va talab yuqori bo‘lsa shuni aytadi', () => {
    const m = computeMatch(profile, { ...target, language: 'de', level: 'C1' });
    expect(m?.score).toBe(85);
    expect(m?.reason).toBe('Daraja, soha va tur mos, til talabi yuqori');
  });

  it('hech narsa mos kelmasa faqat moliyalashtirish ball beradi', () => {
    const m = computeMatch(profile, {
      degrees: ['phd'], fields: ['technology'], type: 'course', language: 'de', level: 'B2', funding: 'none',
    });
    expect(m?.score).toBe(2);
  });

  it('profilda ma‘lumot bo‘lmagan bo‘limlar hisobga olinmaydi (qayta normallashtiriladi)', () => {
    const m = computeMatch({ ...profile, field_interests: [], languages: [], preferred_types: [] }, target);
    expect(m?.score).toBe(100);
  });

  it('profil bo‘sh bo‘lsa null qaytaradi', () => {
    const empty: MatchProfile = { degree_level: null, field_interests: [], languages: [], preferred_types: [] };
    expect(computeMatch(empty, target)).toBeNull();
  });

  it('imkoniyatda soha/daraja cheklovi bo‘lmasa mos hisoblanadi', () => {
    const m = computeMatch(profile, { ...target, degrees: [], fields: [] });
    expect(m?.score).toBe(100);
  });
});
