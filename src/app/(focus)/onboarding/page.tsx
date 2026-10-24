import type { Metadata } from 'next';
import { OnboardingWizard } from '@/components/OnboardingWizard';

export const metadata: Metadata = { title: 'Profilingizni to‘ldiring' };

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <p className="mb-4 text-muted">Bir daqiqada profil to‘ldiring — har imkoniyat sizga qanchalik mosligini ko‘rsatamiz.</p>
      <OnboardingWizard />
    </div>
  );
}
