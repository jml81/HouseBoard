import { format, isSameDay } from 'date-fns';
import type { Booking } from '@/types';
import { getDaysForCalendar, getWeekdayHeaders } from '@/lib/date-utils';
import { CalendarDayCell } from './calendar-day-cell';

interface CalendarGridProps {
  currentMonth: Date;
  bookings: Booking[];
  selectedDay: Date | null;
  onSelectDay: (day: Date) => void;
}

export function CalendarGrid({
  currentMonth,
  bookings,
  selectedDay,
  onSelectDay,
}: CalendarGridProps): React.JSX.Element {
  const days = getDaysForCalendar(currentMonth);
  const weekdays = getWeekdayHeaders();

  function getBookingsForDay(day: Date): Booking[] {
    const dayStr = format(day, 'yyyy-MM-dd');
    return bookings.filter((b) => b.date === dayStr);
  }

  return (
    <div className="grid grid-cols-7 gap-px">
      {weekdays.map((wd) => (
        <div
          key={wd}
          className="pb-2 text-center text-xs font-medium uppercase text-muted-foreground"
        >
          {wd}
        </div>
      ))}
      {days.map((day) => (
        <CalendarDayCell
          key={day.toISOString()}
          day={day}
          currentMonth={currentMonth}
          bookings={getBookingsForDay(day)}
          isSelected={selectedDay !== null && isSameDay(day, selectedDay)}
          onSelect={onSelectDay}
        />
      ))}
    </div>
  );
}
