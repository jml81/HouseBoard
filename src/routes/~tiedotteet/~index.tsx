import { createFileRoute } from '@tanstack/react-router';
import { AnnouncementList } from '@/components/announcements/announcement-list';

export const Route = createFileRoute('/tiedotteet/')({
  component: AnnouncementList,
});
