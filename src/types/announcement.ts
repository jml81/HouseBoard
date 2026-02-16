export type AnnouncementCategory = 'yleinen' | 'huolto' | 'remontti' | 'vesi-sahko';

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: AnnouncementCategory;
  author: string;
  publishedAt: string; // ISO date string
  isNew: boolean;
}
