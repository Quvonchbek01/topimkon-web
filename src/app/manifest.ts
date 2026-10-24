import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TopImkon — imkoniyatlarni toping',
    short_name: 'TopImkon',
    description: 'Grant, stipendiya, stajirovka, kurs va tanlovlar bir joyda.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f9fb',
    theme_color: '#10233f',
    lang: 'uz',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
