import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'

import { PageLoading } from './components/common/page-loading'

// Import the generated route tree
import { routeTree } from './route-tree.gen'

// Date-fns config
import { setDefaultOptions } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { injectUnauthorizedHandler } from './lib/api'

setDefaultOptions({ locale: ptBR });

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <PageLoading />,
  context: {
    queryClient
  }
});

injectUnauthorizedHandler(() => {
  queryClient.setQueryData(['auth-user'], null)

  queryClient.clear()

  router.navigate({ 
    to: '/',
  });
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}