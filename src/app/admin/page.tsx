'use client';

import { AdminDashboard } from '@/components/admin-dashboard';
import { AppConfig } from '@/lib/app-config';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminPage() {
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
       <div className="w-full max-w-4xl">
         <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                 <Shield className="h-8 w-8" />
                <h1 className="text-2xl font-semibold">{AppConfig.appName}: Admin</h1>
            </div>
             <Button variant="outline" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
         </div>
          <div className="flex-1 mt-6">
            <AdminDashboard />
          </div>
       </div>
    </main>
  );
}
