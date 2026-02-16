import { describe, it, expect } from 'vitest';
import {
  formatMonthYear,
  formatDate,
  formatDateShort,
  formatTime,
  getDaysForCalendar,
  getWeekdayHeaders,
  formatFullDate,
  formatClock,
} from './date-utils';

describe('date-utils', () => {
  describe('formatMonthYear', () => {
    it('formats March 2026 in Finnish', () => {
      const date = new Date(2026, 2, 1); // March
      expect(formatMonthYear(date)).toBe('Maaliskuu 2026');
    });

    it('formats January 2026 in Finnish', () => {
      const date = new Date(2026, 0, 1);
      expect(formatMonthYear(date)).toBe('Tammikuu 2026');
    });

    it('capitalizes first letter', () => {
      const date = new Date(2026, 5, 1); // June
      const result = formatMonthYear(date);
      expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
    });
  });

  describe('formatDate', () => {
    it('formats ISO date to Finnish format', () => {
      expect(formatDate('2026-03-15')).toBe('15.3.2026');
    });

    it('formats single-digit day and month', () => {
      expect(formatDate('2026-01-05')).toBe('5.1.2026');
    });
  });

  describe('formatDateShort', () => {
    it('formats ISO date to short Finnish format', () => {
      expect(formatDateShort('2026-03-15')).toBe('15.3.');
    });
  });

  describe('formatTime', () => {
    it('returns time string as-is', () => {
      expect(formatTime('18:00')).toBe('18:00');
    });
  });

  describe('getDaysForCalendar', () => {
    it('returns an array of dates for the calendar grid', () => {
      const march2026 = new Date(2026, 2, 1);
      const days = getDaysForCalendar(march2026);

      // March 2026 starts on Sunday, so calendar starts on Monday Feb 23
      expect(days.length).toBeGreaterThanOrEqual(28);
      // Should be a multiple of 7
      expect(days.length % 7).toBe(0);
    });

    it('starts on Monday', () => {
      const march2026 = new Date(2026, 2, 1);
      const days = getDaysForCalendar(march2026);
      // First day should be Monday (getDay() === 1)
      expect(days[0]?.getDay()).toBe(1);
    });

    it('ends on Sunday', () => {
      const march2026 = new Date(2026, 2, 1);
      const days = getDaysForCalendar(march2026);
      // Last day should be Sunday (getDay() === 0)
      expect(days.at(-1)?.getDay()).toBe(0);
    });
  });

  describe('getWeekdayHeaders', () => {
    it('returns Finnish weekday abbreviations', () => {
      expect(getWeekdayHeaders()).toEqual(['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']);
    });

    it('returns 7 items', () => {
      expect(getWeekdayHeaders()).toHaveLength(7);
    });
  });

  describe('formatFullDate', () => {
    it('formats date in Finnish with weekday', () => {
      const date = new Date(2026, 1, 16); // Monday Feb 16
      expect(formatFullDate(date)).toBe('maanantaina 16. helmikuuta 2026');
    });
  });

  describe('formatClock', () => {
    it('formats time as HH:mm', () => {
      const date = new Date(2026, 1, 16, 14, 35, 0);
      expect(formatClock(date)).toBe('14:35');
    });
  });
});
