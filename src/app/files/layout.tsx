import { Header } from '@/components/header';

export default function FilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-card border-t">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Algo Tutor. All rights reserved. how did you made this</p>
        </div>
      </footer>
    </div>
  );
}
