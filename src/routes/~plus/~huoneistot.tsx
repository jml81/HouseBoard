import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/plus/huoneistot')({
  component: HuoneistotPage,
});

function HuoneistotPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav_plus.apartments" />;
}
