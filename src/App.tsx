/**
 * Main App Component
 *
 * Root component with global providers:
 * - QueryClientProvider for React Query (server state)
 * - ErrorBoundary for error handling
 * - Toaster for notifications
 * - Router (will be added in Phase 6)
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { queryClient } from '@/lib/queryClient';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Main app content - will be updated with Router in Phase 6 */}
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-gray-900">Jankee Manager</h1>
            <p className="mt-4 text-lg text-gray-600">
              Modern outdoor advertising site management system
            </p>
            <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
              <p className="text-gray-700">
                Phase 4: State Management & Services in progress.
                <br />
                React Query and Zustand stores are being configured.
              </p>
            </div>
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster />

        {/* React Query DevTools (only in development) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
