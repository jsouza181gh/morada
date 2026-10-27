import { forwardRef, type KeyboardEvent } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';
import { isWeekend, TODAY } from '@/lib/date';
import { formatDateShort, formatWeekday } from '@/lib/format';
import type { Property, Reservation } from '@/mocks/types';
import { ReservationBlock } from './ReservationBlock';
import { ReservationPopover } from './ReservationPopover';
import { placeReservation } from './useTimeline';

export type TimelineRowProps = {
  property: Property;
  rowIndex: number;
  days: string[];
  /** Reservas visíveis desta linha (já filtradas por canal, sem canceladas). */
  reservations: Reservation[];
  /** `true` quando o dia pode ser bloqueado (noite livre e não está no passado). */
  free: boolean[];
  highlighted: boolean;
  scrolled: boolean;
  selection: [number, number] | null;
  focusCol: number | null;
  onCellPointerDown: (row: number, col: number) => void;
  onCellPointerEnter: (row: number, col: number) => void;
  /** Toque (touch) numa célula: abre o bloqueio de um dia. */
  onCellTap: (row: number, col: number) => void;
  onCellKeyDown: (e: KeyboardEvent<HTMLButtonElement>, row: number, col: number) => void;
  onCellFocus: (row: number, col: number) => void;
};

export const TimelineRow = forwardRef<HTMLDivElement, TimelineRowProps>(function TimelineRow(
  {
    property,
    rowIndex,
    days,
    reservations,
    free,
    highlighted,
    scrolled,
    selection,
    focusCol,
    onCellPointerDown,
    onCellPointerEnter,
    onCellTap,
    onCellKeyDown,
    onCellFocus,
  },
  ref,
) {
  const n = days.length;

  return (
    <div ref={ref} role="group" aria-label={property.name} className="flex h-[68px] border-b border-line last:border-b-0">
      <div
        className={cn(
          'sticky left-0 z-10 flex w-[180px] shrink-0 flex-col justify-center bg-surface px-4 transition-shadow',
          scrolled && 'shadow-[6px_0_10px_-6px_rgba(0,0,0,0.18)]',
          highlighted && 'bg-verde-soft',
        )}
      >
        {highlighted && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-r-pill bg-verde" />}
        <Link
          to={`/app/imoveis/${property.id}`}
          className="t-body-sm truncate font-medium text-ink hover:text-verde hover:underline"
        >
          {property.name}
        </Link>
        <span className="t-caption truncate text-ink-2">{property.city}</span>
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {days.map((day, col) => {
            const selected = selection !== null && col >= selection[0] && col <= selection[1];
            const isToday = day === TODAY;
            const canBlock = free[col] ?? false;
            return (
              <button
                key={day}
                type="button"
                data-cell={`${rowIndex}-${col}`}
                tabIndex={focusCol === col ? 0 : -1}
                aria-label={`${formatWeekday(day)} ${formatDateShort(day)}, ${canBlock ? 'livre' : day < TODAY ? 'passado' : 'ocupado'}`}
                aria-pressed={selected}
                onPointerDown={(e) => {
                  if (e.button !== 0 || e.pointerType === 'touch') return;
                  e.preventDefault();
                  e.currentTarget.focus();
                  onCellPointerDown(rowIndex, col);
                }}
                onPointerUp={(e) => {
                  if (e.pointerType === 'touch') onCellTap(rowIndex, col);
                }}
                onPointerEnter={() => onCellPointerEnter(rowIndex, col)}
                onKeyDown={(e) => onCellKeyDown(e, rowIndex, col)}
                onFocus={() => onCellFocus(rowIndex, col)}
                className={cn(
                  'h-full border-l border-line outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-verde',
                  isWeekend(day) && 'bg-bg-alt',
                  isToday && 'bg-verde-soft',
                  canBlock ? 'cursor-cell' : 'cursor-default',
                  selected && 'bg-verde/25',
                )}
              />
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-0 grid items-center"
          style={{ gridTemplateColumns: `repeat(${n * 2}, minmax(0, 1fr))` }}
        >
          {reservations.map((r) => {
            const p = placeReservation(r, days[0]!, n);
            if (!p) return null;
            return (
              <ReservationPopover key={r.id} reservation={r} propertyName={property.name}>
                <ReservationBlock reservation={r} placement={p} />
              </ReservationPopover>
            );
          })}
        </div>
      </div>
    </div>
  );
});
