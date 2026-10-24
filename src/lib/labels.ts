// Soha va til nomlari (o‘zbekcha). Yangi soha qo‘shsangiz, shu yerga ham yozing.
export const FIELDS: Record<string, string> = {
  digital_economy: 'Raqamli iqtisodiyot',
  economics: 'Iqtisodiyot',
  business: 'Biznes',
  technology: 'Texnologiya',
  software: 'Dasturiy ta‘minot',
  research: 'Tadqiqot',
  leadership: 'Yetakchilik',
};

export const LANGUAGES: Record<string, string> = {
  en: 'Ingliz tili',
  uz: 'O‘zbek tili',
  ru: 'Rus tili',
  de: 'Nemis tili',
  tr: 'Turk tili',
  ko: 'Koreys tili',
  hu: 'Venger tili',
};

export const SORTS = {
  best: 'Eng mos',
  deadline: 'Deadline yaqin',
  new: 'Yangi qo‘shilgan',
} as const;

export function label(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
