import { useTranslation } from 'react-i18next';
import { bookings } from '@/data';
import { BOOKING_CATEGORY_COLORS } from '@/types';
import { formatDate } from '@/lib/date-utils';

export function DisplayBookingsSlide(): React.JSX.Element {
  const { t } = useTranslation();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.date === todayStr);

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <h2 className="text-3xl font-bold text-white">{t('display.bookingsTitle')}</h2>
      {todayBookings.length === 0 ? (
        <p className="text-2xl text-white/60">{t('display.noBookings')}</p>
      ) : (
        <div className="space-y-4">
          {todayBookings.map((booking) => (
            <div key={booking.id} className="flex items-center gap-4 rounded-lg bg-white/10 p-4">
              <div
                className="size-4 shrink-0 rounded-full"
                style={{ backgroundColor: BOOKING_CATEGORY_COLORS[booking.category] }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-semibold text-white">{booking.title}</p>
                <p className="text-xl text-white/70">
                  {booking.startTime}–{booking.endTime} &middot; {booking.location}
                </p>
              </div>
              <p className="shrink-0 text-lg text-white/50">
                {booking.bookerName} &middot; {formatDate(booking.date)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
