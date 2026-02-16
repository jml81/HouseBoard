import { createFileRoute } from '@tanstack/react-router';
import { MeetingsPage } from '@/components/meetings/meetings-page';

export const Route = createFileRoute('/plus/kokoukset')({
  component: KokouksetPage,
});

function KokouksetPage(): React.JSX.Element {
  return <MeetingsPage />;
}
