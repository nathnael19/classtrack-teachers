import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { Toaster } from 'sonner';
import { router } from './routes';
import { useUIStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes (data remains fresh)
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (data remains in cache across reloads)
      refetchOnWindowFocus: true, // Auto-background fetch when returning to tab
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: 2,
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

function App() {
  const { theme } = useUIStore();
  const { fetchUser, token, user } = useAuthStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return (
    <PersistQueryClientProvider 
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }}
    >
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </PersistQueryClientProvider>
  );
}

export default App;
