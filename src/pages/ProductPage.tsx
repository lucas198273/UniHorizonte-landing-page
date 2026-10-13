import { useMemo, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  Award,
  Calendar,
  Clock,
  GraduationCap,
  Hourglass,
  MapPin,
  Tag,
  User,
} from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { formatDate, formatPrice } from '../lib/format';
import {
  durationLabel,
  levelLabel,
  modalityLabel,
  toEmbedUrl,
  workloadLabel,
} from '../lib/courseLabels';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { PageLoader } from '../components/ui/Spinner';
import { ErrorState } from '../components/common/ErrorState';

/** Linha de "ícone + label + valor". Não renderiza se `value` for nulo. */
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <span className="mt-0.5 text-[#3E9642]" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const product = useProduct(slug);

  const data = product.data;

  // Todos os hooks ANTES de qualquer early return.
  const derived = useMemo(() => {
    if (!data) return null;

    const modality = modalityLabel(data.modality);
    const workload = workloadLabel(data.workload_hours);
    const duration = durationLabel(data.duration_months);
    const level = levelLabel(data.level);
    const certification = data.certification
      ? (data.certification_name ?? 'Certificado incluso')
      : null;
    const startDate = formatDate(data.start_date) || null;
    const enrollmentDeadline = formatDate(data.enrollment_deadline) || null;
    const embedUrl = toEmbedUrl(data.video_url);

    const hasInfo = Boolean(
      modality ||
        workload ||
        duration ||
        level ||
        certification ||
        startDate ||
        enrollmentDeadline,
    );

    return {
      modality,
      workload,
      duration,
      level,
      certification,
      startDate,
      enrollmentDeadline,
      embedUrl,
      hasInfo,
    };
  }, [data]);

  if (product.isLoading) return <PageLoader />;
  if (product.isError) {
    return (
      <Container className="py-12">
        <ErrorState title="Curso não encontrado" />
        <Link
          to="/cursos"
          className="mt-4 inline-block text-sm text-[#3E9642] hover:underline"
        >
          ← Voltar aos cursos
        </Link>
      </Container>
    );
  }

  if (!data || !derived) return null;

  const cover = data.images[0];

  return (
    <>
      <Helmet>
        <title>{data.meta_title ?? `${data.nome} | UniHorizontes`}</title>
        {data.meta_description ? (
          <meta name="description" content={data.meta_description} />
        ) : null}
      </Helmet>

      <Container className="py-12">
        <Link to="/cursos" className="text-sm text-[#3E9642] hover:underline">
          ← Cursos
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {cover ? (
            <img
              src={cover.url}
              alt={cover.alt || data.nome}
              className="aspect-square w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
              Sem imagem
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {data.nome}
            </h1>
            {data.preco !== null ? (
              <p className="mt-4 text-2xl font-semibold text-[#3E9642]">
                {formatPrice(data.preco)}
              </p>
            ) : null}
            {data.descricao ? (
              <p className="mt-6 whitespace-pre-line text-slate-700">
                {data.descricao}
              </p>
            ) : null}
          </div>
        </div>

        {derived.hasInfo ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Sobre o curso
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label="Modalidade"
                value={derived.modality}
              />
              <InfoItem
                icon={<Clock className="h-5 w-5" />}
                label="Carga horária"
                value={derived.workload}
              />
              <InfoItem
                icon={<Hourglass className="h-5 w-5" />}
                label="Duração"
                value={derived.duration}
              />
              <InfoItem
                icon={<GraduationCap className="h-5 w-5" />}
                label="Nível"
                value={derived.level}
              />
              <InfoItem
                icon={<Award className="h-5 w-5" />}
                label="Certificação"
                value={derived.certification}
              />
              <InfoItem
                icon={<Calendar className="h-5 w-5" />}
                label="Início das aulas"
                value={derived.startDate}
              />
              <InfoItem
                icon={<Calendar className="h-5 w-5" />}
                label="Prazo de matrícula"
                value={derived.enrollmentDeadline}
              />
            </div>

            {data.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" aria-hidden="true" />
                {data.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {data.coordinator_name ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Coordenação
            </h2>
            <div className="flex flex-col gap-5 rounded-xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
              {data.coordinator_photo_url ? (
                <img
                  src={data.coordinator_photo_url}
                  alt={data.coordinator_name}
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <User className="h-8 w-8" aria-hidden="true" />
                </span>
              )}
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {data.coordinator_name}
                </p>
                {data.coordinator_bio ? (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {data.coordinator_bio}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {derived.embedUrl ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Vídeo de apresentação
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
              <iframe
                src={derived.embedUrl}
                title={`Vídeo de apresentação do curso ${data.nome}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </section>
        ) : null}

        {data.syllabus ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900">Ementa</h2>
            <article
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: data.syllabus }}
            />
          </section>
        ) : null}

        {data.requirements ? (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold text-slate-900">Requisitos</h2>
            <p className="whitespace-pre-line text-slate-700">
              {data.requirements}
            </p>
          </section>
        ) : null}
      </Container>
    </>
  );
}