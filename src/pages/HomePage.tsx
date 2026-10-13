import { useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useBlogCategories, usePosts } from '../hooks/usePosts';
import { useProducts } from '../hooks/useProducts';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { ButtonLink } from '../components/ui/Button';
import { CategoryPills } from '../components/blog/CategoryPills';
import { PostList } from '../components/blog/PostList';
import { ProductGrid } from '../components/products/ProductGrid';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const POSTS_LIMIT = 9;
const FEATURED_LIMIT = 3;
const PRODUCTS_LIMIT = 3;

/** Caminho do banner do hero. */
const HERO_BANNER_SRC = '/assets/bloghero.png';

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugFromUrl = searchParams.get('category');
  const categories = useBlogCategories();

  // Só aceita slug que existe no backend — evita request inútil.
  const activeSlug = useMemo(() => {
    if (!slugFromUrl) return null;
    const exists = categories.data?.some((cat) => cat.slug === slugFromUrl);
    return exists ? slugFromUrl : null;
  }, [slugFromUrl, categories.data]);

  const filteredParams = useMemo(
    () => ({ limit: POSTS_LIMIT, category: activeSlug ?? undefined }),
    [activeSlug],
  );
  const featuredParams = useMemo(
    () => ({ limit: FEATURED_LIMIT, featured: true }),
    [],
  );
  const productsParams = useMemo(() => ({ limit: PRODUCTS_LIMIT }), []);

  const filteredPosts = usePosts(filteredParams);
  const featuredPosts = usePosts(featuredParams);
  const products = useProducts(productsParams);

  const handleSelect = useCallback(
    (slug: string | null) => {
      setSearchParams(slug ? { category: slug } : {});
    },
    [setSearchParams],
  );

  return (
    <>
      <Helmet>
        <title>Início | UniHorizontes</title>
        <meta
          name="description"
          content="Conteúdos, notícias e informações que conectam você ao mundo acadêmico e ao futuro."
        />
      </Helmet>

      {/* Hero — banner fixo de fundo (1200×400) */}
      <section className="relative isolate overflow-hidden bg-[#0F2A12]">
        <img
          src={HERO_BANNER_SRC}
          alt=""
          aria-hidden="true"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />

        {/* Overlay para legibilidade do texto */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0F2A12]/95 via-[#0F2A12]/75 to-[#0F2A12]/30"
        />

        <Container className="relative min-h-[320px] py-16 sm:min-h-[400px] sm:py-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Conhecimento que amplia{' '}
              <span className="text-[#72D45A]">horizontes</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
              Aqui você encontra conteúdos, notícias e informações que conectam
              você ao mundo acadêmico e ao futuro.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/blog">Ler o blog</ButtonLink>
              <ButtonLink to="/cursos" variant="secondary">
                Ver cursos
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <section>
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Posts em destaque
          </h2>
          {featuredPosts.isLoading ? (
            <PageLoader />
          ) : featuredPosts.isError ? (
            <ErrorState
              message="Não foi possível carregar os posts."
              onRetry={() => featuredPosts.refetch()}
            />
          ) : featuredPosts.data && featuredPosts.data.items.length > 0 ? (
            <PostList posts={featuredPosts.data.items} />
          ) : (
            <EmptyState title="Nenhum post em destaque ainda" />
          )}
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Últimos Posts
          </h2>
          <div className="mb-8">
            <CategoryPills
              categories={categories.data ?? []}
              activeSlug={activeSlug}
              onSelect={handleSelect}
              loading={categories.isLoading}
            />
          </div>
          {filteredPosts.isLoading ? (
            <PageLoader />
          ) : filteredPosts.isError ? (
            <ErrorState
              message="Não foi possível carregar os posts."
              onRetry={() => filteredPosts.refetch()}
            />
          ) : filteredPosts.data && filteredPosts.data.items.length > 0 ? (
            <PostList posts={filteredPosts.data.items} />
          ) : (
            <EmptyState
              title="Nenhum post encontrado"
              description="Tente outra categoria."
            />
          )}
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold text-slate-900">
            Cursos em destaque
          </h2>
          {products.isLoading ? (
            <PageLoader />
          ) : products.isError ? (
            <ErrorState
              message="Não foi possível carregar os cursos."
              onRetry={() => products.refetch()}
            />
          ) : products.data && products.data.items.length > 0 ? (
            <ProductGrid products={products.data.items} />
          ) : (
            <EmptyState title="Nenhum curso em destaque ainda" />
          )}
        </section>
      </Container>
    </>
  );
}