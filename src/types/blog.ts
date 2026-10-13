/** Espelho fiel de backend-cm-/src/modules/blog (posts.types.ts, categories.types.ts). */

export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
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

/** PostDto do backend: BlogPost sem tenant_id. Sem projeção LIST/DETAIL — o repository usa select('*'). */
export interface BlogPost {
  id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: PostStatus;
  featured: boolean;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListBlogPostsParams {
  page?: number;
  limit?: number;
  /** UUID da categoria de blog. */
  category?: string;
  tag?: string;
  featured?: boolean;
}
