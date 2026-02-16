import { createFileRoute } from '@tanstack/react-router';
import { ApartmentsPage } from '@/components/apartments/apartments-page';

export const Route = createFileRoute('/plus/huoneistot')({
  component: HuoneistotPage,
});

function HuoneistotPage(): React.JSX.Element {
  return <ApartmentsPage />;
}
