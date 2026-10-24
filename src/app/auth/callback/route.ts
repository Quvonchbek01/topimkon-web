import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Magic link yoki Google'dan qaytgach: kodni sessiyaga almashtiradi.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextRaw = searchParams.get('next') ?? '/';
  // Ochiq redirect'dan himoya: faqat shu saytdagi yo‘l ("/..."), "//evil.com" emas.
  const next = nextRaw.startsWith('/') && !nextRaw.startsWith('//') ? nextRaw : '/';

  if (code) {
    const sb = createClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (user) {
        const { data: p } = await sb.from('profiles').select('degree_level').eq('user_id', user.id).maybeSingle();
        if (!p?.degree_level) return NextResponse.redirect(`${origin}/onboarding`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/kirish?xato=1`);
}
