import { Outlet, createRootRoute, useRouterState, Navigate } from '@tanstack/react-router';
import { RootLayout } from '@/components/layout/root-layout';
import { useAuthStore } from '@/stores/auth-store';

export const Route = createRootRoute({
  component: RootLayoutWrapper,
});

function RootLayoutWrapper(): React.JSX.Element {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Display route and login page bypass layout and auth
  if (pathname.startsWith('/naytto') || pathname === '/kirjaudu') {
    return <Outlet />;
  }

  // Auth guard: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/kirjaudu" />;
  }

  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
