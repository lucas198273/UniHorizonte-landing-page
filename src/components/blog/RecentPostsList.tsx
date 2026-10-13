import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { usePosts } from '../../hooks/usePosts';
import { formatDate } from '../../lib/format';
import type { BlogPost } from '../../types/blog';

const RECENT_LIMIT = 6;
const VISIBLE_COUNT = 5;

interface RecentPostsListProps {
  /** Post atual — excluído da listagem. */
  currentPostId: string;
}

/**
 * Bloco "Posts recentes" da sidebar do Post Detail.
 * Busca até 6 posts publicados, exclui o atual e mostra 5.
 * Se não houver posts além do atual, não renderiza nada.
 */
export function RecentPostsList({ currentPostId }: RecentPostsListProps) {
  // ⚠️ Objeto memoizado — evita queryKey nova a cada render.
  const params = useMemo(() => ({ limit: RECENT_LIMIT }), []);
  const posts = usePosts(params);

  const recent = useMemo<BlogPost[]>(() => {
    if (!posts.data) return [];
    return posts.data.items
      .filter((p) => p.id !== currentPostId)
      .slice(0, VISIBLE_COUNT);
  }, [posts.data, currentPostId]);

  if (posts.isLoading) return <RecentPostsSkeleton />;

  // Erro e vazio: omitir silenciosamente (bloco secundário da sidebar).
  if (posts.isError || !posts.data) return null;
  if (recent.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="border-l-4 border-green-600 pl-3 text-lg font-bold text-slate-900">
        Posts recentes
      </h2>

      <nav aria-label="Posts recentes" className="mt-4">
        <ul className="flex flex-col gap-4">
          {recent.map((post) => (
            <li key={post.id}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex items-start gap-3 rounded-lg p-1 transition-colors hover:bg-slate-100"
              >
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100" />
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-[#3E9B42]">
                    {post.title}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.published_at)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function RecentPostsSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
      <ul className="mt-4 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-slate-100" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}