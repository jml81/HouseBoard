import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router';
import { RootLayout } from '@/components/layout/root-layout';

export const Route = createRootRoute({
  component: RootLayoutWrapper,
});

function RootLayoutWrapper(): React.JSX.Element {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (pathname.startsWith('/naytto')) {
    return <Outlet />;
  }

  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
