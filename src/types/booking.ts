export type BookingCategory = 'sauna' | 'pesutupa' | 'kerhohuone' | 'talkoot';

export interface Booking {
  id: string;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: BookingCategory;
  location: string;
  bookerName: string;
  apartment: string;
}

export const BOOKING_CATEGORY_COLORS: Record<BookingCategory, string> = {
  sauna: '#3B82F6',
  pesutupa: '#06B6D4',
  kerhohuone: '#F59E0B',
  talkoot: '#22C55E',
};
