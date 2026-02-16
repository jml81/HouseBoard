import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/kalenteri')({
  component: KalenteriPage,
});

function KalenteriPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav.calendar" />;
}
