import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useProductCategories, useProducts } from '../hooks/useProducts';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/Spinner';
import { ProductGrid } from '../components/products/ProductGrid';
import {
  CourseFilters,
  CourseFiltersFields,
  CourseFiltersToggle,
} from '../components/products/CourseFilters';
import {
  DEFAULT_SORT,
  LEVEL_VALUES,
  MODALITY_VALUES,
  SORT_VALUES,
  parseEnumList,
  parseNumberParam,
} from '../components/products/courseFilterOptions';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';
import { ApiError } from '../lib/errors';
import type {
  ListProductsParams,
  ProductLevel,
  ProductModality,
  ProductSort,
} from '../types/product';

// Camada de apresentação: consumimos `Product` do backend,
// mas exibimos como "curso" pro usuário final.

const PAGE_SIZE = 12;

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useProductCategories();

  // A URL manda: os filtros são lidos direto da query string.
  const rawCategory = searchParams.get('category');
  const category =
    rawCategory && categories.data?.some((cat) => cat.slug === rawCategory)
      ? rawCategory
      : null;

  const modality = parseEnumList(searchParams.get('modality'), MODALITY_VALUES);
  const level = parseEnumList(searchParams.get('level'), LEVEL_VALUES);
  const certification = searchParams.get('certification') === 'true';
  const tags = searchParams.get('tags') ?? '';
  const minPrice = parseNumberParam(searchParams.get('min_price'));
  const maxPrice = parseNumberParam(searchParams.get('max_price'));
  const minWorkload = parseNumberParam(searchParams.get('min_workload'));
  const maxWorkload = parseNumberParam(searchParams.get('max_workload'));
  const rawSort = searchParams.get('sort');
  const sort =
    rawSort && SORT_VALUES.includes(rawSort as ProductSort)
      ? (rawSort as ProductSort)
      : DEFAULT_SORT;
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;

  const params: ListProductsParams = {
    page,
    limit: PAGE_SIZE,
    category: category ?? undefined,
    modality: modality.length > 0 ? modality.join(',') : undefined,
    level: level.length > 0 ? level.join(',') : undefined,
    certification: certification ? true : undefined,
    tags: tags.trim() ? tags.trim() : undefined,
    min_price: minPrice === '' ? undefined : Number(minPrice),
    max_price: maxPrice === '' ? undefined : Number(maxPrice),
    min_workload: minWorkload === '' ? undefined : Number(minWorkload),
    max_workload: maxWorkload === '' ? undefined : Number(maxWorkload),
    sort: sort === DEFAULT_SORT ? undefined : sort,
  };

  const products = useProducts(params);
  const meta = products.data?.meta;

  const activeCount =
    (category ? 1 : 0) +
    (modality.length > 0 ? 1 : 0) +
    (level.length > 0 ? 1 : 0) +
    (certification ? 1 : 0) +
    (tags.trim() ? 1 : 0) +
    (minPrice !== '' || maxPrice !== '' ? 1 : 0) +
    (minWorkload !== '' || maxWorkload !== '' ? 1 : 0) +
    (sort !== DEFAULT_SORT ? 1 : 0);

  /** Atualiza a query string e sempre volta para a página 1. */
  function updateParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === '') next.delete(key);
      else next.set(key, value);
    }
    next.delete('page');
    setSearchParams(next);
  }

  function toggleInList<T extends string>(key: string, current: T[], value: T) {
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateParams({ [key]: next.length > 0 ? next.join(',') : null });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const filtersValue = {
    category,
    modality,
    level,
    certification,
    tags,
    minPrice,
    maxPrice,
    minWorkload,
    maxWorkload,
    sort,
  };

  const filterHandlers = {
    categories: categories.data ?? [],
    categoriesLoading: categories.isLoading,
    activeCount,
    onCategory: (slug: string | null) => updateParams({ category: slug }),
    onToggleModality: (value: ProductModality) =>
      toggleInList('modality', modality, value),
    onToggleLevel: (value: ProductLevel) => toggleInList('level', level, value),
    onCertification: (value: boolean) =>
      updateParams({ certification: value ? 'true' : null }),
    onTags: (value: string) => updateParams({ tags: value }),
    onRange: (
      key: 'minPrice' | 'maxPrice' | 'minWorkload' | 'maxWorkload',
      value: string,
    ) => {
      const paramByKey: Record<typeof key, string> = {
        minPrice: 'min_price',
        maxPrice: 'max_price',
        minWorkload: 'min_workload',
        maxWorkload: 'max_workload',
      };
      updateParams({ [paramByKey[key]]: value });
    },
    onSort: (value: ProductSort) =>
      updateParams({ sort: value === DEFAULT_SORT ? null : value }),
    onClear: clearFilters,
  };

  const isBadRequest = products.error instanceof ApiError && products.error.status === 400;

  return (
    <>
      <Helmet>
        <title>Cursos | UniHorizontes</title>
        <meta
          name="description"
          content="Conheça os cursos disponíveis e faça sua matrícula."
        />
      </Helmet>

      <Container className="py-12">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Cursos</h1>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600" aria-live="polite">
            {products.isSuccess && meta
              ? `${meta.total} ${meta.total === 1 ? 'curso encontrado' : 'cursos encontrados'}`
              : 'Buscando cursos...'}
          </p>
          <div className="lg:hidden">
            <CourseFiltersToggle
              open={filtersOpen}
              activeCount={activeCount}
              onClick={() => setFiltersOpen((open) => !open)}
            />
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* Desktop: sempre visível */}
          <aside className="hidden lg:block">
            <div className="lg:sticky lg:top-24">
              <CourseFilters {...filtersValue} {...filterHandlers} />
            </div>
          </aside>

          {/* Mobile: accordion */}
          {filtersOpen ? (
            <div id="cursos-filtros" className="mb-8 lg:hidden">
              <CourseFiltersFields {...filtersValue} {...filterHandlers} />
              <Button
                variant="primary"
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full"
              >
                Aplicar
              </Button>
            </div>
          ) : null}

          <div>
            {products.isLoading ? (
              <PageLoader />
            ) : products.isError ? (
              <ErrorState
                message={
                  isBadRequest
                    ? 'Algum filtro tem um valor inválido. Ajuste os filtros e tente de novo.'
                    : 'Não foi possível carregar os cursos.'
                }
                onRetry={() => products.refetch()}
              />
            ) : products.data && products.data.items.length > 0 ? (
              <>
                <ProductGrid products={products.data.items} />
                {meta ? (
                  <Pagination
                    className="mt-10"
                    page={meta.page}
                    totalPages={meta.totalPages}
                    onChange={(nextPage) => updateParams({ page: String(nextPage) })}
                  />
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <EmptyState
                  title="Nenhum curso encontrado"
                  description="Tente ajustar os filtros."
                />
                {activeCount > 0 ? (
                  <Button variant="secondary" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
