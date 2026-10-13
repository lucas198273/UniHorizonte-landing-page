import { Helmet } from 'react-helmet-async';
import { useRouteError } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { ApiError } from '../lib/errors';

/**
 * errorElement raiz — captura erros de roteamento e erros lançados
 * durante a renderização das páginas.
 */
export function ErrorPage() {
  const error = useRouteError();

  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Ocorreu um erro inesperado.';

  return (
    <>
      <Helmet>
        <title>Erro | Blog de Viagens</title>
      </Helmet>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Ops! Algo deu errado</h1>
        <p className="text-slate-500">{message}</p>
        <ButtonLink to="/">Voltar ao início</ButtonLink>
      </Container>
    </>
  );
}
