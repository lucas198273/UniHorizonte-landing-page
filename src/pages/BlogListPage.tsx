import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useBlogCategories, useBlogCategory, usePosts } from '../hooks/usePosts';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { PostList } from '../components/blog/PostList';
import { CategoryFilter } from '../components/blog/CategoryFilter';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Pagination } from '../components/common/Pagination';

const PAGE_SIZE = 9;

export function BlogListPage() {
  const { slug: slugParam } = useParams<{ slug?: string }>();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const categories = useBlogCategories();

  /** slug da URL tem precedência; se não existir, cai no estado interno (null = Todas). */
  const activeSlug = slugParam ?? category;
  const activeCategory = categories.data?.find((cat) => cat.slug === activeSlug);
  const activeId = activeCategory?.id ?? null;
  const isSlugValid = !slugParam || activeCategory !== undefined;

  const categoryDetail = useBlogCategory(slugParam ?? '');

  const posts = usePosts({
    page,
    limit: PAGE_SIZE,
    category: activeId ?? undefined,
  });
  const meta = posts.data?.meta;

  function handleCategory(next: string | null) {
    setCategory(next);
    setPage(1);
  }

  function currentName() {
    if (activeCategory) return activeCategory.nome;
    if (categoryDetail.data) return categoryDetail.data.nome;
    return slugParam ?? null;
  }

  const name = currentName();

  return (
    <>
      <Helmet>
        <title>{name ? `${name} | Blog de Viagens` : 'Blog | Blog de Viagens'}</title>
        <meta name="description" content="Todos os posts do blog: roteiros, destinos e dicas." />
      </Helmet>
      <Container className="py-12">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">
          {name ? `Categoria: ${name}` : 'Blog'}
        </h1>
        {!isSlugValid ? (
          <EmptyState
            title="Categoria não encontrada"
            description="Verifique o endereço ou escolha outra categoria abaixo."
          />
        ) : null}
        {categories.data ? (
          <div className="mb-8">
            <CategoryFilter
              categories={categories.data}
              selected={activeSlug}
              onSelect={handleCategory}
            />
          </div>
        ) : null}
        {isSlugValid && posts.isLoading ? (
          <PageLoader />
        ) : isSlugValid && posts.isError ? (
          <ErrorState
            message="Não foi possível carregar os posts."
            onRetry={() => posts.refetch()}
          />
        ) : isSlugValid && posts.data && posts.data.items.length > 0 ? (
          <>
            <PostList posts={posts.data.items} />
            {meta ? (
              <Pagination
                className="mt-10"
                page={meta.page}
                totalPages={meta.totalPages}
                onChange={setPage}
              />
            ) : null}
          </>
        ) : isSlugValid ? (
          <EmptyState title="Nenhum post encontrado" description="Tente outra categoria." />
        ) : null}
      </Container>
    </>
  );
}
