import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { CookieNotice } from '@/components/CookieNotice';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { Inter } from 'next/font/google';
import './globals.css';

// next/font shriftni build vaqtida yuklab, o‘z serveringizdan beradi (self-host).
const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'TopImkon — Imkoniyatlar to‘p. O‘zingnikini top.', template: '%s | TopImkon' },
  description:
    'O‘zbekistonlik talabalar va yoshlar uchun grant, stipendiya, stajirovka, kurs va konkurslarni bir joyda topish platformasi.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  applicationName: 'TopImkon',
  manifest: '/manifest.webmanifest',
  openGraph: { type: 'website', locale: 'uz_UZ', siteName: 'TopImkon', title: 'TopImkon — Imkoniyatlar to‘p. O‘zingnikini top.', description: 'Grant, stipendiya, stajirovka, kurs va konkurslar bir joyda.', images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'TopImkon', description: 'Imkoniyatlar to‘p. O‘zingnikini top.', images: ['/opengraph-image'] },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

// Sahifa chizilishidan oldin dark rejimni qo‘yadi (miltillashning oldini oladi).
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

// Header/Footer bu yerda EMAS: ular (site) guruhida. Kirish va onboarding (focus) guruhida,
// ya'ni menyusiz, diqqatni chalg‘itmaydigan toza sahifalar.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Script id="theme-init" strategy="beforeInteractive">{THEME_SCRIPT}</Script>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-card focus:p-3">
          Asosiy qismga o‘tish
        </a>
        {children}
        <CookieNotice />
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
