import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type PillProps = { active?: boolean; icon?: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>;

export const Pill = forwardRef<HTMLButtonElement, PillProps>(function Pill(
  { active = false, icon, className, children, type, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-pressed={active}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-pill border border-line-strong bg-surface pr-4 pl-2.5 text-[14px] font-medium text-ink transition-colors duration-200 hover:bg-bg-alt',
        !icon && 'pl-4',
        active && 'border-verde bg-verde text-on-verde hover:bg-verde',
        className,
      )}
      {...rest}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-pill border-[1.5px] border-current [&>svg]:size-3.5"
        >
          {icon}
        </span>
      )}
      {children}
    </button>
  );
});
