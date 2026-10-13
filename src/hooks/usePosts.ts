import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/blog';
import type { ListBlogPostsParams } from '../types/blog';

/**
 * Hooks do domÃ­nio blog. Todas as queries sÃ£o anÃ´nimas â€” o backend
 * filtra automaticamente para `status='published'` quando nÃ£o hÃ¡ JWT.
 */
export function usePosts(params: ListBlogPostsParams = {}) {
  return useQuery({
    queryKey: ['blog', 'posts', params],
    queryFn: () => blogApi.listPosts(params),
    staleTime: 60_000,
  });
}

export function usePost(idOrSlug: string) {
  return useQuery({
    queryKey: ['blog', 'post', idOrSlug],
    queryFn: () => blogApi.getPost(idOrSlug),
    enabled: idOrSlug !== '',
    staleTime: 5 * 60_000,
  });
}

/** Produtos ativos associados a um post (GET /api/blog/posts/:id/products). */
export function usePostProducts(postIdOrSlug: string) {
  return useQuery({
    queryKey: ['blog', 'post', postIdOrSlug, 'products'],
    queryFn: () => blogApi.listPostProducts(postIdOrSlug),
    enabled: postIdOrSlug !== '',
    staleTime: 5 * 60_000,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: () => blogApi.listCategories(),
    staleTime: 10 * 60_000,
  });
}

export function useBlogCategory(slugOrId: string) {
  return useQuery({
    queryKey: ['blog', 'category', slugOrId],
    queryFn: () => blogApi.getCategory(slugOrId),
    enabled: slugOrId !== '',
    staleTime: 10 * 60_000,
  });
}
