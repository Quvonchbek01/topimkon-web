'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveProfile } from '@/app/actions/profile';
import { ProfileFields, type Section } from '@/components/ProfileFields';
import { profileSchema, type ProfileInput } from '@/lib/schemas';

// 4 qadamli qisqa profil: daraja → soha → tur → til.
const STEPS: { title: string; hint: string; show: Section[] }[] = [
  { title: 'Daraja', hint: 'Moslikning eng muhim qismi.', show: ['name', 'degree'] },
  { title: 'Soha', hint: 'Bir nechtasini tanlashingiz mumkin. Hohlamasangiz, o‘tkazib yuboring.', show: ['field'] },
  { title: 'Imkoniyat turi', hint: 'Qaysi turlar sizga kerak?', show: ['type'] },
  { title: 'Til', hint: 'Qaysi tillarda o‘qiy olasiz?', show: ['language'] },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', field_interests: [], preferred_types: [], languages: [] },
  });

  async function next() {
    if (step === 0 && !(await form.trigger('degree_level'))) return;
    setStep((s) => s + 1);
  }

  function finish() {
    setError(null);
    form.handleSubmit(async (values) => {
      setPending(true);
      const res = await saveProfile(values);
      setPending(false);
      if (!res.ok) return setError(res.error);
      router.push('/imkoniyatlar');
      router.refresh();
    })();
  }

  const last = step === STEPS.length - 1;
  const cur = STEPS[step]!;

  return (
    <div className="card p-6">
      <p className="text-sm font-semibold text-muted">Qadam {step + 1} / {STEPS.length}</p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-tint" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold">{cur.title}</h1>
      <p className="mb-5 mt-1 text-sm text-muted">{cur.hint}</p>

      <ProfileFields form={form} show={cur.show} />

      {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}

      <div className="mt-8 flex items-center gap-2">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost">Orqaga</button>
        ) : (
          <Link href="/imkoniyatlar" className="text-sm text-muted underline">Keyinroq</Link>
        )}
        {last ? (
          <button type="button" onClick={finish} disabled={pending} className="btn-primary ml-auto">
            {pending ? 'Saqlanmoqda...' : 'Tayyor'}
          </button>
        ) : (
          <button type="button" onClick={next} className="btn-primary ml-auto">Keyingi</button>
        )}
      </div>
    </div>
  );
}
