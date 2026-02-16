import { useTranslation } from 'react-i18next';
import type { Booking } from '@/types';
import { formatDate } from '@/lib/date-utils';
import { EmptyState } from '@/components/common/empty-state';
import { BookingCard } from './booking-card';

interface BookingListProps {
  bookings: Booking[];
  showDate?: boolean;
}

export function BookingList({ bookings, showDate = true }: BookingListProps): React.JSX.Element {
  const { t } = useTranslation();

  if (bookings.length === 0) {
    return <EmptyState title={t('calendar.noBookings')} />;
  }

  // Group by date
  const grouped = new Map<string, Booking[]>();
  for (const booking of bookings) {
    const existing = grouped.get(booking.date) ?? [];
    existing.push(booking);
    grouped.set(booking.date, existing);
  }

  return (
    <div className="space-y-4">
      {[...grouped.entries()].map(([date, dateBookings]) => (
        <div key={date} className="space-y-2">
          {showDate && (
            <h3 className="text-sm font-medium text-muted-foreground">{formatDate(date)}</h3>
          )}
          {dateBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ))}
    </div>
  );
}
