import { cn } from '../../lib/cn';
import type { ProductCategory } from '../../types/product';

interface ProductCategoryFilterProps {
  categories: ProductCategory[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function ProductCategoryFilter({
  categories,
  selected,
  onSelect,
}: ProductCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <FilterButton
        active={selected === null}
        onClick={() => onSelect(null)}
      >
        Todas
      </FilterButton>

      {categories.map((cat) => (
        <FilterButton
          key={cat.id}
          active={selected === cat.id}
          onClick={() => onSelect(cat.id)}
        >
          {cat.nome}
        </FilterButton>
      ))}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'border-[#72D45A] bg-[#E8F7E5] text-[#3E9B42] shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-[#72D45A]/40 hover:bg-[#F5F7F5] hover:text-[#222222]',
      )}
    >
      {children}
    </button>
  );
}