import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/components/users/users-page';

export const Route = createFileRoute('/plus/kayttajat')({
  component: KayttajatPage,
});

function KayttajatPage(): React.JSX.Element {
  return <UsersPage />;
}
