import { GridSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="skeleton h-9 w-48" />
      <div className="skeleton mt-5 h-11 w-full" />
      <div className="mt-8"><GridSkeleton /></div>
    </div>
  );
}
