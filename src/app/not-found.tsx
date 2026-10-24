import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-6xl font-extrabold text-brand-dark">404</p>
        <h1 className="mt-3 text-2xl font-extrabold">Sahifa topilmadi</h1>
        <p className="mt-2 text-muted">Bunday sahifa yo‘q yoki imkoniyat olib tashlangan bo‘lishi mumkin.</p>
        <Link href="/imkoniyatlar" className="btn-primary mt-6">Imkoniyatlarga qaytish</Link>
      </main>
      <Footer />
    </>
  );
}
