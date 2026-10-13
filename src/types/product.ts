/** Espelho fiel de backend-cm-/src/modules/products (products.types.ts, productCategories.types.ts). */

export type ProductStatus = 'draft' | 'active' | 'archived';

/** Campos de curso da migration 0002_expand_products_for_courses.sql. */
export type ProductKind = 'product' | 'course';
export type ProductModality = 'presencial' | 'online' | 'hibrido';
export type ProductLevel = 'iniciante' | 'intermediario' | 'avancado';

export interface ProductImage {
  url: string;
  alt?: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  sku: string | null;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number | null;
  images: ProductImage[];
  status: ProductStatus;
  display_order: number;
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Campos de curso (backend retorna sempre, mesmo para kind = 'product').
  kind: ProductKind;
  modality: ProductModality | null;
  workload_hours: number | null;
  duration_months: number | null;
  level: ProductLevel | null;
  certification: boolean;
  certification_name: string | null;
  start_date: string | null;
  enrollment_deadline: string | null;
  syllabus: string | null;
  requirements: string | null;
  coordinator_name: string | null;
  coordinator_bio: string | null;
  coordinator_photo_url: string | null;
  video_url: string | null;
  tags: string[];
}

export interface ProductCategory {
  id: string;
  tenant_id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  parent_id: string | null;
  display_order: number;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export type ProductSort =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'display_order';

/**
 * Query string de GET /api/products.
 * Nomes iguais aos do backend (snake_case nos filtros de curso).
 */
export interface ListProductsParams {
  page?: number;
  limit?: number;
  /** UUID ou slug da categoria de produto. */
  category?: string;
  /** Multi-valor separado por vírgula (ex: "online,hibrido"). */
  modality?: string;
  /** Multi-valor separado por vírgula. */
  level?: string;
  certification?: boolean;
  /** Tags separadas por vírgula. */
  tags?: string;
  min_price?: number;
  max_price?: number;
  min_workload?: number;
  max_workload?: number;
  sort?: ProductSort;
}
