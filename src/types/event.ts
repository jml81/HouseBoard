export type EventStatus = 'upcoming' | 'past';

export interface HousingEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  organizer: string;
  interestedCount: number;
  status: EventStatus;
}
