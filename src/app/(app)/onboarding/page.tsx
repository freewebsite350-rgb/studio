import { OnboardingWizard } from '@/components/onboarding-wizard';
import { AppConfig } from '@/lib/app-config';
import { Users } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
      <div className="flex items-center gap-4 mb-8">
        <Users className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Get Started</h1>
      </div>
      <div className="w-full max-w-2xl">
        <OnboardingWizard />
      </div>
    </main>
  );
}
