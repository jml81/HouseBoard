import type { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Header } from '@/components/layout/header';
import { ErrorBoundary } from '@/components/common/error-boundary';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <MobileNav />
      </div>
    </div>
  );
}
