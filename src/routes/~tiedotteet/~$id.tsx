import { createFileRoute } from '@tanstack/react-router';
import { announcements } from '@/data';
import { AnnouncementDetail } from '@/components/announcements/announcement-detail';
import { EmptyState } from '@/components/common/empty-state';

export const Route = createFileRoute('/tiedotteet/$id')({
  component: AnnouncementDetailRoute,
});

function AnnouncementDetailRoute(): React.JSX.Element {
  const { id } = Route.useParams();
  const announcement = announcements.find((a) => a.id === id);

  if (!announcement) {
    return <EmptyState title="Tiedotetta ei löytynyt" />;
  }

  return <AnnouncementDetail announcement={announcement} />;
}
