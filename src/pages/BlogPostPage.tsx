import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useBlogCategories, usePost } from '../hooks/usePosts';
import { formatDate } from '../lib/format';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Spinner';
import { ErrorState } from '../components/common/ErrorState';
import {
  CategorySidebarList,
  CategorySidebarListSkeleton,
} from '../components/blog/CategorySidebarList';
import { RecentPostsList } from '../components/blog/RecentPostsList';
import { RelatedProductsSection } from '../components/blog/RelatedProductsSection';

/** Estima tempo de leitura a partir do HTML do conteúdo (200 wpm). */
function estimateReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const post = usePost(slug);
  const categories = useBlogCategories();

  if (post.isLoading) return <PageLoader />;
  if (post.isError) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Post não encontrado"
          message="Verifique o endereço ou volte ao blog."
        />
        <Link
          to="/blog"
          className="mt-4 inline-block text-sm font-medium text-[#3E9642] hover:underline"
        >
          ← Voltar para o blog
        </Link>
      </Container>
    );
  }

  const data = post.data;
  if (!data) return null;

  const cover = data.cover_image_url ?? data.og_image_url;
  const readingMinutes = estimateReadingMinutes(data.content);

  // Resolve nome da categoria pelo ID (campo é `nome`, não `name`)
  const activeCategory = data.category_id
    ? categories.data?.find((c) => c.id === data.category_id) ?? null
    : null;

  return (
    <>
      <Helmet>
        <title>{data.meta_title ?? `${data.title} | Blog UniHorizontes`}</title>
        <meta
          name="description"
          content={data.meta_description ?? (data.excerpt ?? '')}
        />
        {cover ? <meta property="og:image" content={cover} /> : null}
      </Helmet>

      <Container className="max-w-7xl py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3E9642] hover:underline"
        >
          ← Voltar para o blog
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {cover ? (
              <img
                src={cover}
                alt={data.title}
                className="aspect-[16/7] w-full rounded-xl object-cover"
              />
            ) : null}

            {/* Eyebrow: barra verde + nome da categoria */}
            {activeCategory ? (
              <div className="mt-6 flex items-center gap-2">
                <span className="h-[2px] w-8 rounded-full bg-[#72D45A]" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#3E9642]">
                  {activeCategory.nome}
                </span>
              </div>
            ) : null}

            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#222222] sm:text-[34px]">
              {data.title}
            </h1>

            {data.excerpt ? (
              <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#666666]">
                {data.excerpt}
              </p>
            ) : null}

            {/* Meta: data · tempo de leitura */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[#666666]">
              {data.published_at ? (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarIcon />
                  {formatDate(data.published_at)}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon />
                {readingMinutes} min de leitura
              </span>
            </div>

            <article
              className="prose prose-slate mt-8 max-w-none
                prose-headings:font-bold prose-headings:text-[#222222]
                prose-p:text-[#444444] prose-p:leading-relaxed
                prose-a:text-[#3E9642] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#222222]"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />

            <RelatedProductsSection postId={data.id} />

            <div className="mt-12 flex flex-col items-start gap-6 rounded-2xl bg-[#F5FFF5] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                  <GraduationIcon />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#222222]">
                    Quer saber mais sobre nossos cursos?
                  </h3>
                  <p className="mt-1 text-sm text-[#666666]">
                    Conheça as opções de graduação e pós-graduação da UniHorizontes.
                  </p>
                </div>
              </div>
              <Link
                to="/cursos"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#72D45A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#5FC94B]"
              >
                Ver cursos
                <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-24">
              {categories.isLoading ? (
                <CategorySidebarListSkeleton />
              ) : (
                <CategorySidebarList
                  categories={categories.data ?? []}
                  activeCategoryId={data.category_id}
                />
              )}
              <RecentPostsList currentPostId={data.id} />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Ícones                                                             */
/* ------------------------------------------------------------------ */

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#3E9642]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M22 10 12 4 2 10l10 6 10-6Z" strokeLinejoin="round" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}