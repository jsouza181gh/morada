import type { ReactNode } from 'react';
import { Link } from 'react-router';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; href: string };
};

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {breadcrumb && (
          <Link to={breadcrumb.href} className="t-body-sm mb-2 inline-block text-ink-2 hover:text-ink">
            ‹ {breadcrumb.label}
          </Link>
        )}
        <h1 className="font-display text-[32px] leading-[1.1] font-medium tracking-[-0.02em] text-ink sm:text-[40px]">
          {title}
        </h1>
        {subtitle && <p className="t-body-sm mt-1 text-ink-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
