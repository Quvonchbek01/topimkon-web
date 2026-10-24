import { z } from 'zod';

const httpUrl = z.string().trim().url('Rasmiy havola to‘g‘ri URL bo‘lishi kerak.').refine((v) => /^https?:\/\//i.test(v), 'Havola https:// bilan boshlanishi kerak.');
const csv = z.string().trim().max(1000).transform((v) => [...new Set(v.split(',').map((x) => x.trim()).filter(Boolean))]);

export const opportunityAdminSchema = z.object({
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug faqat kichik lotin harflari, raqam va defisdan iborat bo‘lsin.'),
  title: z.string().trim().min(3).max(180),
  org: z.string().trim().min(2).max(180),
  country: z.string().trim().min(2).max(100),
  type: z.enum(['scholarship','grant','internship','course','exchange','competition']),
  format: z.enum(['onsite','online','hybrid']),
  funding: z.enum(['full','partial','paid','none']),
  language: z.string().trim().min(2).max(12),
  level: z.enum(['none','A2','B1','B2','C1','C2']),
  fee: z.coerce.number().min(0).max(1000000),
  deadline: z.string().trim().transform((v) => v || null).refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Deadline YYYY-MM-DD formatida bo‘lsin.'),
  summary: z.string().trim().min(10).max(500),
  description: z.string().trim().max(12000),
  eligibility: z.string().trim().max(6000),
  how_to_apply: z.string().trim().max(6000),
  source_url: httpUrl,
  status: z.enum(['draft','published','archived']),
  featured: z.boolean(),
  for_uzbekistan: z.boolean(),
  is_sample: z.boolean(),
  fields: csv,
  degrees: csv.refine((items) => items.every((x) => ['bachelor', 'master', 'phd'].includes(x)), 'Daraja kodlari bachelor, master yoki phd bo‘lishi kerak.'),
  ru_title: z.string().trim().max(180),
  ru_summary: z.string().trim().max(500),
  ru_description: z.string().trim().max(12000),
  en_title: z.string().trim().max(180),
  en_summary: z.string().trim().max(500),
  en_description: z.string().trim().max(12000),
});

export type OpportunityAdminInput = z.infer<typeof opportunityAdminSchema>;
