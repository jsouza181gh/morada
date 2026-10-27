import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Card de gráfico: título, conteúdo visual e alternativa textual (tabela `sr-only`). */
export function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('min-w-0 rounded-lg bg-surface p-6', className)}>
      <h2 className="text-[19px] leading-6 font-medium text-ink">{title}</h2>
      {subtitle && <p className="t-body-sm mt-1 text-ink-2">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Tooltip no estilo do dashboard: card flutuante com título e linhas. */
export function TooltipCard({
  title,
  rows,
  footer,
}: {
  title: string;
  rows: { label: string; value: string; color?: string }[];
  footer?: { label: string; value: string };
}) {
  return (
    <div className="app-scope t-body-sm min-w-44 rounded-md bg-surface p-3 text-ink shadow-float">
      <p className="font-medium">{title}</p>
      <ul className="mt-2 space-y-1">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-ink-2">
              {r.color && <span aria-hidden="true" className="size-2.5 rounded-pill" style={{ background: r.color }} />}
              {r.label}
            </span>
            <span className="tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>
      {footer && (
        <p className="mt-2 flex justify-between gap-4 border-t border-line pt-2 font-medium">
          <span>{footer.label}</span>
          <span className="tabular-nums">{footer.value}</span>
        </p>
      )}
    </div>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="t-caption mt-4 flex flex-wrap gap-x-5 gap-y-2 text-ink-2" aria-hidden="true">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className="size-2.5 rounded-pill" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
