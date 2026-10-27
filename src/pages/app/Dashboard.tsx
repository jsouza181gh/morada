import { PageHeader } from '@/components/app/shell';
import { AttentionList } from '@/components/app/dashboard/AttentionList';
import { KpiRow } from '@/components/app/dashboard/KpiRow';
import { RevenueByChannel } from '@/components/app/dashboard/RevenueByChannel';
import { RevenueTrend } from '@/components/app/dashboard/RevenueTrend';
import { TodayPanel } from '@/components/app/dashboard/TodayPanel';
import { UpcomingArrivals } from '@/components/app/dashboard/UpcomingArrivals';
import { Button } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { addDays, TODAY } from '@/lib/date';
import { getChannels, getDashboardSummary, getMetrics, getProperties, getReservations } from '@/mocks/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Dashboard() {
  useDocumentTitle('Visão geral');
  const summary = useMock(getDashboardSummary);
  const metrics = useMock(getMetrics);
  const properties = useMock(getProperties);
  const channels = useMock(getChannels);
  // `from` é exclusivo para a saída (checkOut <= from fica de fora); começa um dia antes
  // para incluir as saídas de hoje no painel "Hoje".
  const reservations = useMock(() => getReservations({ from: addDays(TODAY, -1), to: addDays(TODAY, 14) }));

  const failed = [summary, metrics, properties, channels, reservations].filter((q) => q.error);
  const retry = () => failed.forEach((q) => q.reload());

  return (
    <>
      <PageHeader
        title="Boa tarde, Ana."
        subtitle="Sábado, 24 de outubro"
        actions={<Button href="/app/imoveis/novo">Cadastrar imóvel</Button>}
      />

      {failed.length > 0 && (
        <div
          role="alert"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-danger-soft px-6 py-4"
        >
          <p className="t-body-sm text-danger">Não foi possível carregar parte dos dados.</p>
          <Button variant="ghost" size="sm" onClick={retry}>
            Tentar de novo
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <KpiRow summary={summary.data} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
          <RevenueByChannel month={metrics.data?.at(-1)} />
          <AttentionList properties={properties.data} channels={channels.data} />
          <RevenueTrend metrics={metrics.data} />
          <TodayPanel reservations={reservations.data} properties={properties.data} />
        </div>
        <UpcomingArrivals reservations={reservations.data} properties={properties.data} />
      </div>
    </>
  );
}
