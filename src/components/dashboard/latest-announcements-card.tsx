import { Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAnnouncements } from '@/hooks/use-announcements';
import { formatDateShort } from '@/lib/date-utils';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { SummaryCard } from './summary-card';

export function LatestAnnouncementsCard(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: announcements, isLoading } = useAnnouncements();
  const latest = announcements?.slice(0, 3) ?? [];

  return (
    <SummaryCard
      icon={<Megaphone className="size-5 text-hb-accent" />}
      titleKey="dashboard.latestAnnouncements"
      linkTo="/tiedotteet"
    >
      {isLoading ? (
        <LoadingSpinner size="sm" />
      ) : latest.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('dashboard.noAnnouncements')}</p>
      ) : (
        <ul className="space-y-3">
          {latest.map((announcement) => (
            <li key={announcement.id} className="text-sm">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{announcement.title}</p>
                {announcement.isNew && (
                  <Badge variant="default" className="bg-hb-accent text-xs">
                    {t('common.new')}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{formatDateShort(announcement.publishedAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </SummaryCard>
  );
}
