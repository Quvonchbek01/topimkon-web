import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm font-extrabold uppercase tracking-widest text-brand-dark">TopImkon</p>
      <h1 className="mt-3 text-3xl font-extrabold">Internet bilan aloqa yo‘q</h1>
      <p className="mt-3 text-muted">Ushbu sahifa internet bo‘lmaganda ko‘rsatiladi. Saqlangan ma’lumotlar va yangi imkoniyatlarni ko‘rish uchun qayta ulaning.</p>
      <Link href="/" className="btn-primary mt-6">Qayta urinish</Link>
    </main>
  );
}
