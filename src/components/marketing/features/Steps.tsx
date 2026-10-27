import { useRef } from 'react';
import { Section } from '@/components/ui';
import { useInView, useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';

const STEPS = [
  {
    title: 'Cadastre o imóvel.',
    text: 'Fotos, comodidades, regras e preço. Uma vez só.',
    time: 'Cerca de 20 minutos',
  },
  {
    title: 'Conecte seus canais.',
    text: 'Autorize a Morada na conta que você já tem em cada plataforma.',
    time: 'Cerca de 2 minutos por canal',
  },
  {
    title: 'Publique.',
    text: 'O anúncio entra no ar em todos. Reservas e mensagens chegam aqui.',
    time: 'Na hora',
  },
] as const;

/** Intervalo entre o acender de cada círculo (a linha leva 1,2s para encher). */
const STEP_DELAY_MS = 500;

export function Steps() {
  const listRef = useRef<HTMLOListElement>(null);
  const inView = useInView(listRef, { amount: 0.4 });
  const reduced = useReducedMotion();
  const lit = reduced || inView;

  return (
    <Section tone="alt" aria-labelledby="steps-title">
      <h2 id="steps-title" className="t-section text-center">
        No ar em uma tarde.
      </h2>

      <ol
        ref={listRef}
        className="relative mt-16 flex flex-col gap-y-10 sm:flex-row sm:flex-nowrap sm:gap-x-6"
      >
        {/* Linha conectora horizontal (a partir de 734px). No mobile, segmentos verticais por passo. */}
        <span
          aria-hidden="true"
          className="absolute top-[27px] right-7 left-7 hidden h-0.5 bg-line sm:block"
        >
          <span
            className={cn(
              'absolute inset-0 origin-left bg-verde',
              !reduced && 'transition-transform duration-[1200ms] ease-[cubic-bezier(0.3,1,0.4,1)]',
              lit ? 'scale-x-100' : 'scale-x-0',
            )}
          />
        </span>

        {STEPS.map((step, i) => {
          const last = i === STEPS.length - 1;
          return (
            <li key={step.title} className="relative flex min-w-0 gap-5 sm:flex-[1_1_260px] sm:flex-col sm:gap-0">
              {!last && (
                <span
                  aria-hidden="true"
                  className="absolute top-14 -bottom-10 left-[27px] w-0.5 bg-line sm:hidden"
                >
                  <span
                    className={cn(
                      'absolute inset-0 origin-top bg-verde',
                      !reduced && 'transition-transform duration-[600ms] ease-[cubic-bezier(0.3,1,0.4,1)]',
                      lit ? 'scale-y-100' : 'scale-y-0',
                    )}
                    style={reduced ? undefined : { transitionDelay: `${i * STEP_DELAY_MS}ms` }}
                  />
                </span>
              )}
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full font-display text-2xl font-semibold ring-2',
                  !reduced && 'transition-[background-color,color,box-shadow] duration-500',
                  !lit && 'bg-surface text-ink-2 ring-line',
                  lit && !last && 'bg-surface text-verde ring-verde',
                  lit && last && 'bg-verde text-on-verde ring-verde',
                )}
                style={reduced ? undefined : { transitionDelay: `${i * STEP_DELAY_MS}ms` }}
              >
                {i + 1}
              </span>
              <div className="flex flex-col gap-2 pt-3 sm:pt-6">
                <h3 className="text-[21px] leading-7 font-semibold tracking-[-0.01em]">{step.title}</h3>
                <p className="t-body max-w-[60ch] text-ink-2">{step.text}</p>
                <p className="t-caption text-ink-2">{step.time}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
