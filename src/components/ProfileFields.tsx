'use client';

import type { UseFormReturn } from 'react-hook-form';
import { ChipSelect } from '@/components/ChipSelect';
import { FIELDS, LANGUAGES } from '@/lib/labels';
import type { ProfileInput } from '@/lib/schemas';
import { DEGREES, OPPORTUNITY_TYPES } from '@/lib/types';

export type Section = 'name' | 'degree' | 'field' | 'type' | 'language';

// Onboarding (qadamma-qadam) va /profil (hammasi bir sahifada) shu komponentni ishlatadi.
export function ProfileFields({ form, show }: { form: UseFormReturn<ProfileInput>; show: Section[] }) {
  const { watch, setValue, register, formState } = form;
  const opts = (m: Record<string, string>): [string, string][] => Object.entries(m);
  const set = (k: 'field_interests' | 'preferred_types' | 'languages') => (v: string[]) =>
    setValue(k, v, { shouldDirty: true, shouldValidate: true });

  return (
    <div className="space-y-6">
      {show.includes('name') && (
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm font-bold">Ismingiz (ixtiyoriy)</label>
          <input id="full_name" className="input" maxLength={80} autoComplete="name" {...register('full_name')} />
          {formState.errors.full_name && <p className="mt-1 text-sm text-danger">{formState.errors.full_name.message}</p>}
        </div>
      )}
      {show.includes('degree') && (
        <div>
          <p className="mb-2 text-sm font-bold">Hozirgi o‘qish darajangiz</p>
          <ChipSelect
            multiple={false}
            options={opts(DEGREES)}
            value={watch('degree_level') ? [watch('degree_level')] : []}
            onChange={(v) => setValue('degree_level', v[0] as ProfileInput['degree_level'], { shouldDirty: true, shouldValidate: true })}
          />
          {formState.errors.degree_level && <p className="mt-2 text-sm text-danger">{formState.errors.degree_level.message}</p>}
        </div>
      )}
      {show.includes('field') && (
        <div>
          <p className="mb-2 text-sm font-bold">Qaysi sohalar qiziqtiradi?</p>
          <ChipSelect options={opts(FIELDS)} value={watch('field_interests') ?? []} onChange={set('field_interests')} />
        </div>
      )}
      {show.includes('type') && (
        <div>
          <p className="mb-2 text-sm font-bold">Qanday imkoniyatlar kerak?</p>
          <ChipSelect options={opts(OPPORTUNITY_TYPES)} value={watch('preferred_types') ?? []} onChange={set('preferred_types')} />
        </div>
      )}
      {show.includes('language') && (
        <div>
          <p className="mb-2 text-sm font-bold">Qaysi tillarni bilasiz?</p>
          <ChipSelect options={opts(LANGUAGES)} value={watch('languages') ?? []} onChange={set('languages')} />
        </div>
      )}
    </div>
  );
}
