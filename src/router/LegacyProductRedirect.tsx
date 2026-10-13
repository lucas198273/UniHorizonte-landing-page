import { Navigate, useParams } from 'react-router-dom';

/**
 * Redirect das URLs antigas de "produto" para as URLs públicas de "curso".
 * Mantém bookmarks e links indexados funcionando (sem 404).
 */
export function LegacyProductRedirect() {
  const { slug = '' } = useParams<{ slug: string }>();
  return <Navigate to={`/curso/${slug}`} replace />;
}