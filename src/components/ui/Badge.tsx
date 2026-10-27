import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeProps = {
  tone?: 'neutral' | 'verde' | 'ouro' | 'warning' | 'danger' | 'dark';
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'className'>;

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-bg-alt text-ink-2',
  verde: 'bg-verde-soft text-verde',
  ouro: 'bg-ouro-soft text-ouro-ink',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  dark: 'bg-surface-dark text-on-dark',
};

export function Badge({ tone = 'neutral', children, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn('t-caption inline-flex items-center gap-1 rounded-pill px-2.5 py-1 whitespace-nowrap', tones[tone], className)}
      {...rest}
    >
      {children}
    </span>
  );
}
