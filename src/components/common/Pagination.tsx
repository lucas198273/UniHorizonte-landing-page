import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Paginação" className={cn('flex items-center justify-center gap-1', className)}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, index) => (
        <span key={p} className="flex items-center">
          {index > 0 && p - pages[index - 1] > 1 ? (
            <span className="px-1 text-slate-400">…</span>
          ) : null}
          <button
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'min-w-9 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              p === page ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        aria-label="Próxima página"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
