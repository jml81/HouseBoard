import { createFileRoute } from '@tanstack/react-router';
import { ComingSoon } from '@/components/common/coming-soon';

export const Route = createFileRoute('/materiaalit')({
  component: MateriaalitPage,
});

function MateriaalitPage(): React.JSX.Element {
  return <ComingSoon titleKey="nav.materials" />;
}
