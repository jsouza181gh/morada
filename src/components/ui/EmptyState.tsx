import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>;

export function EmptyState({ title, description, action, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cn('mx-auto flex max-w-[420px] flex-col items-center px-6 py-12 text-center', className)} {...rest}>
      <p className="t-headline text-ink">{title}</p>
      {description && <p className="t-body-sm mt-2 text-ink-2">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
