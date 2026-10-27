import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type IconButtonProps = {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'glass' | 'solid' | 'ghost';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizes: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'size-8',
  md: 'size-11',
  lg: 'size-14',
};

const variants: Record<NonNullable<IconButtonProps['variant']>, string> = {
  glass: 'bg-line/55 text-ink backdrop-blur-xl hover:bg-line/75',
  solid: 'bg-verde text-on-verde hover:bg-verde-strong',
  ghost: 'text-ink hover:bg-bg-alt',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', variant = 'glass', className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-pill transition-colors active:scale-[.96] disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0',
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
