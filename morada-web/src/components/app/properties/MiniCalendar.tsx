import { Link } from 'react-router';
import { CHANNEL_NAMES, type Reservation, type ReservationStatus } from '@/mocks/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { addDays, TODAY } from '@/lib/date';
import { formatRange } from '@/lib/format';
import { cn } from '@/lib/cn';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: 'Confirmada',
  pending_payment: 'Pagamento pendente',
  cancelled: 'Cancelada',
  blocked: 'Bloqueio',
};

const HATCH =
  'bg-[repeating-linear-gradient(135deg,var(--line-strong)_0_1.5px,transparent_1.5px_6px)] text-ink';

const DAY_CLASS: Record<Exclude<ReservationStatus, 'cancelled'>, string> = {
  confirmed: 'bg-verde text-on-verde',
  pending_payment: 'bg-verde-soft text-ink ring-1 ring-verde ring-inset',
  blocked: HATCH,
};

export type MiniCalendarProps = {
  propertyId: string;
  reservations: Reservation[];
  /** Meses 'YYYY-MM' exibidos. Default: mês de TODAY e o seguinte. */
  months?: string[];
};

function monthOf(iso: string) {
  return iso.slice(0, 7);
}

function nextMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number) as [number, number];
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

function describe(r: Reservation) {
  const who = r.status === 'blocked' ? (r.note ?? 'Fechado') : r.guestName;
  const via = r.channelId ? CHANNEL_NAMES[r.channelId] : 'Bloqueio manual';
  return `${who}, ${via}. ${STATUS_LABEL[r.status]}, ${formatRange(r.checkIn, r.checkOut)}`;
}

export function MiniCalendar({ propertyId, reservations, months }: MiniCalendarProps) {
  const shown = months ?? [monthOf(TODAY), nextMonth(monthOf(TODAY))];
  const active = reservations.filter((r) => r.propertyId === propertyId && r.status !== 'cancelled');
  const byNight = (day: string) => active.find((r) => r.checkIn <= day && day < r.checkOut);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {shown.map((ym) => (
          <Month key={ym} ym={ym} byNight={byNight} />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="t-caption flex flex-wrap gap-x-5 gap-y-2 text-ink-2" aria-label="Legenda">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 rounded-[4px] bg-verde" /> Confirmada
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3.5 rounded-[4px] bg-verde-soft ring-1 ring-verde ring-inset" />
            Pagamento pendente
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className={cn('size-3.5 rounded-[4px] ring-1 ring-line ring-inset', HATCH)} />
            Bloqueio
          </li>
        </ul>
        <Link to={`/app/calendario?imovel=${propertyId}`} className="t-body-sm text-verde hover:underline">
          Abrir calendário completo<span aria-hidden="true"> ›</span>
        </Link>
      </div>
    </div>
  );
}

function Month({ ym, byNight }: { ym: string; byNight: (day: string) => Reservation | undefined }) {
  const [y, m] = ym.split('-').map(Number) as [number, number];
  const first = `${ym}-01`;
  const lead = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => addDays(first, i));
  const title = `${MONTH_NAMES[m - 1]} ${y}`;

  return (
    <section className="rounded-lg bg-surface p-5" aria-label={title}>
      <h3 className="mb-4 text-[17px] leading-6 font-medium text-ink">{title}</h3>
      <div className="t-caption grid grid-cols-7 gap-1 text-center text-ink-2" aria-hidden="true">
        {WEEKDAYS.map((w) => (
          <span key={w} className="pb-1">
            {w}
          </span>
        ))}
      </div>
      <ol className="grid grid-cols-7 gap-1">
        {lead > 0 && <li aria-hidden="true" style={{ gridColumn: `span ${lead}` }} />}
        {days.map((day) => {
          const r = byNight(day);
          const dayNum = Number(day.slice(8));
          const isToday = day === TODAY;
          const base = cn(
            't-body-sm flex aspect-square w-full items-center justify-center rounded-sm tabular-nums',
            isToday && 'font-medium underline underline-offset-4',
          );
          if (!r || r.status === 'cancelled') {
            return (
              <li key={day}>
                <span className={cn(base, 'text-ink')} aria-current={isToday ? 'date' : undefined}>
                  {dayNum}
                </span>
              </li>
            );
          }
          const label = describe(r);
          const isStart = r.checkIn === day || day === first;
          return (
            <li key={day}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    tabIndex={isStart ? 0 : -1}
                    aria-label={`${dayNum} de ${MONTH_NAMES[m - 1]?.toLowerCase()}: ${label}`}
                    aria-current={isToday ? 'date' : undefined}
                    className={cn(base, DAY_CLASS[r.status])}
                  >
                    {dayNum}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
