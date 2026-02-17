import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBookings } from '@/hooks/use-bookings';
import { BOOKING_CATEGORY_COLORS } from '@/types';
import { formatDateShort, formatTime } from '@/lib/date-utils';
import { SummaryCard } from './summary-card';

export function UpcomingBookingsCard(): React.JSX.Element {
  const { t } = useTranslation();
  const { data: bookings } = useBookings();
  const upcoming = (bookings ?? []).slice(0, 3);

  return (
    <SummaryCard
      icon={<Calendar className="size-5 text-hb-accent" />}
      titleKey="dashboard.upcomingBookings"
      linkTo="/kalenteri"
    >
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('dashboard.noBookings')}</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((booking) => (
            <li key={booking.id} className="flex items-center gap-3 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: BOOKING_CATEGORY_COLORS[booking.category] }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{booking.title}</p>
                <p className="text-muted-foreground">
                  {formatDateShort(booking.date)} {formatTime(booking.startTime)}-
                  {formatTime(booking.endTime)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SummaryCard>
  );
}
