import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, createQueryWrapper, type Mock } from '../test/utils';
import type { BlogPost, PaginatedData } from '../types';
import { useBlogCategories, usePost, usePostProducts, usePosts } from './usePosts';

vi.mock('../api/blog', () => ({
  blogApi: {
    listPosts: vi.fn(),
    getPost: vi.fn(),
    listPostProducts: vi.fn(),
    listCategories: vi.fn(),
    getCategory: vi.fn(),
  },
}));

import { blogApi } from '../api/blog';

const mockedApi = blogApi as unknown as {
  listPosts: Mock;
  getPost: Mock;
  listPostProducts: Mock;
  listCategories: Mock;
  getCategory: Mock;
};

describe('usePosts (hook de domínio — blog)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usePosts retorna lista paginada e repassa params sem status', async () => {
    const page: PaginatedData<BlogPost> = {
      items: [{ id: '1', slug: 'a', title: 'A' } as BlogPost],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    mockedApi.listPosts.mockResolvedValueOnce(page);

    const { result } = renderHook(() => usePosts({ limit: 10 }), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0]?.title).toBe('A');
    expect(mockedApi.listPosts).toHaveBeenCalledWith({ limit: 10 });
  });

  it('usePost busca por id ou slug', async () => {
    const post = { id: '1', slug: 'a', title: 'A' } as BlogPost;
    mockedApi.getPost.mockResolvedValueOnce(post);

    const { result } = renderHook(() => usePost('a'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.slug).toBe('a');
    expect(mockedApi.getPost).toHaveBeenCalledWith('a');
  });

  it('usePostProducts busca produtos do post', async () => {
    mockedApi.listPostProducts.mockResolvedValueOnce([{ id: 'p1' }]);

    const { result } = renderHook(() => usePostProducts('1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(mockedApi.listPostProducts).toHaveBeenCalledWith('1');
  });

  it('useBlogCategories carrega categorias', async () => {
    mockedApi.listCategories.mockResolvedValueOnce([{ id: 'c1', nome: 'Destinos' }]);

    const { result } = renderHook(() => useBlogCategories(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});
