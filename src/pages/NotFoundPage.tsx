import { Helmet } from 'react-helmet-async';
import { ButtonLink } from '../components/ui/Button';
import { Container } from '../components/ui/Container';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Página não encontrada | Blog de Viagens</title>
      </Helmet>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12 text-center">
        <p className="text-6xl font-bold text-slate-200">404</p>
        <h1 className="text-2xl font-bold text-slate-900">Página não encontrada</h1>
        <p className="text-slate-500">O endereço que você acessou não existe.</p>
        <ButtonLink to="/">Voltar ao início</ButtonLink>
      </Container>
    </>
  );
}
