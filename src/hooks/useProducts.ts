import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import type { ListProductsParams } from '../types/product';

/**
 * Hooks do domínio produtos. Queries anônimas — o backend
 * só devolve `status='active'` para visitantes.
 */
export function useProducts(params: ListProductsParams = {}) {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => productsApi.listProducts(params),
    staleTime: 60_000,
  });
}

export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ['products', 'detail', idOrSlug],
    queryFn: () => productsApi.getProduct(idOrSlug),
    enabled: idOrSlug !== '',
    staleTime: 5 * 60_000,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => productsApi.listCategories(),
    staleTime: 10 * 60_000,
  });
}
