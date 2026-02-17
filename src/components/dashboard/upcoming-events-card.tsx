import { PartyPopper } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEvents } from '@/hooks/use-events';
import { formatDateShort, formatTime } from '@/lib/date-utils';
import { SummaryCard } from './summary-card';

export function UpcomingEventsCard(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: events } = useEvents();
  const upcoming = (events ?? []).filter((e) => e.status === 'upcoming').slice(0, 3);

  return (
    <SummaryCard
      icon={<PartyPopper className="size-5 text-hb-accent" />}
      titleKey="dashboard.upcomingEvents"
      linkTo="/tapahtumat"
    >
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('dashboard.noEvents')}</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((event) => (
            <li key={event.id} className="text-sm">
              <p className="font-medium">{event.title}</p>
              <p className="text-muted-foreground">
                {formatDateShort(event.date)} {formatTime(event.startTime)}-
                {formatTime(event.endTime)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SummaryCard>
  );
}
