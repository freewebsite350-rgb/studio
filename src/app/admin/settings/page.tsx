import { AdminSettings } from '@/components/admin-settings';
import { AppConfig } from '@/lib/app-config';
import { Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
       <div className="w-full max-w-2xl">
         <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                 <Shield className="h-8 w-8" />
                <h1 className="text-2xl font-semibold">{AppConfig.appName}: Admin Settings</h1>
            </div>
             <Button variant="outline" asChild>
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Admin
                </Link>
            </Button>
         </div>
          <div className="flex-1 mt-6">
            <AdminSettings />
          </div>
       </div>
    </main>
  );
}
