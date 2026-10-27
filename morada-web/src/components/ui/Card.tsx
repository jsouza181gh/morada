import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type CardProps = {
  tone?: 'surface' | 'alt' | 'dark';
  size?: 'landing' | 'app';
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

const tones: Record<NonNullable<CardProps['tone']>, string> = {
  surface: 'bg-surface text-ink',
  alt: 'bg-bg-alt text-ink',
  dark: 'bg-surface-dark text-on-dark',
};

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { tone = 'surface', size = 'landing', as: Tag = 'div', className, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={cn(size === 'landing' ? 'rounded-card p-8 sm:p-12' : 'rounded-lg p-6', tones[tone], className)}
      {...rest}
    />
  );
});
