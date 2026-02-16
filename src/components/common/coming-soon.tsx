import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/common/page-header';

interface ComingSoonProps {
  titleKey: string;
}

export function ComingSoon({ titleKey }: ComingSoonProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader titleKey={titleKey} />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-hb-accent-light">
          <Clock className="size-8 text-hb-accent" />
        </div>
        <h2 className="text-xl font-semibold text-hb-primary">{t('common.comingSoon')}</h2>
        <p className="max-w-sm text-center text-muted-foreground">
          {t('common.comingSoonDescription')}
        </p>
      </div>
    </div>
  );
}
