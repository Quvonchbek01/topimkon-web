import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getViewer } from '@/lib/viewer';

export async function Header() {
  const viewer = await getViewer();
  const count = viewer?.saved.size ?? 0;
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Top<span className="text-brand-dark">Imkon</span>
        </Link>
        <nav className="flex items-center gap-2" aria-label="Asosiy menyu">
          <Link href="/imkoniyatlar" className="btn-ghost hidden !min-h-[40px] !px-4 sm:inline-flex">Imkoniyatlar</Link>
          {viewer ? (
            <>
              <Link href="/meniki" className="btn-ghost !min-h-[40px] !px-3">
                <span aria-hidden>🛍</span> Meniki
                {count > 0 && <span className="rounded-full bg-brand px-1.5 text-xs font-extrabold text-ink">{count}</span>}
              </Link>
              <Link href="/profil" className="btn-ghost !min-h-[40px] !px-3" aria-label="Profil">
                <span aria-hidden>👤</span><span className="hidden sm:inline"> Profil</span>
              </Link>
              <form action="/auth/signout" method="post" className="hidden sm:block">
                <button type="submit" className="btn-ghost !min-h-[40px] !px-3">Chiqish</button>
              </form>
            </>
          ) : (
            <Link href="/kirish" className="btn-primary !min-h-[40px] !px-4">Kirish</Link>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
