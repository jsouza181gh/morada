import { diffDays } from '@/lib/date';
import { formatBRL, formatNumber } from '@/lib/format';
import { CHANNEL_IDS, type ChannelId, type MonthlyMetric, type Property, type Reservation } from '@/mocks/types';

export type Period = '3' | '6' | '12';

export type GroupKey = 'airbnb' | 'booking' | 'vrbo' | 'outros';

export const GROUPS: { key: GroupKey; label: string; color: string }[] = [
  { key: 'airbnb', label: 'Airbnb', color: 'var(--verde)' },
  { key: 'booking', label: 'Booking.com', color: 'var(--verde-strong)' },
  { key: 'vrbo', label: 'Vrbo', color: 'var(--ouro)' },
  { key: 'outros', label: 'Outros', color: 'var(--line-strong)' },
];

export function groupOf(id: ChannelId): GroupKey {
  return id === 'airbnb' || id === 'booking' || id === 'vrbo' ? id : 'outros';
}

const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MONTHS_LONG = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export function monthShort(month: string): string {
  return MONTHS_SHORT[Number(month.slice(5, 7)) - 1] ?? month;
}

export function monthLong(month: string): string {
  return `${MONTHS_LONG[Number(month.slice(5, 7)) - 1] ?? month} de ${month.slice(0, 4)}`;
}

/** "R$ 20 mil" para eixos. */
export function formatBRLAxis(value: number): string {
  if (Math.abs(value) >= 1000) return `R$ ${formatNumber(value / 1000, value % 1000 === 0 ? 0 : 1)} mil`;
  return formatBRL(value);
}

export type MonthRow = {
  month: string;
  label: string;
  longLabel: string;
  total: number;
  occupancy: number;
  adr: number;
} & Record<GroupKey, number>;

export function buildMonthRows(metrics: MonthlyMetric[]): MonthRow[] {
  return metrics.map((m) => {
    const row: MonthRow = {
      month: m.month,
      label: monthShort(m.month),
      longLabel: monthLong(m.month),
      total: 0,
      occupancy: m.occupancy,
      adr: m.adr,
      airbnb: 0,
      booking: 0,
      vrbo: 0,
      outros: 0,
    };
    for (const id of CHANNEL_IDS) {
      const v = m.revenueByChannel[id];
      row[groupOf(id)] += v;
      row.total += v;
    }
    return row;
  });
}

export type PropertyRow = {
  id: string;
  name: string;
  revenue: number;
  /** Noites vendidas (reservas confirmadas com entrada no período). */
  nights: number;
  /** Noites ocupadas no período (confirmadas e aguardando pagamento). */
  occupiedNights: number;
  availableNights: number;
  occupancy: number;
  adr: number;
  rating: number;
};

function nextMonth(month: string): string {
  const [y, m] = month.split('-').map(Number) as [number, number];
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

function nightsInside(r: Reservation, first: string, next: string): number {
  const a = r.checkIn > first ? r.checkIn : first;
  const b = r.checkOut < next ? r.checkOut : next;
  return Math.max(0, diffDays(a, b));
}

/** Desempenho por imóvel nos meses dados (mesmas regras de `mocks/metrics.ts`). */
export function buildPropertyRows(months: string[], properties: Property[], reservations: Reservation[]): PropertyRow[] {
  const firstMonth = months[0];
  const lastMonth = months[months.length - 1];
  if (!firstMonth || !lastMonth) return [];
  const first = `${firstMonth}-01`;
  const next = `${nextMonth(lastMonth)}-01`;
  const days = diffDays(first, next);

  return properties.map((p) => {
    let revenue = 0;
    let nights = 0;
    let occupiedNights = 0;
    let blocked = 0;
    for (const r of reservations) {
      if (r.propertyId !== p.id) continue;
      if (r.status === 'confirmed' && r.channelId && r.checkIn >= first && r.checkIn < next) {
        revenue += r.total;
        nights += diffDays(r.checkIn, r.checkOut);
      }
      if (r.status === 'confirmed' || r.status === 'pending_payment') occupiedNights += nightsInside(r, first, next);
      if (r.status === 'blocked') blocked += nightsInside(r, first, next);
    }
    const availableNights = Math.max(0, days - blocked);
    return {
      id: p.id,
      name: p.name,
      revenue,
      nights,
      occupiedNights,
      availableNights,
      occupancy: availableNights > 0 ? Math.min(1, occupiedNights / availableNights) : 0,
      adr: nights > 0 ? Math.round(revenue / nights) : 0,
      rating: p.rating,
    };
  });
}

export type Totals = { revenue: number; nights: number; occupancy: number; adr: number; rating: number };

export function totalsOf(rows: PropertyRow[]): Totals {
  const revenue = rows.reduce((s, r) => s + r.revenue, 0);
  const nights = rows.reduce((s, r) => s + r.nights, 0);
  const occupied = rows.reduce((s, r) => s + r.occupiedNights, 0);
  const available = rows.reduce((s, r) => s + r.availableNights, 0);
  const rated = rows.filter((r) => r.rating > 0);
  return {
    revenue,
    nights,
    occupancy: available > 0 ? occupied / available : 0,
    adr: nights > 0 ? Math.round(revenue / nights) : 0,
    rating: rated.length ? rated.reduce((s, r) => s + r.rating, 0) / rated.length : 0,
  };
}
