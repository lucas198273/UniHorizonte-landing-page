import { usePostProducts } from '../../hooks/usePosts';
import type { Product } from '../../types/product';
import { ProductCard } from '../products/ProductCard';
import { cn } from '../../lib/cn';

interface RelatedProductsSectionProps {
  postId: string;
  title?: string;
}

/**
 * Seção "Cursos relacionados" no Post Detail.
 * Busca GET /api/blog/posts/:id/products (data é array puro).
 * Loading: 3 skeleton cards. Vazio/erro: omitir silenciosamente.
 */
export function RelatedProductsSection({
  postId,
  title = 'Cursos relacionados',
}: RelatedProductsSectionProps) {
  // enabled só com post.id real — nunca chamar /products antes.
  const products = usePostProducts(postId);

  // Erro: omitir silenciosamente (sem toast).
  if (products.isError) {
    return null;
  }

  if (products.isLoading) {
    return (
      <section aria-labelledby="cursos-relacionados" className="mt-16">
        <h2
          id="cursos-relacionados"
          className="mb-6 text-2xl font-bold text-slate-900"
        >
          {title}
        </h2>
        <ProductGridSkeleton />
      </section>
    );
  }

  if (products.isSuccess && products.data.length > 0) {
    return (
      <section aria-labelledby="cursos-relacionados" className="mt-16">
        <h2
          id="cursos-relacionados"
          className="mb-6 text-2xl font-bold text-slate-900"
        >
          {title}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.data.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    );
  }

  // Vazio: não renderizar nada (nem título).
  return null;
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm',
          )}
        >
          <div className="aspect-square w-full animate-pulse bg-slate-100" />
          <div className="flex flex-col gap-2.5 p-5">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-24 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
