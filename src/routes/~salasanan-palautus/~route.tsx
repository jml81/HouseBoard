import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/salasanan-palautus')({
  component: PasswordResetLayout,
});

function PasswordResetLayout(): React.JSX.Element {
  return <Outlet />;
}
