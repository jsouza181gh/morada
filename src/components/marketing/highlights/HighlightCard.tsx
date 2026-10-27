import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type HighlightTone = 'light' | 'dark';

type HighlightCardProps = {
  tone: HighlightTone;
  /** Primeira parte do título, na cor do texto. */
  title: string;
  /** Segunda parte do título, em tom secundário. */
  subtitle: string;
  /** Posição 1-based, para o leitor de tela ("2 de 5"). */
  position: number;
  total: number;
  children: ReactNode;
};

/** Card de destaque do carrossel: 720×560, claro ou escuro, com mini interface decorativa no rodapé. */
export function HighlightCard({ tone, title, subtitle, position, total, children }: HighlightCardProps) {
  const dark = tone === 'dark';
  return (
    <article
      aria-roledescription="slide"
      aria-label={`${position} de ${total}`}
      className={cn(
        'flex h-[520px] flex-col gap-8 overflow-hidden rounded-card p-8 sm:h-[560px] sm:p-12',
        dark ? 'bg-surface-dark text-on-dark' : 'bg-surface text-ink',
      )}
    >
      <h3 className="max-w-[460px] font-display text-[26px] leading-[30px] font-semibold tracking-[-0.02em] sm:text-[32px] sm:leading-[36px]">
        {title} <span className={dark ? 'text-on-dark-2' : 'text-ink-2'}>{subtitle}</span>
      </h3>
      <div aria-hidden="true" className="mt-auto">
        {children}
      </div>
    </article>
  );
}
