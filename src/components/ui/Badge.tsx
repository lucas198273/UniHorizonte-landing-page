import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800',
        className,
      )}
    >
      {children}
    </span>
  );
}
