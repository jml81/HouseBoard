import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@/components/auth/login-form';

export const Route = createFileRoute('/kirjaudu')({
  component: LoginPage,
});

function LoginPage(): React.JSX.Element {
  return <LoginForm />;
}
