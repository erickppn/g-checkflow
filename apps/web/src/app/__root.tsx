import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import type { QueryClient } from '@tanstack/react-query';

import '../index.css';

interface AppRouterContext  {
  queryClient: QueryClient
}

const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRouteWithContext<AppRouterContext>()({ component: RootLayout });