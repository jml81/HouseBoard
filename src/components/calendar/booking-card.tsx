import { useTranslation } from 'react-i18next';
import { Clock, MapPin, User } from 'lucide-react';
import type { Booking } from '@/types';
import { BOOKING_CATEGORY_COLORS } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/lib/date-utils';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <span
        className="mt-1 size-3 shrink-0 rounded-full"
        style={{ backgroundColor: BOOKING_CATEGORY_COLORS[booking.category] }}
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{booking.title}</p>
          <Badge variant="outline" className="text-xs">
            {t(`categories.${booking.category}`)}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatTime(booking.startTime)}-{formatTime(booking.endTime)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" />
            {booking.location}
          </span>
          <span className="flex items-center gap-1">
            <User className="size-3.5" />
            {booking.bookerName} ({booking.apartment})
          </span>
        </div>
      </div>
    </div>
  );
}
