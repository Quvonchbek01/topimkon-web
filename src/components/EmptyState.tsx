import Link from 'next/link';

export function EmptyState({ title, text, href, action }: { title: string; text: string; href?: string; action?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-card px-6 py-14 text-center">
      <p className="text-3xl" aria-hidden>🔎</p>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{text}</p>
      {href && action && (
        <Link href={href} className="btn-primary mt-5">{action}</Link>
      )}
    </div>
  );
}
