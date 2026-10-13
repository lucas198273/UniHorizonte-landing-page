import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from '../lib/queryClient';
import { TenantProvider } from './TenantProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TenantProvider>{children}</TenantProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
