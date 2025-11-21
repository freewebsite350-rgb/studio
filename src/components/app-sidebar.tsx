
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
import { Bot, Camera, Package, BarChart2, LayoutDashboard, LifeBuoy, Cog, Code, ShoppingCart, Shield, LogOut } from 'lucide-react';
import { AppConfig } from '@/lib/app-config';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useAuthUser } from '@/firebase';

export function AppSidebar() {
  const pathname = usePathname();
  const auth = useAuthUser();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
        await auth.signOut();
        router.push('/');
    }
  }

  // A simple check to see if the logged-in user is the admin.
  // In a real app, this would be based on a custom claim or a role in the database.
  const isAdmin = auth?.currentUser?.email === 'admin@example.com';

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
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/dashboard'}
              tooltip={{ children: 'Dashboard' }}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/analytics'}
              tooltip={{ children: 'Analytics' }}
            >
              <Link href="/analytics">
                <BarChart2 />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/products'}
              tooltip={{ children: 'Products' }}
            >
              <Link href="/products">
                <ShoppingCart />
                <span>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/returns'}
              tooltip={{ children: 'Returns' }}
            >
              <Link href="/returns">
                <Package />
                <span>Returns</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/visual-search'}
              tooltip={{ children: 'Visual Search' }}
            >
              <Link href="/visual-search">
                <Camera />
                <span>Visual Search</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/policy-ai'}
              tooltip={{ children: 'Policy AI' }}
            >
              <Link href="/policy-ai">
                <Bot />
                <span>Policy AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/support-ai'}
              tooltip={{ children: 'Support AI' }}
            >
              <Link href="/support-ai">
                <LifeBuoy />
                <span>Support AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={pathname === '/website-integration'}
                tooltip={{ children: 'Website Integration' }}
            >
                <Link href="/website-integration">
                    <Code />
                    <span>Website</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/settings'}
              tooltip={{ children: 'Settings' }}
            >
              <Link href="/settings">
                <Cog />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isAdmin && (
            <SidebarMenuItem>
                <SidebarMenuButton
                asChild
                isActive={pathname === '/admin'}
                tooltip={{ children: 'Admin' }}
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
         <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
         </Button>
      </SidebarFooter>
    </>
  );
}
