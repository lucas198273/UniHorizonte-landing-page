/**
 * Espelho fiel do envelope do backend-cm- (shared/http/HttpResponse.ts).
 * Toda rota responde com este formato.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

/** Espelho de shared/http/types.ts — `data` de uma lista paginada. */
export interface PaginatedData<T> {
  items: T[];
  meta: PaginatedMeta;
}

/** Espelho de shared/pagination/pagination.ts. */
export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
