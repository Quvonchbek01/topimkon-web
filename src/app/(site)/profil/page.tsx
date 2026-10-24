import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DeleteAccount } from '@/components/DeleteAccount';
import { ProfileForm } from '@/components/ProfileForm';
import { TelegramConnect } from '@/components/TelegramConnect';
import { createClient } from '@/lib/supabase/server';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = { title: 'Profil' };
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/kirish?next=/profil');
  const p = viewer.profile;
  const { data: tg } = await createClient().from('profiles').select('telegram_chat_id').eq('user_id', viewer.userId).maybeSingle();
  const linked = !!(tg as { telegram_chat_id: number | null } | null)?.telegram_chat_id;
  return (
    <div className="mx-auto max-w-xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-extrabold">Profil</h1>
        <p className="mt-1 text-sm text-muted">{viewer.email}</p>
      </div>
      <ProfileForm
        defaults={{
          full_name: p?.full_name ?? '',
          degree_level: p?.degree_level ?? undefined,
          field_interests: p?.field_interests ?? [],
          preferred_types: p?.preferred_types ?? [],
          languages: p?.languages ?? [],
        }}
      />
      <TelegramConnect linked={linked} />
      <div className="flex items-center gap-5 border-t border-line pt-5">
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm font-semibold underline">Chiqish</button>
        </form>
        <DeleteAccount />
      </div>
    </div>
  );
}
