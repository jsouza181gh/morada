import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type SkeletonProps = { className?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'className'>;

export function Skeleton({ className, ...rest }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('rounded-md bg-bg-alt motion-safe:animate-pulse', className)} {...rest} />;
}
