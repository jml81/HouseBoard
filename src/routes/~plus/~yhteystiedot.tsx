import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/plus/yhteystiedot')({
  component: YhteystiedotPage,
});

function YhteystiedotPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav_plus.contacts" />;
}
