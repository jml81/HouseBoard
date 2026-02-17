import { createFileRoute } from '@tanstack/react-router';
import { useAnnouncement } from '@/hooks/use-announcements';
import { AnnouncementDetail } from '@/components/announcements/announcement-detail';
import { EmptyState } from '@/components/common/empty-state';
import { LoadingSpinner } from '@/components/common/loading-spinner';

export const Route = createFileRoute('/tiedotteet/$id')({
  component: AnnouncementDetailRoute,
});

function AnnouncementDetailRoute(): React.JSX.Element {
  const { id } = Route.useParams();
  const { data: announcement, isLoading, error } = useAnnouncement(id);

  if (isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (error ?? !announcement) {
    return <EmptyState title="Tiedotetta ei löytynyt" />;
  }

  return <AnnouncementDetail announcement={announcement} />;
}
