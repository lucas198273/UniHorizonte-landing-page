import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { CategoryPills } from '../blog/CategoryPills';
import { FilterPillGroup } from './FilterPillGroup';
import { LEVEL_OPTIONS, MODALITY_OPTIONS, SORT_OPTIONS } from './courseFilterOptions';
import type { ProductCategory, ProductLevel, ProductModality, ProductSort } from '../../types/product';

// Camada de apresentação: consumimos `Product` do backend,
// mas exibimos como "curso" pro usuário final.

/** Valores ativos dos filtros, já normalizados (arrays vazios = sem filtro). */
export interface CourseFiltersValue {
  category: string | null;
  modality: ProductModality[];
  level: ProductLevel[];
  certification: boolean;
  tags: string;
  minPrice: string;
  maxPrice: string;
  minWorkload: string;
  maxWorkload: string;
  sort: ProductSort;
}

interface CourseFiltersProps extends CourseFiltersValue {
  categories: ProductCategory[];
  categoriesLoading: boolean;
  activeCount: number;
  onCategory: (slug: string | null) => void;
  onToggleModality: (value: ProductModality) => void;
  onToggleLevel: (value: ProductLevel) => void;
  onCertification: (value: boolean) => void;
  onTags: (value: string) => void;
  onRange: (key: 'minPrice' | 'maxPrice' | 'minWorkload' | 'maxWorkload', value: string) => void;
  onSort: (value: ProductSort) => void;
  onClear: () => void;
  className?: string;
}

/**
 * Painel de filtros da listagem de cursos.
 * No desktop fica sempre visível na sidebar; no mobile abre em accordion.
 */
export function CourseFilters(props: CourseFiltersProps) {
  return (
    <div className={props.className}>
      <CourseFiltersFields {...props} />
    </div>
  );
}

/** Botão que alterna o painel no mobile (visível só abaixo de `lg`). */
export function CourseFiltersToggle({
  open,
  activeCount,
  onClick,
}: {
  open: boolean;
  activeCount: number;
  onClick: () => void;
}) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="cursos-filtros"
      className="w-full lg:hidden"
    >
      <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden="true" />
      {open ? 'Ocultar filtros' : 'Filtros'}
      {activeCount > 0 ? (
        <span className="ml-2 rounded-full bg-teal-700 px-2 py-0.5 text-xs text-white">
          {activeCount}
        </span>
      ) : null}
    </Button>
  );
}

export function CourseFiltersFields({
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
  categories,
  categoriesLoading,
  activeCount,
  onCategory,
  onToggleModality,
  onToggleLevel,
  onCertification,
  onTags,
  onRange,
  onSort,
  onClear,
}: CourseFiltersProps) {
  return (
    <div className="space-y-7">
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Categoria
        </h2>
        <CategoryPills
          categories={categories}
          activeSlug={category}
          onSelect={onCategory}
          loading={categoriesLoading}
          ariaLabel="Filtrar cursos por categoria"
          allLabel="Todas"
        />
      </section>

      <FilterPillGroup
        label="Modalidade"
        options={MODALITY_OPTIONS}
        selected={modality}
        onToggle={onToggleModality}
      />

      <FilterPillGroup
        label="Nível"
        options={LEVEL_OPTIONS}
        selected={level}
        onToggle={onToggleLevel}
      />

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Certificação
        </h2>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={certification}
            onChange={(event) => onCertification(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3E9B42]"
          />
          Só com certificado
        </label>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Faixa de preço (R$)
        </h2>
        <div className="flex items-center gap-2">
          <NumberField
            label="Preço mínimo"
            placeholder="mín"
            value={minPrice}
            onChange={(value) => onRange('minPrice', value)}
          />
          <span className="text-slate-400">—</span>
          <NumberField
            label="Preço máximo"
            placeholder="máx"
            value={maxPrice}
            onChange={(value) => onRange('maxPrice', value)}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Carga horária (h)
        </h2>
        <div className="flex items-center gap-2">
          <NumberField
            label="Carga horária mínima"
            placeholder="mín"
            value={minWorkload}
            onChange={(value) => onRange('minWorkload', value)}
          />
          <span className="text-slate-400">—</span>
          <NumberField
            label="Carga horária máxima"
            placeholder="máx"
            value={maxWorkload}
            onChange={(value) => onRange('maxWorkload', value)}
          />
        </div>
      </section>

      <section>
        <label
          htmlFor="cursos-tags"
          className="mb-3 block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Tags
        </label>
        <input
          id="cursos-tags"
          type="text"
          value={tags}
          onChange={(event) => onTags(event.target.value)}
          placeholder="ex: marketing, gestão"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus-visible:border-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3E9B42]"
        />
        <p className="mt-1 text-xs text-slate-500">Separe várias tags por vírgula.</p>
      </section>

      <section>
        <label
          htmlFor="cursos-sort"
          className="mb-3 block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Ordenar por
        </label>
        <select
          id="cursos-sort"
          value={sort}
          onChange={(event) => onSort(event.target.value as ProductSort)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus-visible:border-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3E9B42]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      {activeCount > 0 ? (
        <Button variant="ghost" onClick={onClear} className="w-full justify-start">
          <X className="mr-2 h-4 w-4" aria-hidden="true" />
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      inputMode="numeric"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        'w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none',
        'focus-visible:border-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#3E9B42]',
      )}
    />
  );
}