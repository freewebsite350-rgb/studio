'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Cog } from 'lucide-react';
import { withAuth } from '@/hooks/withAuth';

function ClientDashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Your Dashboard</h1>
          <Button variant="outline" asChild>
            <Link href="/ai-settings">
              <Cog className="mr-2 h-4 w-4" />
              Business Settings
            </Link>
          </Button>
        </div>
        <div className="flex-1 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                This is your space to manage your business.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Here, you can manage your products, view analytics, and
                configure your settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default withAuth(ClientDashboardPage, 'client');
