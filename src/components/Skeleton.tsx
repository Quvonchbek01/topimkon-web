export function CardSkeleton() {
  return (
    <div className="card min-h-[250px] space-y-3 p-5" aria-hidden>
      <div className="skeleton h-6 w-24" />
      <div className="skeleton h-6 w-4/5" />
      <div className="skeleton h-4 w-1/2" />
      <div className="skeleton h-16 w-full" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Yuklanmoqda">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
