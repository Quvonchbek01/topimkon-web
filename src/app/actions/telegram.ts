'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type LinkResult = { ok: true; url: string } | { ok: false; error: string };

/** Bir martalik kod yaratadi (10 daqiqa) va botga olib boruvchi havolani qaytaradi. */
export async function createTelegramLink(): Promise<LinkResult> {
  const username = process.env.TELEGRAM_BOT_USERNAME;
  if (!username || !process.env.TELEGRAM_BOT_TOKEN) return { ok: false, error: 'Telegram bot hali sozlanmagan' };

  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) return { ok: false, error: 'Avval tizimga kiring' };

  const admin = createAdminClient();
  await admin.from('telegram_link_codes').delete().eq('user_id', user.id); // eski kodlar
  const code = randomBytes(24).toString('base64url'); // 32 belgi, faqat A-Z a-z 0-9 _ -
  const { error } = await admin.from('telegram_link_codes').insert({
    code,
    user_id: user.id,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  if (error) return { ok: false, error: 'Havola yaratib bo‘lmadi. Qayta urinib ko‘ring.' };
  return { ok: true, url: `https://t.me/${username}?start=${code}` };
}

export async function unlinkTelegram(): Promise<{ ok: boolean }> {
  const {
    data: { user },
  } = await createClient().auth.getUser();
  if (!user) return { ok: false };
  const { error } = await createAdminClient().from('profiles').update({ telegram_chat_id: null }).eq('user_id', user.id);
  revalidatePath('/profil');
  return { ok: !error };
}
