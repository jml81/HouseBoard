import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/kirpputori')({
  component: KirpputoriLayout,
});

function KirpputoriLayout(): React.JSX.Element {
  return <Outlet />;
}
