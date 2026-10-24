'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { profileSchema } from '@/lib/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type Result = { ok: true } | { ok: false; error: string };

/** Profilni saqlaydi. Validatsiya SERVERDA ham qilinadi (forma yetarli himoya emas). */
export async function saveProfile(input: unknown): Promise<Result> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Ma‘lumot noto‘g‘ri' };

  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false, error: 'Avval tizimga kiring' };

  // Profil qatori ro‘yxatdan o‘tganda avtomatik yaratiladi (schema.sql triggeri).
  const upd = await sb.from('profiles').update(parsed.data).eq('user_id', user.id).select('user_id');
  if (upd.error) return { ok: false, error: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.' };
  if (!upd.data || upd.data.length === 0) {
    const ins = await sb.from('profiles').insert({ user_id: user.id, ...parsed.data });
    if (ins.error) return { ok: false, error: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.' };
  }
  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Hisobni butunlay o‘chiradi (profil, Meniki, eslatmalar CASCADE bilan ketadi). */
export async function deleteAccount(confirmText: string): Promise<Result> {
  // "o‘chirish" yozuvi: apostrof turlaridan qat'i nazar qabul qilinadi.
  if (confirmText.trim().toLowerCase().replace(/[^a-z]/g, '') !== 'ochirish') {
    return { ok: false, error: 'Tasdiqlash uchun "o‘chirish" deb yozing' };
  }
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false, error: 'Avval tizimga kiring' };

  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) return { ok: false, error: 'Hisobni o‘chirib bo‘lmadi. Keyinroq urinib ko‘ring.' };
  await sb.auth.signOut();
  redirect('/');
}
