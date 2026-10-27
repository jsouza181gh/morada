import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { addDays, diffDays, eachDay, TODAY } from '@/lib/date';
import { formatRange } from '@/lib/format';
import { CHANNEL_IDS, CHANNEL_NAMES, type ChannelId, type Reservation, type ReservationStatus } from '@/mocks/types';

export type TimelineView = '2s' | 'mes';
export type ChannelFilter = ChannelId | 'todos';

export const VIEW_DAYS: Record<TimelineView, number> = { '2s': 14, mes: 30 };

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Estado do calendário (início, visão, canal, imóvel em destaque) guardado na URL. */
export function useTimeline() {
  const [params, setParams] = useSearchParams();

  const rawStart = params.get('inicio');
  const start = rawStart && ISO_RE.test(rawStart) && !Number.isNaN(Date.parse(rawStart)) ? rawStart : TODAY;
  const view: TimelineView = params.get('visao') === 'mes' ? 'mes' : '2s';
  const rawChannel = params.get('canal');
  const channel: ChannelFilter = CHANNEL_IDS.includes(rawChannel as ChannelId) ? (rawChannel as ChannelId) : 'todos';
  const propertyId = params.get('imovel') ?? undefined;

  const length = VIEW_DAYS[view];
  const end = addDays(start, length - 1);
  const days = useMemo(() => eachDay(start, end), [start, end]);

  const update = useCallback(
    (patch: Record<string, string | undefined>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === undefined) next.delete(k);
            else next.set(k, v);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const setStart = useCallback((iso: string) => update({ inicio: iso === TODAY ? undefined : iso }), [update]);
  const setView = useCallback((v: TimelineView) => update({ visao: v === '2s' ? undefined : v }), [update]);
  const setChannel = useCallback((c: ChannelFilter) => update({ canal: c === 'todos' ? undefined : c }), [update]);
  const setPropertyId = useCallback((id: string | undefined) => update({ imovel: id }), [update]);

  return {
    start,
    end,
    days,
    view,
    channel,
    propertyId,
    setStart,
    setView,
    setChannel,
    setPropertyId,
    prev: () => setStart(addDays(start, -length)),
    next: () => setStart(addDays(start, length)),
    goToday: () => setStart(TODAY),
  };
}

export type Placement = {
  /** Linha de grade inicial (1-based) na grade de meio-dias (2 subcolunas por dia). */
  colStart: number;
  /** Linha de grade final (exclusiva). */
  colEnd: number;
  clippedStart: boolean;
  clippedEnd: boolean;
};

/**
 * Posiciona a reserva na grade de meio-dias: entra na tarde do check-in (2ª metade)
 * e sai na manhã do check-out (1ª metade). Retorna null se não aparece no período.
 */
export function placeReservation(r: Pick<Reservation, 'checkIn' | 'checkOut'>, start: string, dayCount: number): Placement | null {
  const inIdx = diffDays(start, r.checkIn);
  const outIdx = diffDays(start, r.checkOut);
  if (outIdx <= 0 || inIdx >= dayCount) return null;
  const clippedStart = inIdx < 0;
  const clippedEnd = outIdx >= dayCount;
  return {
    colStart: clippedStart ? 1 : inIdx * 2 + 2,
    colEnd: clippedEnd ? dayCount * 2 + 1 : outIdx * 2 + 2,
    clippedStart,
    clippedEnd,
  };
}

/** A noite de `day` está ocupada por alguma reserva ativa. */
export function isNightTaken(reservations: Reservation[], propertyId: string, day: string): boolean {
  return reservations.some(
    (r) => r.propertyId === propertyId && r.status !== 'cancelled' && r.checkIn <= day && day < r.checkOut,
  );
}

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  confirmed: 'Confirmada',
  pending_payment: 'Aguardando pagamento',
  cancelled: 'Cancelada',
  blocked: 'Bloqueado por você',
};

export function channelLabel(r: Reservation): string {
  return r.channelId ? CHANNEL_NAMES[r.channelId] : 'Bloqueio manual';
}

const STATUS_ARIA: Record<ReservationStatus, string> = {
  confirmed: 'confirmada',
  pending_payment: 'aguardando pagamento',
  cancelled: 'cancelada',
  blocked: 'bloqueado por você',
};

export function reservationAriaLabel(r: Reservation): string {
  const who = r.status === 'blocked' ? `Fechado${r.note ? `, ${r.note}` : ''}` : `${r.guestName}, ${channelLabel(r)}`;
  return `${who}, ${formatRange(r.checkIn, r.checkOut)}, ${STATUS_ARIA[r.status]}`;
}

