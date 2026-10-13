import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { env } from '../config/env';

interface TenantContextValue {
  slug: string;
}

const TenantContext = createContext<TenantContextValue | null>(null);

/**
 * Estratégia: subdomínio primeiro (white-label), fallback para env fixa (MVP).
 * `clienteA.app.com` → slug "clienteA"; senão VITE_DEFAULT_TENANT_SLUG.
 */
function resolveTenantSlug(): string {
  if (typeof window !== 'undefined') {
    const parts = window.location.hostname.split('.');
    if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      return parts[0];
    }
  }
  return env.DEFAULT_TENANT_SLUG;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({ slug: resolveTenantSlug() }), []);
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant deve ser usado dentro de <TenantProvider>');
  return ctx;
}
