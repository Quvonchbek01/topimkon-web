import 'server-only';
import { createClient } from '@supabase/supabase-js';

// DIQQAT: service_role RLS'ni chetlab o‘tadi. "server-only" import'i
// bu faylni brauzer kodiga qo‘shib yuborishni build vaqtida taqiqlaydi.
// Faqat cron, bot webhook va admin amallarida ishlatiladi.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
