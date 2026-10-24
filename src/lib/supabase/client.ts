import { createBrowserClient } from '@supabase/ssr';

// Brauzer uchun: faqat anon kalit. RLS ma'lumotlarni himoya qiladi.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
