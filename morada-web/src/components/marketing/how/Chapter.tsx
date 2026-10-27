import type { ReactNode } from 'react';
import { Section } from '@/components/ui';
import { Reveal } from '@/components/motion';
import { cn } from '@/lib/cn';

export type ChapterProps = {
  number: number;
  title: string;
  text: string;
  tone: 'white' | 'alt';
  /** Quando true, o mockup fica à esquerda (≥1068px). */
  reverse?: boolean;
  id?: string;
  children: ReactNode;
};

/** Capítulo da página /como-funciona: número grande, título, texto e mockup lado a lado. */
export function Chapter({ number, title, text, tone, reverse = false, id, children }: ChapterProps) {
  const headingId = `${id ?? `capitulo-${number}`}-titulo`;
  return (
    <Section tone={tone} width="media" id={id} aria-labelledby={headingId}>
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className={cn('max-w-[60ch]', reverse && 'md:order-2')}>
          <p aria-hidden="true" className="font-display text-[96px] leading-none font-semibold tracking-[-0.035em] text-verde">
            {number}
          </p>
          <h2 id={headingId} className="t-section mt-4">
            {title}
          </h2>
          <p className="t-lead mt-4 text-ink-2">{text}</p>
        </div>
        <Reveal className={cn('flex min-w-0 justify-center', reverse && 'md:order-1')}>{children}</Reveal>
      </div>
    </Section>
  );
}
