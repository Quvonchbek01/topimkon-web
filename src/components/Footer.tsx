import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-tint">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            Top<span className="text-brand-dark">Imkon</span>
          </p>
          <p className="mt-2 text-sm text-muted">Imkoniyatlar to‘p. O‘zingnikini top.</p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-bold text-ink">Ishonch qoidalarimiz</p>
          <p className="mt-2">
            Har imkoniyatda rasmiy manba havolasi va oxirgi tekshirilgan sana ko‘rsatiladi. Muddati
            o‘tgan yozuvlar aniq belgilanadi. Reklama yo‘q.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold">Sahifalar</p>
          <ul className="mt-2 space-y-1 text-muted">
            <li><Link href="/" className="hover:text-brand-dark">Bosh sahifa</Link></li>
            <li><Link href="/imkoniyatlar" className="hover:text-brand-dark">Barcha imkoniyatlar</Link></li>
            <li><Link href="/maxfiylik" className="hover:text-brand-dark">Maxfiylik siyosati</Link></li>
            <li><Link href="/shartlar" className="hover:text-brand-dark">Foydalanish shartlari</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} TopImkon. Ariza topshirishdan oldin shartlarni rasmiy saytda tekshiring.
      </p>
    </footer>
  );
}
