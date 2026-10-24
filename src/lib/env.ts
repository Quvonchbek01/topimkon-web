import { z } from 'zod';

// Brauzerga chiqishi mumkin bo‘lgan (NEXT_PUBLIC_) o‘zgaruvchilar.
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
});

function raw() {
  return {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function hasPublicEnv(): boolean {
  return publicSchema.safeParse(raw()).success;
}

export function publicEnv() {
  return publicSchema.parse(raw());
}
