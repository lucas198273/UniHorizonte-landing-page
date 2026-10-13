import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/format';
import { levelLabel, modalityLabel, workloadLabel } from '../../lib/courseLabels';
import type { Product } from '../../types/product';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

// Camada de apresentação: consumimos `Product` do backend,
// mas exibimos como "curso" pro usuário final.
export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0]?.url;

  const badges = [
    modalityLabel(product.modality),
    workloadLabel(product.workload_hours),
    levelLabel(product.level),
  ].filter((value): value is string => Boolean(value));
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md">
      {/* Imagem */}
      <Link to={`/curso/${product.slug}`} className="block overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={product.images[0]?.alt ?? product.nome}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-[#F5F7F5] text-sm text-slate-400">
            Sem imagem
          </div>
        )}
      </Link>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <Link
          to={`/curso/${product.slug}`}
          className="text-[16px] font-semibold leading-snug text-[#222222] transition-colors group-hover:text-[#3E9B42]"
        >
          {product.nome}
        </Link>

        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <Badge key={badge} className="bg-slate-100 text-slate-700">
                {badge}
              </Badge>
            ))}
          </div>
        ) : null}

        {product.descricao ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {product.descricao}
          </p>
        ) : null}

        <div className="mt-auto pt-1">
          {product.preco !== null ? (
            <span className="text-base font-semibold text-[#3E9B42]">
              {formatPrice(product.preco)}
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-400">
              Consulte
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}