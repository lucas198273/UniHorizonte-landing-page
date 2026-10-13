import type {
  ProductLevel,
  ProductModality,
} from '../types/product';

// Camada de apresentação: os dados vêm do domínio `Product` (backend),
// mas na tela são exibidos como "curso".

/** Modalidade do curso. `null` quando o curso não informa modalidade. */
export function modalityLabel(
  m: ProductModality | null | undefined,
): string | null {
  if (!m) return null;
  const labels: Record<ProductModality, string> = {
    presencial: 'Presencial',
    online: 'Online',
    hibrido: 'Híbrido',
  };
  return labels[m] ?? null;
}

/** Nível do curso. */
export function levelLabel(l: ProductLevel | null | undefined): string | null {
  if (!l) return null;
  const labels: Record<ProductLevel, string> = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
  };
  return labels[l] ?? null;
}

/** Carga horária formatada ("40h"). */
export function workloadLabel(
  hours: number | null | undefined,
): string | null {
  return hours ? `${hours}h` : null;
}

/** Duração em meses ("1 mês" / "6 meses"). */
export function durationLabel(
  months: number | null | undefined,
): string | null {
  if (!months) return null;
  return months === 1 ? '1 mês' : `${months} meses`;
}

/**
 * Converte URL do YouTube pro formato embed.
 * Aceita:
 *  - https://www.youtube.com/watch?v=ID
 *  - https://youtube.com/watch?v=ID
 *  - https://youtu.be/ID
 *  - https://www.youtube.com/embed/ID (já embed — retorna como está)
 *  - https://www.youtube.com/shorts/ID
 * Retorna null se a URL não for reconhecida como YouTube.
 */
export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);

    // Já é embed
    if (parsed.pathname.startsWith('/embed/')) return url;

    // youtu.be/ID
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com
    if (parsed.hostname.endsWith('youtube.com')) {
      // watch?v=ID
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;

      // /shorts/ID
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.replace('/shorts/', '').split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
}