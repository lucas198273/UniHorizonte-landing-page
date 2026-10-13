import { cn } from '../../lib/cn';

/** Shape mínimo aceito pelas pills: serve BlogCategory e ProductCategory. */
export interface PillCategory {
  id: string;
  nome: string;
  slug: string;
}

interface CategoryPillsProps {
  categories: PillCategory[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
  loading?: boolean;
  /** Texto de acessibilidade do grupo. Default: "Filtrar por categoria". */
  ariaLabel?: string;
  /** Rótulo da pill de "sem filtro". Default: "Todas". */
  allLabel?: string;
}

/**
 * Pills de categoria com scroll horizontal em mobile.
 * Primeira pill "Todas" (slug = null). Reutilizada por blog e cursos.
 */
export function CategoryPills({
  categories,
  activeSlug,
  onSelect,
  loading = false,
  ariaLabel = 'Filtrar por categoria',
  allLabel = 'Todas',
}: CategoryPillsProps) {
  if (loading) {
    return <CategoryPillsSkeleton ariaLabel={ariaLabel} />;
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
    >
      <div className="flex min-w-max gap-2.5">
        <Pill
          active={activeSlug === null}
          aria-pressed={activeSlug === null}
          onClick={() => onSelect(null)}
        >
          {allLabel}
        </Pill>
        {categories.map((cat) => (
          <Pill
            key={cat.id}
            active={activeSlug === cat.slug}
            aria-pressed={activeSlug === cat.slug}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.nome}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Pill({
  active,
  'aria-pressed': ariaPressed,
  onClick,
  children,
}: {
  active: boolean;
  'aria-pressed': boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={ariaPressed}
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'border-[#3E9B42] bg-[#3E9B42] text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-[#72D45A]/40 hover:bg-[#F5F7F5] hover:text-[#222222]',
      )}
    >
      {children}
    </button>
  );
}

function CategoryPillsSkeleton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="flex min-w-max gap-2.5" aria-label={ariaLabel} role="status">
      {['w-16', 'w-24', 'w-20', 'w-28', 'w-24'].map((w, i) => (
        <div
          key={i}
          className={cn('h-8 animate-pulse rounded-full bg-slate-200', w)}
        />
      ))}
    </div>
  );
}
