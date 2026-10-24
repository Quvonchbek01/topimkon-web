'use server';

import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/reminder-token';
import { createAdminClient } from '@/lib/supabase/admin';

/** Email'dagi havoladan: shu imkoniyat uchun foydalanuvchining barcha eslatmalarini o‘chiradi. */
export async function cancelReminders(formData: FormData): Promise<void> {
  const token = String(formData.get('t') ?? '');
  const data = verifyToken(token);
  if (!data) redirect('/eslatma/bekor?xato=1');
  await createAdminClient()
    .from('reminders')
    .delete()
    .eq('user_id', data.userId)
    .eq('opportunity_id', data.opportunityId);
  redirect('/eslatma/bekor?done=1');
}
