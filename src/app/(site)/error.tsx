'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl" aria-hidden>⚠️</p>
      <h1 className="mt-3 text-2xl font-extrabold">Nimadir xato ketdi</h1>
      <p className="mt-2 text-muted">
        Ma‘lumotni yuklab bo‘lmadi. Internetni tekshiring yoki birozdan keyin qayta urinib ko‘ring.
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">Qayta urinish</button>
    </div>
  );
}
