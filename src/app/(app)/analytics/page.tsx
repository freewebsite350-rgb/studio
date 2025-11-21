
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { BarChart2 } from 'lucide-react';
import { AppConfig } from '@/lib/app-config';

export default function AnalyticsPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
       <div className="flex items-center gap-4">
        <BarChart2 className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Analytics</h1>
      </div>
      <div className="flex-1 mt-6">
        <AnalyticsDashboard />
      </div>
    </main>
  );
}
