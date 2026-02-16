import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: IndexRedirect,
});

function IndexRedirect(): React.JSX.Element {
  return <Navigate to="/kalenteri" />;
}
