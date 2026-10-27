import { Badge, Button } from '@/components/ui';
import { formatBRL, formatDateShort } from '@/lib/format';
import { SECTION_TITLE_CLASS } from './styles';

const PLAN = { name: 'Pro', monthly: 129, used: 7, limit: 10 };

const INVOICES = [
  { id: 'fat-2026-11', due: '2026-11-01', amount: 129 },
  { id: 'fat-2026-12', due: '2026-12-01', amount: 129 },
  { id: 'fat-2027-01', due: '2027-01-01', amount: 129 },
];

export function PlanSection() {
  const pct = Math.round((PLAN.used / PLAN.limit) * 100);
  return (
    <section aria-labelledby="secao-plano" className="space-y-5">
      <div className="rounded-lg bg-surface p-6">
        <h2 id="secao-plano" className={SECTION_TITLE_CLASS}>
          Plano e cobrança
        </h2>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="t-body-sm text-ink-2">Plano atual</p>
            <p className="mt-1 font-display text-[34px] leading-[38px] font-medium tracking-[-0.02em] text-ink">
              {PLAN.name}
            </p>
            <p className="t-body-sm mt-1 text-ink-2">{formatBRL(PLAN.monthly)} por mês</p>
          </div>
          <Button variant="secondary" href="/precos">
            Mudar de plano
          </Button>
        </div>
        <div className="mt-6">
          <p className="t-body-sm flex justify-between text-ink">
            <span id="plano-uso">Imóveis</span>
            <span className="tabular-nums">
              {PLAN.used} de {PLAN.limit} imóveis
            </span>
          </p>
          <div
            role="progressbar"
            aria-labelledby="plano-uso"
            aria-valuemin={0}
            aria-valuemax={PLAN.limit}
            aria-valuenow={PLAN.used}
            aria-valuetext={`${PLAN.used} de ${PLAN.limit} imóveis`}
            className="mt-2 h-2.5 overflow-hidden rounded-pill bg-bg-alt"
          >
            <div className="h-full rounded-pill bg-verde" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-surface p-6">
        <h3 className="text-[19px] leading-6 font-medium text-ink">Próximos vencimentos</h3>
        <ul className="mt-4 divide-y divide-line">
          {INVOICES.map((inv) => (
            <li key={inv.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="t-body-sm">
                <p className="text-ink">
                  {formatDateShort(inv.due)} {inv.due.slice(0, 4)}
                </p>
                <p className="text-ink-2">Plano {PLAN.name} · mensal</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="t-body-sm tabular-nums text-ink">{formatBRL(inv.amount)}</span>
                <Badge tone="neutral">A vencer</Badge>
                <Button variant="ghost" size="sm" disabled title="Disponível após o pagamento">
                  Baixar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
