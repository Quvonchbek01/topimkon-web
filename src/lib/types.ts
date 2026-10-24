// Bazadagi qiymatlar kodlar bilan saqlanadi; o‘zbekcha nomlari shu yerda.
// Yangi tur/soha qo‘shmoqchi bo‘lsangiz: schema.sql'dagi CHECK va shu fayl.

export const OPPORTUNITY_TYPES = {
  scholarship: 'Stipendiya',
  grant: 'Grant',
  internship: 'Stajirovka',
  course: 'Kurs',
  exchange: 'Almashinuv',
  competition: 'Konkurs',
} as const;

export const FORMATS = { onsite: 'Joyida', online: 'Onlayn', hybrid: 'Aralash' } as const;

export const FUNDING = {
  full: 'To‘liq moliyalashtirilgan',
  partial: 'Qisman moliyalashtirilgan',
  paid: 'Haq to‘lanadi',
  none: 'Moliyalashtirilmaydi',
} as const;

export const DEGREES = { bachelor: 'Bakalavr', master: 'Magistratura', phd: 'PhD' } as const;

export const LEVELS = ['none', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type OpportunityType = keyof typeof OPPORTUNITY_TYPES;
export type Format = keyof typeof FORMATS;
export type Funding = keyof typeof FUNDING;
export type Degree = keyof typeof DEGREES;
export type Status = 'draft' | 'published' | 'archived';

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  org: string;
  country: string;
  type: OpportunityType;
  format: Format;
  funding: Funding;
  language: string;
  level: (typeof LEVELS)[number];
  fee: number;
  deadline: string | null; // null = doimiy qabul
  summary: string;
  description: string;
  eligibility: string;
  how_to_apply: string;
  source_url: string;
  last_verified_at: string | null;
  featured: boolean;
  for_uzbekistan: boolean;
  is_sample: boolean;
  status: Status;
  views: number;
  created_at: string;
  updated_at: string;
}

// Foydalanuvchi profili (profiles jadvali). degree_level null = onboarding tugallanmagan.
export interface Profile {
  full_name: string;
  degree_level: Degree | null;
  field_interests: string[];
  languages: string[];
  preferred_types: string[];
}
