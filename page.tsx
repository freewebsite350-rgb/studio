import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Cog } from 'lucide-react';
import { requireAuth } from '@/lib/auth'; // Server-side auth guard

export default async function DashboardPage() {
  // Ensure user is authenticated and has the 'client' role
  await requireAuth('client');

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Your Dashboard</h1>
          <Button variant="outline" asChild>
            <Link href="/ai-settings">
              <Cog className="mr-2 h-4 w-4" />
              Business Settings
            </Link>
          </Button>
        </div>

        {/* Main Card */}
        <div className="flex-1 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                Manage your products, analytics, automations and AI settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is your business control center.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
