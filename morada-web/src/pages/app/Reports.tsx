import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/app/shell';
import {
  AdrChart,
  buildMonthRows,
  buildPropertyRows,
  ChannelShareChart,
  OccupancyByProperty,
  PropertyPerformanceTable,
  RevenueByChannelChart,
  totalsOf,
  type Period,
} from '@/components/app/reports';
import { Button, EmptyState, KpiCard, SegmentedControl, Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { formatBRL, formatNumber, formatPct } from '@/lib/format';
import { getMetrics, getProperties, getReservations } from '@/mocks/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const PERIODS: { value: Period; label: string }[] = [
  { value: '3', label: '3 meses' },
  { value: '6', label: '6 meses' },
  { value: '12', label: '12 meses' },
];

const loadAll = () => Promise.all([getMetrics(), getProperties(), getReservations()]);

export default function Reports() {
  useDocumentTitle('Relatórios');
  const [period, setPeriod] = useState<Period>('12');
  const { data, loading, error } = useMock(loadAll);

  const view = useMemo(() => {
    if (!data) return undefined;
    const [metrics, properties, reservations] = data;
    const slice = metrics.slice(-Number(period));
    const months = buildMonthRows(slice);
    const props = buildPropertyRows(
      slice.map((m) => m.month),
      properties,
      reservations,
    );
    return { months, props, totals: totalsOf(props) };
  }, [data, period]);

  const caption = `nos últimos ${period} meses`;

  return (
    <>
      <PageHeader
        title="Relatórios"
        actions={
          <>
            <SegmentedControl value={period} onChange={setPeriod} options={PERIODS} ariaLabel="Período do relatório" />
            <Button
              variant="secondary"
              iconLeft={<Download size={18} strokeWidth={1.5} aria-hidden="true" />}
              onClick={() => toast('Exportação chega na próxima versão.')}
            >
              Exportar PDF
            </Button>
          </>
        }
      />

      {error ? (
        <EmptyState title="Não foi possível carregar os relatórios." description="Tente de novo em instantes." />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            <KpiCard
              label="Receita total"
              value={view ? formatBRL(view.totals.revenue) : ''}
              caption={caption}
              loading={loading || !view}
            />
            <KpiCard
              label="Noites vendidas"
              value={view ? formatNumber(view.totals.nights) : ''}
              caption={caption}
              loading={loading || !view}
            />
            <KpiCard
              label="Ocupação média"
              value={view ? formatPct(view.totals.occupancy) : ''}
              caption={caption}
              loading={loading || !view}
            />
            <KpiCard
              label="Diária média"
              value={view ? formatBRL(view.totals.adr) : ''}
              caption={caption}
              loading={loading || !view}
            />
          </div>

          {!view ? (
            <div className="space-y-5" aria-busy="true">
              <Skeleton className="h-[420px] rounded-lg" />
              <Skeleton className="h-[320px] rounded-lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
                <RevenueByChannelChart rows={view.months} />
                <ChannelShareChart rows={view.months} />
              </div>
              <OccupancyByProperty rows={view.props} />
              <AdrChart rows={view.months} />
              <PropertyPerformanceTable rows={view.props} />
            </>
          )}
        </div>
      )}
    </>
  );
}
