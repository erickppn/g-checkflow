import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect } from 'react';

import type { QueryClient } from '@tanstack/react-query';

import "@fontsource/manrope";
import '../index.css';

interface AppRouterContext  {
  queryClient: QueryClient
}

const RootLayout = () => (
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, [])

  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const Route = createRootRouteWithContext<AppRouterContext>()({ component: RootLayout });