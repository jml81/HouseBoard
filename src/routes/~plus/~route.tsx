import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';

export const Route = createFileRoute('/plus')({
  beforeLoad: () => {
    const { isManager } = useAuthStore.getState();
    if (!isManager) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router requires throwing redirect
      throw redirect({ to: '/' });
    }
  },
  component: PlusLayout,
});

function PlusLayout(): React.JSX.Element {
  return <Outlet />;
}
