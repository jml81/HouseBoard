import { isSameMonth, isToday, format } from 'date-fns';
import type { Booking } from '@/types';
import { BOOKING_CATEGORY_COLORS } from '@/types';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  day: Date;
  currentMonth: Date;
  bookings: Booking[];
  isSelected: boolean;
  onSelect: (day: Date) => void;
}

export function CalendarDayCell({
  day,
  currentMonth,
  bookings,
  isSelected,
  onSelect,
}: CalendarDayCellProps): React.JSX.Element {
  const inMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      className={cn(
        'flex h-12 flex-col items-center justify-start gap-0.5 rounded-md p-1 text-sm transition-colors md:h-16',
        !inMonth && 'text-muted-foreground/40',
        inMonth && 'hover:bg-muted',
        today && 'font-bold text-hb-accent',
        isSelected && 'bg-hb-accent-light ring-1 ring-hb-accent',
      )}
    >
      <span>{format(day, 'd')}</span>
      {bookings.length > 0 && (
        <div className="flex gap-0.5">
          {bookings.slice(0, 3).map((booking) => (
            <span
              key={booking.id}
              className="size-1.5 rounded-full"
              style={{ backgroundColor: BOOKING_CATEGORY_COLORS[booking.category] }}
            />
          ))}
        </div>
      )}
    </button>
  );
}
