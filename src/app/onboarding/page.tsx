'use client';

import { OnboardingWizard } from '@/components/onboarding-wizard';

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <OnboardingWizard />
      </div>
    </main>
  );
}
