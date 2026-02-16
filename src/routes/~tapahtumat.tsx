import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/tapahtumat')({
  component: TapahtumatPage,
});

function TapahtumatPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav.events" />;
}
