/**
 * Main App Component
 *
 * Root component with global providers:
 * - QueryClientProvider for React Query (server state)
 * - RouterProvider for React Router navigation
 * - ErrorBoundary for error handling
 * - Toaster for notifications
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/routes';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* React Router */}
        <RouterProvider router={router} />

        {/* Toast notifications */}
        <Toaster />

        {/* React Query DevTools (only in development) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
