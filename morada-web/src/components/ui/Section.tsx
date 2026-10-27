import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type SectionProps = {
  tone?: 'white' | 'alt' | 'dark';
  id?: string;
  width?: 'text' | 'media' | 'full';
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'id'>;

const tones: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'bg-bg text-ink',
  alt: 'bg-bg-alt text-ink',
  dark: 'bg-surface-dark text-on-dark',
};

export function Section({ tone = 'white', id, width = 'text', className, children, ...rest }: SectionProps) {
  return (
    <section id={id} className={cn('py-20 sm:py-30', tones[tone], className)} {...rest}>
      {width === 'full' ? (
        children
      ) : (
        <div className={cn('mx-auto px-4', width === 'text' ? 'max-w-[980px]' : 'max-w-[1260px]')}>{children}</div>
      )}
    </section>
  );
}
