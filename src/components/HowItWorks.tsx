const STEPS = [
  { n: 1, title: 'Qidiring va filtrlang', text: 'Tur, soha, davlat, daraja va til bo‘yicha o‘zingizga mosini toping.' },
  { n: 2, title: 'Shartlarni solishtiring', text: 'Deadline, moliyalashtirish va asosiy talablarni bir qarashda ko‘ring.' },
  { n: 3, title: 'Rasmiy manbada topshiring', text: 'Har yozuvda rasmiy havola bor. Ariza o‘sha saytda topshiriladi.' },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how" className="mx-auto max-w-6xl px-4 pt-16">
      <h2 id="how" className="text-2xl font-extrabold">Qanday ishlaydi?</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="card p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-extrabold text-ink">{s.n}</div>
            <h3 className="mt-3 font-bold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
