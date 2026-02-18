import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/components/profile/profile-page';

export const Route = createFileRoute('/profiili')({
  component: ProfiiliPage,
});

function ProfiiliPage(): React.JSX.Element {
  return <ProfilePage />;
}
