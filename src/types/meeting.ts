export type MeetingType = 'yhtiokokous' | 'ylimaarainen-yhtiokokous' | 'hallituksen-kokous';

export type MeetingStatus = 'upcoming' | 'completed';

export interface MeetingDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'xlsx' | 'docx';
  fileSize: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  description: string;
  documents: MeetingDocument[];
}
