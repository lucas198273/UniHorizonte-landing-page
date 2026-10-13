/**
 * Variáveis de ambiente validadas em boot.
 * Falha rápido se faltar config essencial — evita rodar com URL quebrada.
 */

interface Env {
  API_URL: string;
  DEFAULT_TENANT_SLUG: string;
  isDev: boolean;
}

function requireEnv(name: 'VITE_API_URL' | 'VITE_DEFAULT_TENANT_SLUG'): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Env obrigatória ausente: ${name}. Verifique o .env / .env.local.`);
  }
  return value.replace(/\/+$/, '');
}

export const env: Env = {
  API_URL: requireEnv('VITE_API_URL'),
  DEFAULT_TENANT_SLUG: requireEnv('VITE_DEFAULT_TENANT_SLUG'),
  isDev: import.meta.env.DEV === true,
};
