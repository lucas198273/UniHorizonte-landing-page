import { apiGet, apiGetList } from '../lib/http';
import type { BlogCategory, BlogPost, ListBlogPostsParams } from '../types/blog';
import type { Product } from '../types/product';

/**
 * Rotas públicas do backend-cm- (somente GET, anônimas):
 * - GET /api/blog/posts               (paginado: category, tag, featured, page, limit)
 * - GET /api/blog/posts/:idOrSlug     (aceita UUID ou slug)
 * - GET /api/blog/posts/:id/products  (produtos ativos associados ao post)
 * - GET /api/blog/categories          (ativas)
 * - GET /api/blog/categories/:slugOrId
 */
export const blogApi = {
  listPosts: (params: ListBlogPostsParams = {}) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    }
    const query = search.toString();
    return apiGetList<BlogPost>(`/api/blog/posts${query ? `?${query}` : ''}`);
  },

  getPost: (idOrSlug: string) =>
    apiGet<BlogPost>(`/api/blog/posts/${encodeURIComponent(idOrSlug)}`),

  listPostProducts: (postIdOrSlug: string) =>
    apiGet<Product[]>(`/api/blog/posts/${encodeURIComponent(postIdOrSlug)}/products`),

  listCategories: () => apiGet<BlogCategory[]>('/api/blog/categories'),

  getCategory: (slugOrId: string) =>
    apiGet<BlogCategory>(`/api/blog/categories/${encodeURIComponent(slugOrId)}`),
};
