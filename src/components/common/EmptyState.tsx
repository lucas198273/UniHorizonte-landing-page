export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}
