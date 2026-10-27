import { Skeleton } from '@/components/ui';
import { addDays, TODAY } from '@/lib/date';
import { formatBRL, formatNumber } from '@/lib/format';
import type { Reservation } from '@/mocks/types';

export type ReservationsSummaryProps = { reservations: Reservation[] | undefined };

const plural = (n: number, one: string, many: string) => `${formatNumber(n)} ${n === 1 ? one : many}`;

/** Resumo do período padrão (próximos 30 dias) e cancelamentos do mês corrente. */
export function ReservationsSummary({ reservations }: ReservationsSummaryProps) {
  if (!reservations) {
    return (
      <div className="flex flex-wrap gap-x-8 gap-y-2" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-5 w-40" />
        ))}
      </div>
    );
  }

  const windowEnd = addDays(TODAY, 30);
  const upcoming = reservations.filter(
    (r) => (r.status === 'confirmed' || r.status === 'pending_payment') && r.checkOut > TODAY && r.checkIn <= windowEnd,
  );
  const toReceive = upcoming.reduce((sum, r) => sum + r.total, 0);
  const pending = upcoming.filter((r) => r.status === 'pending_payment').length;
  const monthStart = `${TODAY.slice(0, 7)}-01`;
  const monthEnd = addDays(addDays(monthStart, 32).slice(0, 7) + '-01', -1);
  const cancelled = reservations.filter(
    (r) => r.status === 'cancelled' && r.checkOut > monthStart && r.checkIn <= monthEnd,
  ).length;

  const items: [string, string][] = [
    ['Próximos 30 dias:', plural(upcoming.length, 'reserva', 'reservas')],
    [formatBRL(toReceive), 'a receber'],
    [formatNumber(pending), 'aguardando pagamento'],
    [formatNumber(cancelled), cancelled === 1 ? 'cancelada no mês' : 'canceladas no mês'],
  ];

  return (
    <ul className="t-body-sm flex flex-wrap gap-x-8 gap-y-2 text-ink-2" aria-label="Resumo das reservas">
      {items.map(([a, b], i) =>
        i === 0 ? (
          <li key={i}>
            {a} <span className="font-medium text-ink">{b}</span>
          </li>
        ) : (
          <li key={i}>
            <span className="font-medium text-ink">{a}</span> {b}
          </li>
        ),
      )}
    </ul>
  );
}
