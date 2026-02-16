import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
} from 'date-fns';
import { fi } from 'date-fns/locale';

export function formatMonthYear(date: Date): string {
  const formatted = format(date, 'LLLL yyyy', { locale: fi });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatDate(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'd.M.yyyy');
}

export function formatDateShort(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'd.M.');
}

export function formatTime(time: string): string {
  return time;
}

export function getDaysForCalendar(month: Date): Date[] {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function getWeekdayHeaders(): string[] {
  return ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];
}

export function formatFullDate(date: Date): string {
  const formatted = format(date, 'EEEE d. MMMM yyyy', { locale: fi });
  return formatted.charAt(0).toLowerCase() + formatted.slice(1);
}

export function formatClock(date: Date): string {
  return format(date, 'HH:mm');
}
