import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n/config';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LoadingSpinner } from '@/components/common/loading-spinner';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<LoadingSpinner />}>
        <TooltipProvider>{children}</TooltipProvider>
      </Suspense>
    </I18nextProvider>
  );
}
