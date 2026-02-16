import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/plus')({
  component: PlusLayout,
});

function PlusLayout(): React.JSX.Element {
  return <Outlet />;
}
