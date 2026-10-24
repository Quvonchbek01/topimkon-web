import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const fixedPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/imkoniyatlar`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/maxfiylik`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/shartlar`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const { data, error } = await createClient()
      .from('opportunities')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .limit(5000);
    if (error) throw error;
    const opportunityPages: MetadataRoute.Sitemap = (data ?? []).map((item) => ({
      url: `${baseUrl}/imkoniyatlar/${encodeURIComponent(item.slug)}`,
      lastModified: item.updated_at || item.created_at || undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    return [...fixedPages, ...opportunityPages];
  } catch {
    // Supabase vaqtincha ishlamasa ham sitemap statik sahifalarni qaytaradi.
    return fixedPages;
  }
}
