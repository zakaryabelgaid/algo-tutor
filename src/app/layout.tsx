import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/context/user-context';
import { NewsProvider } from '@/context/news-context';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/context/theme-context';

export const metadata: Metadata = {
  title: 'Algo Tutor | Interactive Algorithm Tutorials',
  description: 'An interactive platform to learn algorithms with tutorials and personalized recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
              <UserProvider>
                <NewsProvider>
                    <div className="relative z-10">
                      {children}
                    </div>
                </NewsProvider>
              </UserProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
