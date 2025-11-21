
import { AdminDashboard } from '@/components/admin-dashboard';
import { AppConfig } from '@/lib/app-config';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Shield className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">{AppConfig.appName}: Admin</h1>
      </div>
      <div className="flex-1 mt-6">
        <AdminDashboard />
      </div>
    </main>
  );
}
