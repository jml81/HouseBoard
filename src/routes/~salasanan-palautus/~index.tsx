import { createFileRoute } from '@tanstack/react-router';
import { ForgotPasswordPage } from '@/components/auth/forgot-password-page';

export const Route = createFileRoute('/salasanan-palautus/')({
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute(): React.JSX.Element {
  return <ForgotPasswordPage />;
}
