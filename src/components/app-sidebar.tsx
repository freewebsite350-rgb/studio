
'use client';

import {
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  Bot, Camera, Package, BarChart2, LayoutDashboard, 
  LifeBuoy, Cog, Code, ShoppingCart, Shield 
} from 'lucide-react';
import { AppConfig } from '@/lib/app-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { useUser } from '@/hooks/useUser';

export function AppSidebar() {
  const pathname = usePathname();
  const { isAuthenticated, role } = useUser();

  const isAdmin = isAuthenticated && role === 'admin';

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link href="/dashboard">
            <h1 className="font-semibold text-lg cursor-pointer">{AppConfig.appName}</h1>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>

          {/* DASHBOARD */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ANALYTICS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/analytics'}
            >
              <Link href="/dashboard/analytics">
                <BarChart2 />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* PRODUCTS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/products'}
            >
              <Link href="/dashboard/products">
                <ShoppingCart />
                <span>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* RETURNS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/returns'}
            >
              <Link href="/dashboard/returns">
                <Package />
                <span>Returns</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* VISUAL SEARCH */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/visual-search'}
            >
              <Link href="/dashboard/visual-search">
                <Camera />
                <span>Visual Search</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* POLICY AI */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/policy-ai'}
            >
              <Link href="/dashboard/policy-ai">
                <Bot />
                <span>Policy AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* SUPPORT AI */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/support-ai'}
            >
              <Link href="/dashboard/support-ai">
                <LifeBuoy />
                <span>Support AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* WEBSITE INTEGRATION */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/website-integration'}
            >
              <Link href="/dashboard/website-integration">
                <Code />
                <span>Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* SETTINGS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/settings'}
            >
              <Link href="/dashboard/settings">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* AI SETTINGS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard/ai-settings'}
            >
              <Link href="/dashboard/ai-settings">
                <Bot />
                <span>AI Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* ADMIN */}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin'}
              >
                <Link href="/admin">
                  <Shield />
                  <span>Admin</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </SidebarFooter>
    </>
  );
}