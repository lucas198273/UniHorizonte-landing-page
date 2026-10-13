import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/format';
import type { BlogPost } from '../../types/blog';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md">
      {/* Imagem */}
      {post.cover_image_url ? (
        <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      ) : (
        <div className="aspect-[16/10] w-full bg-[#F5F7F5]" />
      )}

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags + Data */}
        <div className="flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              className="rounded-md bg-[#E8F7E5] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#3E9B42]"
            >
              {tag}
            </Badge>
          ))}
          <span className="text-xs text-slate-500">
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Título */}
        <Link
          to={`/blog/${post.slug}`}
          className="text-[17px] font-semibold leading-snug text-[#222222] transition-colors group-hover:text-[#3E9B42]"
        >
          {post.title}
        </Link>

        {/* Excerpt (opcional) */}
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        ) : null}

        {/* Seta sutil no canto (estilo protótipo) */}
        <div className="mt-auto flex justify-end pt-1">
          <Link
            to={`/blog/${post.slug}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all group-hover:bg-[#E8F7E5] group-hover:text-[#3E9B42]"
            aria-label={`Ler artigo: ${post.title}`}
          >
            
          </Link>
        </div>
      </div>
    </Card>
  );
}

