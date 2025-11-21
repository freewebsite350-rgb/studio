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
import { Bot, Camera, Package, LogOut } from 'lucide-react';
import { AppConfig } from '@/lib/app-config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="font-semibold text-lg">{AppConfig.appName}</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/'}
              tooltip={{ children: 'Returns' }}
            >
              <Link href="/">
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
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost">
          <LogOut className="mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </>
  );
}
