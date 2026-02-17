import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { useBuilding } from '@/hooks/use-building';
import { UpcomingBookingsCard } from './upcoming-bookings-card';
import { LatestAnnouncementsCard } from './latest-announcements-card';
import { UpcomingEventsCard } from './upcoming-events-card';
import { RecentMaterialsCard } from './recent-materials-card';

export function DashboardPage(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: building } = useBuilding();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-hb-primary">
          {t('dashboard.welcome')}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="size-4" />
          <span>{building?.name ?? ''}</span>
          <span>&middot;</span>
          <span>
            {building?.address ?? ''}, {building?.postalCode ?? ''} {building?.city ?? ''}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingBookingsCard />
        <LatestAnnouncementsCard />
        <UpcomingEventsCard />
        <RecentMaterialsCard />
      </div>
    </div>
  );
}
