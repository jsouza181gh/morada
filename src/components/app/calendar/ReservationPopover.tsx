import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Badge, type BadgeProps } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { diffDays } from '@/lib/date';
import { formatBRL, formatRange } from '@/lib/format';
import type { Reservation, ReservationStatus } from '@/mocks/types';
import { channelLabel, STATUS_LABEL } from './useTimeline';

const STATUS_TONE: Record<ReservationStatus, NonNullable<BadgeProps['tone']>> = {
  confirmed: 'verde',
  pending_payment: 'warning',
  cancelled: 'danger',
  blocked: 'neutral',
};

const STATUS_MARK: Record<ReservationStatus, string> = {
  confirmed: '✓',
  pending_payment: '•',
  cancelled: '×',
  blocked: '–',
};

export type ReservationPopoverProps = {
  reservation: Reservation;
  propertyName?: string;
  /** Elemento que abre o popover (precisa ser um `<button>` que aceite ref). */
  children: ReactNode;
};

export function ReservationPopover({ reservation: r, propertyName, children }: ReservationPopoverProps) {
  const nights = diffDays(r.checkIn, r.checkOut);
  const blocked = r.status === 'blocked';

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(18rem,calc(100vw-2rem))] gap-4 rounded-lg bg-surface p-5 text-ink shadow-float ring-1 ring-line"
      >
        <div className="min-w-0">
          <p className="truncate text-[17px] font-medium">{blocked ? 'Fechado' : r.guestName}</p>
          <p className="t-body-sm text-ink-2">
            {channelLabel(r)}
            {propertyName ? ` · ${propertyName}` : ''}
          </p>
        </div>
        <Badge tone={STATUS_TONE[r.status]} className="self-start">
          <span aria-hidden="true">{STATUS_MARK[r.status]}</span>
          {STATUS_LABEL[r.status]}
        </Badge>
        <dl className="t-body-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="text-ink-2">Datas</dt>
          <dd className="text-right">{formatRange(r.checkIn, r.checkOut)}</dd>
          <dt className="text-ink-2">Noites</dt>
          <dd className="text-right">{nights}</dd>
          {!blocked && (
            <>
              <dt className="text-ink-2">Hóspedes</dt>
              <dd className="text-right">{r.guests}</dd>
              <dt className="text-ink-2">Valor</dt>
              <dd className="text-right font-medium">{formatBRL(r.total)}</dd>
            </>
          )}
          {r.note && (
            <>
              <dt className="text-ink-2">Nota</dt>
              <dd className="text-right">{r.note}</dd>
            </>
          )}
        </dl>
        {!blocked && (
          <Link
            to={`/app/reservas?id=${encodeURIComponent(r.id)}`}
            className="t-body-sm self-start text-verde hover:underline"
          >
            Ver reserva ›
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
}
