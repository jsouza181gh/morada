import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui';
import { springs, useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';
import { formatBRL } from '@/lib/format';
import type { Plan } from '@/mocks/types';

export type BillingPeriod = 'monthly' | 'yearly';

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

export function PlanCard({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  const reduce = useReducedMotion();
  const dark = plan.featured;
  const amount = period === 'monthly' ? plan.monthly : plan.yearly;
  const isSales = plan.id === 'anfitriao';

  return (
    <article
      id={isSales ? 'anfitriao' : undefined}
      aria-labelledby={`plano-${plan.id}`}
      className={cn(
        'relative flex flex-[1_1_280px] flex-col gap-6 rounded-card p-10',
        dark ? 'bg-surface-dark text-on-dark md:-translate-y-3' : 'bg-surface text-ink',
      )}
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 id={`plano-${plan.id}`} className="font-display text-[24px] leading-[28px] font-semibold">
            {plan.name}
          </h3>
          {plan.featured && (
            <span className="t-caption rounded-pill bg-ouro px-2.5 py-1 font-semibold text-[#3a2c05]">
              Mais escolhido
            </span>
          )}
        </div>
        <p className={cn('text-[15px] leading-[21px]', dark ? 'text-on-dark-2' : 'text-ink-2')}>{plan.description}</p>
      </header>

      <div className="relative h-[54px] overflow-hidden" aria-live="polite">
        {amount === null ? (
          <p className="font-display text-[40px] leading-[54px] font-semibold tracking-[-0.03em]">Sob consulta</p>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            <motion.p
              key={period}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={reduce ? { duration: 0 } : { ...springs.gentle, opacity: { duration: 0.3 } }}
              className="font-display text-[52px] leading-[54px] font-semibold tracking-[-0.03em] whitespace-nowrap"
            >
              {formatBRL(amount)}
              <span
                className={cn(
                  'font-sans text-[15px] font-normal tracking-normal',
                  dark ? 'text-on-dark-2' : 'text-ink-2',
                )}
              >
                {period === 'monthly' ? ' por mês' : ' por ano'}
              </span>
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15px] leading-[21px]">
            <CheckIcon className={dark ? 'text-on-dark' : 'text-verde'} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Button
          variant={plan.featured ? 'primary' : 'secondary'}
          fullWidth
          href={isSales ? 'mailto:vendas@morada.app' : `/cadastro?plano=${plan.id}`}
        >
          {plan.cta}
        </Button>
      </div>
    </article>
  );
}
