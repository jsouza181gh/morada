import { useMemo, useState } from 'react';
import { BlockDatesDialog, type BlockDatesInitial } from '@/components/app/calendar/BlockDatesDialog';
import { CalendarToolbar } from '@/components/app/calendar/CalendarToolbar';
import { Legend } from '@/components/app/calendar/Legend';
import { ReservationPopover } from '@/components/app/calendar/ReservationPopover';
import { TimelineGrid } from '@/components/app/calendar/TimelineGrid';
import { channelLabel, reservationAriaLabel, STATUS_LABEL, useTimeline } from '@/components/app/calendar/useTimeline';
import { EmptyState, Skeleton } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMock } from '@/hooks/useMock';
import { cn } from '@/lib/cn';
import { isWeekend, TODAY } from '@/lib/date';
import { formatDateShort, formatRange, formatWeekday } from '@/lib/format';
import { getProperties, getReservations } from '@/mocks/api';
import type { Property, Reservation } from '@/mocks/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Calendar() {
  useDocumentTitle('Calendário');
  const t = useTimeline();
  const { data: properties, error: propsError } = useMock(getProperties);
  const {
    data: reservations,
    error: resError,
    reload,
  } = useMock(() => getReservations({ from: t.start, to: t.end }), [t.start, t.end]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitial, setDialogInitial] = useState<BlockDatesInitial | undefined>(undefined);

  const active = useMemo(() => (reservations ?? []).filter((r) => r.status !== 'cancelled'), [reservations]);
  const visible = useMemo(
    () => (t.channel === 'todos' ? active : active.filter((r) => r.channelId === t.channel || r.channelId === null)),
    [active, t.channel],
  );

  function openDialog(initial?: BlockDatesInitial) {
    setDialogInitial(initial ?? (t.propertyId ? { propertyId: t.propertyId } : undefined));
    setDialogOpen(true);
  }

  const loading = !properties || !reservations;
  const error = propsError ?? resError;

  return (
    <div className="mx-auto max-w-[1440px]">
      <CalendarToolbar
        start={t.start}
        end={t.end}
        view={t.view}
        channel={t.channel}
        onPrev={t.prev}
        onNext={t.next}
        onToday={t.goToday}
        onViewChange={t.setView}
        onChannelChange={t.setChannel}
        onBlockDates={() => openDialog()}
      />

      {error ? (
        <div className="rounded-lg bg-surface p-6">
          <EmptyState title="Não foi possível carregar o calendário." description={error.message} />
        </div>
      ) : loading ? (
        <Skeleton className="h-[420px] w-full rounded-lg" />
      ) : (
        <>
          <div className="hidden sm:block">
            <TimelineGrid
              properties={properties}
              days={t.days}
              reservations={active}
              visibleReservations={visible}
              highlightId={t.propertyId}
              onSelectRange={(propertyId, from, to) => openDialog({ propertyId, from, to })}
            />
          </div>
          <div className="sm:hidden">
            <DayList
              properties={properties}
              days={t.days}
              reservations={visible}
              propertyId={t.propertyId ?? properties[0]?.id}
              onPropertyChange={t.setPropertyId}
            />
          </div>
          <Legend />
        </>
      )}

      {properties && (
        <BlockDatesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          properties={properties}
          initial={dialogInitial}
          onBlocked={reload}
        />
      )}
    </div>
  );
}

/** Visão mobile (< 734px): um imóvel por vez, lista de dias do período. */
function DayList({
  properties,
  days,
  reservations,
  propertyId,
  onPropertyChange,
}: {
  properties: Property[];
  days: string[];
  reservations: Reservation[];
  propertyId: string | undefined;
  onPropertyChange: (id: string) => void;
}) {
  const property = properties.find((p) => p.id === propertyId) ?? properties[0];
  const mine = reservations.filter((r) => r.propertyId === property?.id);

  if (!property) return <EmptyState title="Nenhum imóvel cadastrado." />;

  return (
    <div>
      <Select value={property.id} onValueChange={onPropertyChange}>
        <SelectTrigger
          aria-label="Imóvel"
          className="mb-4 h-12! w-full rounded-md border-line-strong bg-surface px-4 text-[17px] text-ink"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id} className="text-[17px]">
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ol className="flex flex-col gap-2" aria-label={`Dias de ${property.name}`}>
        {days.map((day) => {
          const today = day === TODAY;
          const staying = mine.filter((r) => r.checkIn <= day && day < r.checkOut);
          const leaving = mine.filter((r) => r.checkOut === day);
          return (
            <li
              key={day}
              className={cn(
                'flex gap-4 rounded-lg p-4',
                today ? 'bg-verde-soft' : isWeekend(day) ? 'bg-surface ring-1 ring-line ring-inset' : 'bg-surface',
              )}
            >
              <div className={cn('w-11 shrink-0 text-center leading-tight', today ? 'text-verde' : 'text-ink-2')}>
                <span className="block text-[12px] font-medium">{formatWeekday(day)}</span>
                <span className={cn('block text-[20px] font-medium', !today && 'text-ink')}>
                  {Number(day.slice(8))}
                </span>
                {today && <span className="t-caption block">hoje</span>}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {leaving.map((r) => (
                  <p key={`out-${r.id}`} className="t-caption text-ink-2">
                    Saída: {r.status === 'blocked' ? 'fim do bloqueio' : r.guestName}
                  </p>
                ))}
                {staying.length === 0 ? (
                  <p className="t-body-sm py-2 text-ink-2">Livre</p>
                ) : (
                  staying.map((r) => <DayCard key={r.id} reservation={r} day={day} propertyName={property.name} />)
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="sr-only">Período: {formatRange(days[0]!, days[days.length - 1]!)}</p>
    </div>
  );
}

function DayCard({
  reservation: r,
  day,
  propertyName,
}: {
  reservation: Reservation;
  day: string;
  propertyName: string;
}) {
  const blocked = r.status === 'blocked';
  return (
    <ReservationPopover reservation={r} propertyName={propertyName}>
      <button
        type="button"
        aria-label={reservationAriaLabel(r)}
        style={
          blocked
            ? { backgroundImage: 'repeating-linear-gradient(135deg, var(--bg-alt) 0 6px, var(--line) 6px 8px)' }
            : undefined
        }
        className={cn(
          'flex min-h-11 w-full flex-col rounded-[10px] px-3 py-2 text-left',
          r.status === 'confirmed' && 'bg-verde text-on-verde',
          r.status === 'pending_payment' && 'bg-verde-soft text-ink ring-1 ring-verde ring-inset',
          blocked && 'text-ink-2',
        )}
      >
        <span className={cn('truncate text-[15px] font-medium', blocked && 'text-ink')}>
          {blocked ? 'Fechado' : r.guestName}
        </span>
        <span className="truncate text-[13px] opacity-85">
          {blocked ? (r.note ?? STATUS_LABEL.blocked) : `${channelLabel(r)} · ${STATUS_LABEL[r.status]}`}
          {r.checkIn === day ? ' · chega hoje' : ` · até ${formatDateShort(r.checkOut)}`}
        </span>
      </button>
    </ReservationPopover>
  );
}
