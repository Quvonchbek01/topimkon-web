import Link from 'next/link';
import { HowItWorks } from '@/components/HowItWorks';
import { OpportunityCard } from '@/components/OpportunityCard';
import { SearchBar } from '@/components/SearchBar';
import { TypeChips } from '@/components/TypeChips';
import { getHomeData } from '@/lib/opportunities';
import { cardExtras, getViewer } from '@/lib/viewer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [{ featured, closing, stats }, viewer] = await Promise.all([getHomeData(), getViewer()]);
  const statItems = [
    { n: stats.total, text: 'ochiq imkoniyat' },
    { n: stats.scholarships, text: 'stipendiya' },
    { n: stats.forUz, text: 'O‘zbekiston talabalari uchun' },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-brand-soft to-surface">
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-12 text-center md:pt-20">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Imkoniyatlar to‘p. <span className="text-brand-dark">O‘zingnikini top.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Grant, stipendiya, stajirovka, kurs va konkurslar — bir joyda. Deadline’ni o‘tkazib yubormang.
          </p>
          <div className="mt-7 text-left"><SearchBar /></div>
          <div className="mt-4 flex justify-center"><TypeChips /></div>
        </div>
      </section>

      <section className="mx-auto -mt-2 grid max-w-6xl grid-cols-3 gap-3 px-4" aria-label="Statistika">
        {statItems.map((s) => (
          <div key={s.text} className="card p-4 text-center">
            <p className="text-2xl font-extrabold text-brand-dark">{s.n}</p>
            <p className="mt-1 text-xs text-muted">{s.text}</p>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14" aria-labelledby="featured">
          <div className="mb-5 flex items-end justify-between">
            <h2 id="featured" className="text-2xl font-extrabold">Tavsiya etilgan</h2>
            <Link href="/imkoniyatlar" className="text-sm font-bold text-brand-dark">Hammasini ko‘rish →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((o) => <OpportunityCard key={o.id} item={o} {...cardExtras(viewer, o)} />)}
          </div>
        </section>
      )}

      {closing.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14" aria-labelledby="closing">
          <div className="mb-5 flex items-end justify-between">
            <h2 id="closing" className="text-2xl font-extrabold">Deadline yaqin</h2>
            <Link href="/imkoniyatlar?sort=deadline" className="text-sm font-bold text-brand-dark">Yana ko‘rish →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {closing.map((o) => <OpportunityCard key={o.id} item={o} {...cardExtras(viewer, o)} />)}
          </div>
        </section>
      )}

      <HowItWorks />
    </>
  );
}
