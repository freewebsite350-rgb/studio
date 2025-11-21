'use client';

import { AdminDashboard } from '@/components/admin-dashboard';
import { AppConfig } from '@/lib/app-config';
import { Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthUser } from '@/firebase';

export default function AdminPage() {
  const auth = useAuthUser();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
        await auth.signOut();
        router.push('/');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
       <div className="w-full max-w-4xl">
         <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                 <Shield className="h-8 w-8" />
                <h1 className="text-2xl font-semibold">{AppConfig.appName}: Admin</h1>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
         </div>
          <div className="flex-1 mt-6">
            <AdminDashboard />
          </div>
       </div>
    </main>
  );
}
