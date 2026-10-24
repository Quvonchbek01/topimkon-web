import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/** Admin sahifasi va amallari uchun server-side vakolat tekshiruvi. */
export async function requireAdmin() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/kirish?next=%2Fadmin');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || profile?.is_admin !== true) redirect('/');
  return { userId: user.id };
}
