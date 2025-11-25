'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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