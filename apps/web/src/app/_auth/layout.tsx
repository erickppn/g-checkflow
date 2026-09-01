import { Header } from '@/components/layout/header'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { authQueries } from '@/features/auth/auth.queries';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData(
        authQueries.currentUser(),
      );

      return { user };
    } catch {
      throw redirect({
        to: "/",
      });
    }
  },

  component: AuthenticatedLayout
});

function AuthenticatedLayout() {
  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden">
      <Header />
      <Outlet />

      <MobileNavigation />
    </div>
  )
}
