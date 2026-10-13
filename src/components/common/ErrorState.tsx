import { Button } from '../ui/Button';

export function ErrorState({
  title = 'Algo deu errado',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border-red-200 bg-red-50 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-red-800">{title}</p>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
