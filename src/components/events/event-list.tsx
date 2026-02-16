import { useTranslation } from 'react-i18next';
import type { HousingEvent, EventStatus } from '@/types';
import { EmptyState } from '@/components/common/empty-state';
import { EventCard } from './event-card';

interface EventListProps {
  events: HousingEvent[];
  status: EventStatus;
}

export function EventList({ events, status }: EventListProps): React.JSX.Element {
  const { t } = useTranslation();
  const filtered = events.filter((e) => e.status === status);

  if (filtered.length === 0) {
    return (
      <EmptyState title={status === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')} />
    );
  }

  return (
    <div className="space-y-4">
      {filtered.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
