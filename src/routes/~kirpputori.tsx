import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/kirpputori')({
  component: KirpputoriPage,
});

function KirpputoriPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav.marketplace" />;
}
