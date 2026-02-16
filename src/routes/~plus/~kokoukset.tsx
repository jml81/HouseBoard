import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/plus/kokoukset')({
  component: KokouksetPage,
});

function KokouksetPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav_plus.meetings" />;
}
