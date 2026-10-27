import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'link' | 'ghost' | 'on-dark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-verde text-on-verde hover:bg-verde-strong',
  secondary: 'border border-verde text-verde hover:bg-verde-soft',
  link: 'text-verde hover:underline',
  ghost: 'text-ink hover:bg-bg-alt',
  'on-dark': 'border border-on-dark-2 text-on-dark hover:bg-white/10',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-[14px] px-[15px] py-[7px]',
  md: 'text-[17px] px-[21px] py-[11px] max-sm:min-h-11',
  lg: 'text-[17px] px-7 py-4 max-sm:min-h-11',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', href, iconLeft, iconRight, fullWidth, className, children, type, ...rest },
  ref,
) {
  const classes = cn(
    'inline-flex items-center justify-center gap-1.5 rounded-pill font-sans transition-colors active:scale-[.98] disabled:pointer-events-none disabled:opacity-40 select-none',
    sizes[size],
    variants[variant],
    variant === 'link' && 'px-0',
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {iconLeft}
      {children}
      {variant === 'link' && <span aria-hidden="true"> ›</span>}
      {iconRight}
    </>
  );

  if (href) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    if (href.startsWith('/')) {
      return (
        <Link ref={ref as Ref<HTMLAnchorElement>} to={href} className={classes} {...anchorProps}>
          {content}
        </Link>
      );
    }
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  return (
    <button ref={ref as Ref<HTMLButtonElement>} type={type ?? 'button'} className={classes} {...rest}>
      {content}
    </button>
  );
});
