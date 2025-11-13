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
import { Home, Users, BookOpen, Rss, Upload, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { href: '/admin', label: t('sidebar.admin.management'), icon: Users },
    { href: '/admin/lessons', label: t('lessons'), icon: BookOpen },
    { href: '/admin/news', label: t('sidebar.teacher.news'), icon: Rss },
    { href: '/admin/uploads', label: t('sidebar.teacher.uploads'), icon: Upload },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
                  isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
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
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              {language.toUpperCase()}
            </Button>
            <UserNav />
          </div>
        </header>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
