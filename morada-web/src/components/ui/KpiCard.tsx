import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export type KpiCardProps = {
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down';
  caption?: string;
  loading?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export function KpiCard({ label, value, delta, trend, caption, loading = false, className, ...rest }: KpiCardProps) {
  const down = trend === 'down';
  return (
    <div className={cn('rounded-lg bg-surface p-6 text-ink', className)} aria-busy={loading || undefined} {...rest}>
      <p className="t-body-sm text-ink-2">{label}</p>
      {loading ? (
        <>
          <Skeleton className="mt-2 h-[38px] w-32" />
          <Skeleton className="mt-2 h-5 w-24" />
        </>
      ) : (
        <>
          <p className="mt-2 font-display text-[34px] leading-[38px] font-medium tracking-[-0.02em]">{value}</p>
          {(delta || caption) && (
            <p className="t-body-sm mt-2 font-medium">
              {delta && (
                <span className={down ? 'text-danger' : 'text-verde'}>
                  {trend && <span aria-hidden="true">{down ? '↓ ' : '↑ '}</span>}
                  {delta}
                </span>
              )}
              {delta && caption && ' '}
              {caption && <span className="font-normal text-ink-2">{caption}</span>}
            </p>
          )}
        </>
      )}
    </div>
  );
}
