import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/tiedotteet')({
  component: TiedotteetPage,
});

function TiedotteetPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav.announcements" />;
}
