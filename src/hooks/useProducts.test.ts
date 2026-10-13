import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, createQueryWrapper, type Mock } from '../test/utils';
import type { PaginatedData, Product } from '../types';
import { useProduct, useProducts } from './useProducts';

vi.mock('../api/products', () => ({
  productsApi: {
    listProducts: vi.fn(),
    getProduct: vi.fn(),
  },
}));

import { productsApi } from '../api/products';

const mockedApi = productsApi as unknown as {
  listProducts: Mock;
  getProduct: Mock;
};

describe('useProducts (hook de domínio — produtos)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useProducts retorna lista paginada', async () => {
    const page: PaginatedData<Product> = {
      items: [{ id: 'p1', nome: 'Mochila' } as Product],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    };
    mockedApi.listProducts.mockResolvedValueOnce(page);

    const { result } = renderHook(() => useProducts(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0]?.nome).toBe('Mochila');
  });

  it('useProduct busca por id ou slug', async () => {
    const product = { id: 'p1', slug: 'mochila' } as Product;
    mockedApi.getProduct.mockResolvedValueOnce(product);

    const { result } = renderHook(() => useProduct('mochila'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.slug).toBe('mochila');
    expect(mockedApi.getProduct).toHaveBeenCalledWith('mochila');
  });
});
