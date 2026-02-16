import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/plus/hallitus')({
  component: HallitusPage,
});

function HallitusPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav_plus.board" />;
}
