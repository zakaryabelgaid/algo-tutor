'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/user-context';
import { UserNav } from './user-nav';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Menu, Moon, Sun } from 'lucide-react';
import { Logo } from './logo';
import { useTranslation } from '@/context/language-context';
import { useTheme } from '@/context/theme-context';

export function Header() {
  const pathname = usePathname();
  const { user } = useContext(UserContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, setLanguage, language } = useTranslation();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { href: '/lessons', label: t('lessons') },
    { href: '/files', label: t('files') },
    { href: '/news', label: t('news') },
    { href: '/qna', label: t('qa') },
    { href: '/teachers', label: t('teachers') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-border/50">
      <div className="flex items-center gap-2 sm:gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open main menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background/95 backdrop-blur-sm p-0 w-[90vw] max-w-[300px]">
            <SheetTitle className="sr-only">Main Menu</SheetTitle>
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <nav className="flex flex-col gap-2 p-4">
                {menuItems.map(item => (
                  <Button
                    variant={
                      (item.href !== '/' && pathname.startsWith(item.href)) ||
                      pathname === item.href
                        ? 'secondary'
                        : 'ghost'
                    }
                    asChild
                    key={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="justify-start"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </nav>
              <div className="mt-auto p-4 border-t space-y-2">
                 <Button variant="outline" size="sm" onClick={toggleLanguage} className="w-full">
                    Switch to {language === 'en' ? 'Français' : 'English'}
                </Button>
                 <Button variant="outline" size="sm" onClick={toggleTheme} className="w-full">
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </Button>
                {!user && (
                   <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Link href="/login">{t('teacherLogin')}</Link>
                    </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="font-headline text-xl sm:text-2xl font-bold text-primary">
            <Link href="/">{t('appName')}</Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        {menuItems.map(item => (
          <Button
            variant={
              (item.href !== '/' && pathname.startsWith(item.href)) ||
              pathname === item.href
                ? 'secondary'
                : 'ghost'
            }
            asChild
            key={item.href}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>

      {/* User Auth and Mobile Menu Trigger */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button variant="outline" size="sm" onClick={toggleLanguage} className="hidden sm:inline-flex">
          {language.toUpperCase()}
        </Button>
        {user ? (
          <UserNav />
        ) : (
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/login">{t('teacherLogin')}</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
