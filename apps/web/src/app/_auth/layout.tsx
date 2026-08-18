import { Header } from '@/components/layout/header'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
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
