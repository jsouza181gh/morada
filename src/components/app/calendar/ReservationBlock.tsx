import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import type { Reservation } from '@/mocks/types';
import { channelLabel, reservationAriaLabel, type Placement } from './useTimeline';

export type ReservationBlockProps = {
  reservation: Reservation;
  placement: Placement;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const HATCH = 'repeating-linear-gradient(135deg, var(--bg-alt) 0 6px, var(--line) 6px 8px)';

/** Bloco de reserva posicionado na grade de meio-dias da linha do tempo. */
export const ReservationBlock = forwardRef<HTMLButtonElement, ReservationBlockProps>(function ReservationBlock(
  { reservation: r, placement: p, className, style, ...rest },
  ref,
) {
  const blocked = r.status === 'blocked';
  const line1 = blocked ? 'Fechado' : r.guestName;
  const line2 = blocked ? (r.note ?? 'Bloqueado por você') : channelLabel(r);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={reservationAriaLabel(r)}
      style={{ gridColumn: `${p.colStart} / ${p.colEnd}`, gridRow: 1, ...(blocked ? { backgroundImage: HATCH } : {}), ...style }}
      className={cn(
        'pointer-events-auto mx-px flex h-11 min-w-0 items-center gap-1 overflow-hidden rounded-[10px] px-2.5 text-left transition-[filter] hover:brightness-95 active:scale-[.98]',
        r.status === 'confirmed' && 'bg-verde text-on-verde',
        r.status === 'pending_payment' && 'bg-verde-soft text-ink ring-1 ring-verde ring-inset',
        blocked && 'text-ink-2',
        p.clippedStart && 'ml-0 rounded-l-none pl-1.5',
        p.clippedEnd && 'mr-0 rounded-r-none pr-1.5',
        className,
      )}
      {...rest}
    >
      {p.clippedStart && (
        <span aria-hidden="true" className="shrink-0 text-[15px] leading-none">
          ‹
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn('truncate text-[13px] leading-[17px] font-medium', blocked && 'text-ink')}>{line1}</span>
        <span className="truncate text-[12px] leading-[16px] opacity-85">{line2}</span>
      </span>
      {p.clippedEnd && (
        <span aria-hidden="true" className="shrink-0 text-[15px] leading-none">
          ›
        </span>
      )}
    </button>
  );
});
