'use client';

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { Home, Rss, Upload, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/context/language-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const menuItems = [
    { href: '/teacher', label: t('sidebar.teacher.dashboard'), icon: Home },
    { href: '/teacher/lessons', label: t('lessons'), icon: BookOpen },
    { href: '/teacher/news', label: t('sidebar.teacher.news'), icon: Rss },
    { href: '/uploads', label: t('sidebar.teacher.uploads'), icon: Upload },
    { href: '/teacher/settings', label: t('sidebar.teacher.settings'), icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="hidden md:flex">
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4 md:hidden">
            <SidebarTrigger />
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-end">
            <UserNav />
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
