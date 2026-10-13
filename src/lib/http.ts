import { env } from '../config/env';
import { ApiError } from './errors';
import type { ApiResponse } from '../types/api';
import type { PaginatedData } from '../types/api';

/**
 * Único cliente HTTP do frontend.
 * - Somente GET (site público de leitura — sem POST/PUT/PATCH/DELETE).
 * - Sem Authorization (não autentica).
 * - Envia X-Tenant-Slug automaticamente.
 */

export interface RequestOptions {
  tenantSlug?: string;
  signal?: AbortSignal;
}

/** GET de item único: devolve `data` do envelope. */
export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const payload = await request<T>(path, options);
  return payload.data as T;
}

/**
 * GET de lista paginada: o backend devolve `{ items, meta }` dentro de `data`.
 * (shared/http/types.ts → PaginatedData<T>)
 */
export async function apiGetList<T>(
  path: string,
  options: RequestOptions = {},
): Promise<PaginatedData<T>> {
  const payload = await request<PaginatedData<T>>(path, options);
  return payload.data ?? { items: [], meta: { page: 1, limit: 0, total: 0, totalPages: 1 } };
}

async function request<T>(
  path: string,
  options: RequestOptions,
): Promise<ApiResponse<T>> {
  const slug = options.tenantSlug ?? env.DEFAULT_TENANT_SLUG;

  let res: Response;
  try {
    res = await fetch(`${env.API_URL}${path}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(slug ? { 'X-Tenant-Slug': slug } : {}),
      },
      signal: options.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('Erro de rede ao consultar o servidor.', 0);
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError('Resposta inválida do servidor.', res.status);
  }

  if (!res.ok || payload.success !== true) {
    throw new ApiError(payload.message || `Erro ${res.status}`, res.status);
  }

  return payload;
}
