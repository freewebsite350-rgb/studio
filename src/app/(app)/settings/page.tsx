
import { BusinessSettings } from '@/components/business-settings';
import { AppConfig } from '@/lib/app-config';
import { Cog } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Cog className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Settings</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
            <BusinessSettings />
        </div>
      </div>
    </main>
  );
}
