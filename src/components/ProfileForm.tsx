'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveProfile } from '@/app/actions/profile';
import { ProfileFields } from '@/components/ProfileFields';
import { profileSchema, type ProfileInput } from '@/lib/schemas';

export function ProfileForm({ defaults }: { defaults: Partial<ProfileInput> }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', field_interests: [], preferred_types: [], languages: [], ...defaults },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setPending(true);
    const res = await saveProfile(values);
    setPending(false);
    setMsg(res.ok ? { ok: true, text: 'Saqlandi ✓' } : { ok: false, text: res.error });
    if (res.ok) router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="card space-y-6 p-6">
      <ProfileFields form={form} show={['name', 'degree', 'field', 'type', 'language']} />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary">{pending ? 'Saqlanmoqda...' : 'Saqlash'}</button>
        {msg && <p role="status" className={`text-sm font-semibold ${msg.ok ? 'text-brand-dark' : 'text-danger'}`}>{msg.text}</p>}
      </div>
    </form>
  );
}
