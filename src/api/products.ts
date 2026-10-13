import { apiGet, apiGetList } from '../lib/http';
import type { ListProductsParams, Product, ProductCategory } from '../types/product';

/**
 * Rotas públicas do backend-cm- (somente GET, anônimas):
 * - GET /api/products                 (paginado: category, commercialType, page, limit — só ativos)
 * - GET /api/products/:idOrSlug       (aceita UUID ou slug)
 * - GET /api/products/categories      (categorias ativas)
 * - GET /api/products/categories/:slugOrId
 */
export const productsApi = {
  listProducts: (params: ListProductsParams = {}) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    }
    const query = search.toString();
    return apiGetList<Product>(`/api/products${query ? `?${query}` : ''}`);
  },

  getProduct: (idOrSlug: string) =>
    apiGet<Product>(`/api/products/${encodeURIComponent(idOrSlug)}`),

  listCategories: () => apiGet<ProductCategory[]>('/api/products/categories'),

  getCategory: (slugOrId: string) =>
    apiGet<ProductCategory>(`/api/products/categories/${encodeURIComponent(slugOrId)}`),
};
