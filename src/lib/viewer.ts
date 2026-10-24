import 'server-only';
import { cache } from 'react';
import { hasPublicEnv } from '@/lib/env';
import { computeMatch, type MatchTarget } from '@/lib/match';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

export interface Viewer {
  userId: string;
  email: string | null;
  profile: Profile | null;
  saved: Set<string>; // saqlangan imkoniyat id'lari
}

// Joriy foydalanuvchi (yoki null = mehmon). cache() — bir so‘rovda bir marta so‘raydi.
export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!hasPublicEnv()) return null;
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const [p, s] = await Promise.all([
    sb.from('profiles').select('full_name, degree_level, field_interests, languages, preferred_types').eq('user_id', user.id).maybeSingle(),
    sb.from('saved_opportunities').select('opportunity_id').eq('user_id', user.id),
  ]);
  return {
    userId: user.id,
    email: user.email ?? null,
    profile: (p.data as Profile | null) ?? null,
    saved: new Set(((s.data ?? []) as { opportunity_id: string }[]).map((r) => r.opportunity_id)),
  };
});

/** Karta uchun qo‘shimcha ma‘lumotlar: kirgan-kirmagani, saqlanganligi, moslik. */
export function cardExtras(viewer: Viewer | null, item: MatchTarget & { id: string }) {
  return {
    loggedIn: viewer !== null,
    saved: viewer?.saved.has(item.id) ?? false,
    match: viewer?.profile ? computeMatch(viewer.profile, item) : null,
  };
}
