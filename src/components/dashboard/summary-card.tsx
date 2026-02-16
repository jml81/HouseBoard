import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  icon: ReactNode;
  titleKey: string;
  linkTo: string;
  children: ReactNode;
  className?: string;
}

export function SummaryCard({
  icon,
  titleKey,
  linkTo,
  children,
  className,
}: SummaryCardProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {t(titleKey)}
        </CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to={linkTo}>{t('common.showAll')}</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
