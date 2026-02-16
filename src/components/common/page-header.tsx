import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  titleKey?: string;
  title?: string;
  description?: string;
  descriptionKey?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  titleKey,
  title,
  description,
  descriptionKey,
  actions,
  className,
}: PageHeaderProps): React.JSX.Element {
  const { t } = useTranslation();

  const displayTitle = titleKey ? t(titleKey) : title;
  const displayDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-hb-primary">{displayTitle}</h1>
          {displayDescription && (
            <p className="text-sm text-muted-foreground">{displayDescription}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <Separator />
    </div>
  );
}
