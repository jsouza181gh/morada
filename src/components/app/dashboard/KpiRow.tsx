import { KpiCard } from '@/components/ui';
import { formatBRL, formatNumber, formatPct } from '@/lib/format';
import type { DashboardSummary } from '@/mocks/types';

type KpiRowProps = { summary: DashboardSummary | undefined };

const rating2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "+11,5" / "−3,2" / "0". */
function signed(n: number, digits: number, format: (v: number) => string = (v) => formatNumber(v, digits)): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${format(Math.abs(n))}`;
}

function trendOf(n: number): 'up' | 'down' | undefined {
  if (n > 0) return 'up';
  if (n < 0) return 'down';
  return undefined;
}

export function KpiRow({ summary: s }: KpiRowProps) {
  const loading = !s;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      <KpiCard
        label="Receita de outubro"
        value={s ? formatBRL(s.revenueMonth) : ''}
        delta={s ? `${signed(s.revenueDeltaPct * 100, 1)}%` : undefined}
        trend={s ? trendOf(s.revenueDeltaPct) : undefined}
        caption="vs. setembro"
        loading={loading}
      />
      <KpiCard
        label="Ocupação"
        value={s ? formatPct(s.occupancy) : ''}
        delta={s ? `${signed(s.occupancyDeltaPp, 1)} p.p.` : undefined}
        trend={s ? trendOf(s.occupancyDeltaPp) : undefined}
        caption="vs. setembro"
        loading={loading}
      />
      <KpiCard
        label="Diária média"
        value={s ? formatBRL(s.adr) : ''}
        delta={s ? `${signed(s.adrDeltaPct * 100, 1)}%` : undefined}
        trend={s ? trendOf(s.adrDeltaPct) : undefined}
        caption="vs. setembro"
        loading={loading}
      />
      <KpiCard
        label="Avaliação média"
        value={s ? rating2.format(s.rating) : ''}
        delta={s ? signed(s.ratingDelta, 2, (v) => rating2.format(v)) : undefined}
        trend={s ? trendOf(s.ratingDelta) : undefined}
        caption="em 30 dias"
        loading={loading}
      />
    </div>
  );
}
