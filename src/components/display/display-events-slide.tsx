import { useTranslation } from 'react-i18next';
import { events } from '@/data';
import { formatDate } from '@/lib/date-utils';

export function DisplayEventsSlide(): React.JSX.Element {
  const { t } = useTranslation();

  const upcoming = events.filter((e) => e.status === 'upcoming');

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <h2 className="text-3xl font-bold text-white">{t('display.eventsTitle')}</h2>
      {upcoming.length === 0 ? (
        <p className="text-2xl text-white/60">{t('display.noEvents')}</p>
      ) : (
        <div className="space-y-4">
          {upcoming.map((event) => (
            <div key={event.id} className="rounded-lg bg-white/10 p-4">
              <h3 className="text-2xl font-semibold text-white">{event.title}</h3>
              <p className="mt-1 text-xl text-white/70">
                {formatDate(event.date)} &middot; {event.startTime}–{event.endTime} &middot;{' '}
                {event.location}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
