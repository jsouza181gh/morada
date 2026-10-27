import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type HeadlineProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  size?: 'hero' | 'section' | 'section-xl' | 'title';
  align?: 'center' | 'start';
  as?: 'h1' | 'h2' | 'h3';
  children?: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
} & Omit<HTMLAttributes<HTMLElement>, 'title' | 'children' | 'className'>;

const sizeClass: Record<NonNullable<HeadlineProps['size']>, string> = {
  hero: 't-hero',
  section: 't-section',
  'section-xl': 't-section-xl',
  title: 't-title',
};

export function Headline({
  eyebrow,
  title,
  size = 'section',
  align = 'center',
  as,
  children,
  className,
  tone = 'light',
  ...rest
}: HeadlineProps) {
  const Tag = as ?? (size === 'hero' ? 'h1' : 'h2');
  const dark = tone === 'dark';
  return (
    <header
      className={cn(align === 'center' ? 'mx-auto max-w-[720px] text-center' : 'text-left', className)}
      {...rest}
    >
      {eyebrow && <p className={cn('t-eyebrow mb-2', dark && 'text-on-dark')}>{eyebrow}</p>}
      <Tag className={cn(sizeClass[size], dark && 'text-on-dark')}>{title}</Tag>
      {children && (
        <p
          className={cn(
            't-lead mt-4',
            align === 'center' && 'mx-auto',
            'max-w-[60ch]',
            dark
              ? 'text-on-dark-2 [&_b]:font-medium [&_b]:text-on-dark [&_strong]:font-medium [&_strong]:text-on-dark'
              : 'text-ink-2 [&_b]:font-medium [&_b]:text-ink [&_strong]:font-medium [&_strong]:text-ink',
          )}
        >
          {children}
        </p>
      )}
    </header>
  );
}
