import type {
  ProductLevel,
  ProductModality,
  ProductSort,
} from '../../types/product';

// Camada de apresentação: consumimos `Product` do backend,
// mas exibimos como "curso" pro usuário final.

export const MODALITY_OPTIONS: readonly { value: ProductModality; label: string }[] = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'online', label: 'Online' },
  { value: 'hibrido', label: 'Híbrido' },
];

export const LEVEL_OPTIONS: readonly { value: ProductLevel; label: string }[] = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
];

export const SORT_OPTIONS: readonly { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Mais recentes' },
  { value: 'oldest', label: 'Mais antigos' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name_asc', label: 'Nome (A-Z)' },
  { value: 'name_desc', label: 'Nome (Z-A)' },
  { value: 'display_order', label: 'Ordem de exibição' },
];

export const MODALITY_VALUES: readonly ProductModality[] = MODALITY_OPTIONS.map(
  (option) => option.value,
);

export const LEVEL_VALUES: readonly ProductLevel[] = LEVEL_OPTIONS.map(
  (option) => option.value,
);

export const SORT_VALUES: readonly ProductSort[] = SORT_OPTIONS.map(
  (option) => option.value,
);

/** Ordenação padrão (mesma do backend quando `sort` não é enviado). */
export const DEFAULT_SORT: ProductSort = 'display_order';

/** "online,hibrido" -> ["online", "hibrido"], descartando valores fora do enum. */
export function parseEnumList<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
}

/** Campo numérico: mantém só dígitos; string vazia = filtro ausente. */
export function parseNumberParam(value: string | null): string {
  if (!value) return '';
  return /^\d+$/.test(value) ? value : '';
}