import { z } from 'zod';
import { OPPORTUNITY_TYPES } from './types';
import { FIELDS, LANGUAGES } from './labels';

const keys = (o: object) => Object.keys(o) as [string, ...string[]];

// Profil validatsiyasi: formada ham, serverda ham (actions/profile.ts) shu sxema ishlatiladi.
export const profileSchema = z.object({
  full_name: z.string().trim().max(80, 'Ism 80 belgidan oshmasin'),
  degree_level: z.enum(['bachelor', 'master', 'phd'], {
    errorMap: () => ({ message: 'Darajani tanlang' }),
  }),
  field_interests: z.array(z.enum(keys(FIELDS))).max(10),
  preferred_types: z.array(z.enum(keys(OPPORTUNITY_TYPES))).max(10),
  languages: z.array(z.enum(keys(LANGUAGES))).max(10),
});

export type ProfileInput = z.infer<typeof profileSchema>;
