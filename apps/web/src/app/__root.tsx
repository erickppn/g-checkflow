import { useEffect } from 'react';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ToastContainer } from 'react-toastify';

import type { QueryClient } from '@tanstack/react-query';

import "@fontsource/manrope";
import '../index.css';

interface AppRouterContext  {
  queryClient: QueryClient
}

const RootLayout = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }
  }, []);

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <ToastContainer />
    </>
  )
}

export const Route = createRootRouteWithContext<AppRouterContext>()({ component: RootLayout });