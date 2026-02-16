import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/plus/')({
  component: PlusIndexRedirect,
});

function PlusIndexRedirect(): React.JSX.Element {
  return <Navigate to="/plus/kokoukset" />;
}
