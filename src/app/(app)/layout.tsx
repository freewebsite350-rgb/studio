
'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // A brief delay to allow Firebase to initialize and determine auth state.
    const timer = setTimeout(() => {
      // If the user is not logged in (and we're done checking), redirect them to the home page.
      if (user === null) {
        router.push('/');
      }
    }, 50); // a small 50ms delay

    return () => clearTimeout(timer);
  }, [user, router]);

  // While checking for the user, show a loading spinner.
  if (user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is null, don't render anything while the redirect happens.
  if (user === null) {
      return null;
  }

  // If the user is logged in, render the main app layout with the sidebar.
  return (
    <SidebarProvider>
      <div vaul-drawer-wrapper="">
        <div className="relative flex min-h-screen flex-col bg-background">
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
