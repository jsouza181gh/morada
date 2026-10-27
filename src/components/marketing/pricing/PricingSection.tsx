import { useState } from 'react';
import { SegmentedControl, Skeleton } from '@/components/ui';
import { RevealGroup, RevealItem } from '@/components/motion';
import { useMock } from '@/hooks/useMock';
import { getPlans } from '@/mocks/api';
import { cn } from '@/lib/cn';
import { PlanCard, type BillingPeriod } from './PlanCard';

const PERIOD_OPTIONS: { value: BillingPeriod; label: string }[] = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual, 2 meses grátis' },
];

export function PricingSection({ hideTitle = false }: { hideTitle?: boolean }) {
  const [period, setPeriod] = useState<BillingPeriod>('monthly');
  const { data: plans, loading } = useMock(getPlans);

  return (
    <section
      id="precos"
      aria-labelledby={hideTitle ? 'precos-titulo' : undefined}
      className={cn('bg-bg-alt px-4 pb-36', hideTitle ? 'pt-12' : 'pt-40')}
    >
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-12">
        {/* Sem título visível, mantém um h2 para a ordem h1 → h2 → h3 dos cards. */}
        {hideTitle ? (
          <h2 id="precos-titulo" className="sr-only">
            Planos
          </h2>
        ) : (
          <header className="text-center">
            <h2 className="t-section">Escolha seu plano.</h2>
            <p className="mt-4 text-[19px] leading-[28px] text-ink-2">
              Todos com os seis canais e calendário sincronizado.
            </p>
          </header>
        )}

        <SegmentedControl
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS}
          ariaLabel="Período de cobrança"
        />

        {loading || !plans ? (
          <div className="flex w-full flex-wrap items-stretch gap-5" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[520px] flex-[1_1_280px] rounded-card bg-surface" />
            ))}
          </div>
        ) : (
          <RevealGroup className="flex w-full flex-wrap items-stretch gap-5">
            {plans.map((plan) => (
              <RevealItem key={plan.id} className="flex flex-[1_1_280px]">
                <PlanCard plan={plan} period={period} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
