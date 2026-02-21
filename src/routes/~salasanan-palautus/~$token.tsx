import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordPage } from '@/components/auth/reset-password-page';

export const Route = createFileRoute('/salasanan-palautus/$token')({
  component: ResetPasswordRoute,
});

function ResetPasswordRoute(): React.JSX.Element {
  const { token } = Route.useParams();
  return <ResetPasswordPage token={token} />;
}
