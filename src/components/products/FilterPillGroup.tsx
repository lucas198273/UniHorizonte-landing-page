import { cn } from '../../lib/cn';

/**
 * Grupo de pills multi-seleção para filtros de curso.
 * Os valores são strings cruas do backend (ex: "online", "iniciante").
 */
export function FilterPillGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
  className,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
  className?: string;
}) {
  return (
    <fieldset className={cn('border-0 p-0', className)}>
      <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option.value)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3E9B42]',
                active
                  ? 'border-[#3E9B42] bg-[#3E9B42] text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-[#72D45A]/40 hover:bg-[#F5F7F5] hover:text-[#222222]',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}