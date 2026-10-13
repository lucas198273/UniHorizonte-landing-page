import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { BlogCategory } from '../../types/blog';

interface CategorySidebarListProps {
  categories: BlogCategory[];
  /** UUID da categoria do post atual (post.category_id). */
  activeCategoryId: string | null;
}

/**
 * Bloco "Categorias" da sidebar do Post Detail.
 * Primeiro item: "Todas as categorias" → /blog.
 * Demais: nome + chevron → /blog/categoria/:slug.
 */
export function CategorySidebarList({
  categories,
  activeCategoryId,
}: CategorySidebarListProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="border-l-4 border-green-600 pl-3 text-lg font-bold text-slate-900">
        Categorias
      </h2>

      <nav aria-label="Categorias do blog" className="mt-4">
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              to="/blog"
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100',
                activeCategoryId === null
                  ? 'bg-green-50 text-[#3E9B42]'
                  : 'text-slate-600',
              )}
              aria-current={activeCategoryId === null ? 'page' : undefined}
            >
              Todas as categorias
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </Link>
          </li>

          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <li key={cat.id}>
                <Link
                  to={`/blog/categoria/${cat.slug}`}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-100',
                    isActive
                      ? 'bg-green-50 text-[#3E9B42]'
                      : 'text-slate-600',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {cat.nome}
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-[#3E9B42]' : 'text-slate-400',
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/** Skeleton do bloco categorias. */
export function CategorySidebarListSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
      <ul className="mt-4 flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li
            key={i}
            className="h-8 animate-pulse rounded-lg bg-slate-100"
          />
        ))}
      </ul>
    </div>
  );
}
