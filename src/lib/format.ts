const DATE_LOCALE = 'pt-BR';

/** Formata ISO date ("2024-05-01T...") para "1 de mai. de 2024". */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(DATE_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Formata preço para BRL. */
export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return value.toLocaleString(DATE_LOCALE, { style: 'currency', currency: 'BRL' });
}
