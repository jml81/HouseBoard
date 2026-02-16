import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/tiedotteet')({
  component: TiedotteetLayout,
});

function TiedotteetLayout(): React.JSX.Element {
  return <Outlet />;
}
