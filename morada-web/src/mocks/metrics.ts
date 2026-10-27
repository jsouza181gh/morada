import { diffDays } from '@/lib/date';
import { properties } from './properties';
import { reservations } from './reservations';
import { CHANNEL_IDS, type ChannelId, type DashboardSummary, type MonthlyMetric, type Reservation } from './types';

/** 12 meses até 2026-10 (inclusivo). */
export const METRIC_MONTHS = [
  '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04',
  '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10',
];

function monthBounds(month: string): { first: string; next: string } {
  const [y, m] = month.split('-').map(Number) as [number, number];
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  return { first: `${month}-01`, next: `${ny}-${String(nm).padStart(2, '0')}-01` };
}

/** Noites de [checkIn, checkOut) que caem em [first, next). */
function nightsInside(r: Reservation, first: string, next: string): number {
  const a = r.checkIn > first ? r.checkIn : first;
  const b = r.checkOut < next ? r.checkOut : next;
  return Math.max(0, diffDays(a, b));
}

/**
 * Métrica mensal derivada das reservas:
 * - revenueByChannel: soma de `total` das reservas confirmadas com check-in no mês;
 * - occupancy: noites ocupadas (confirmadas e aguardando pagamento) no mês / noites disponíveis
 *   (noites do mês × imóveis, menos noites bloqueadas manualmente);
 * - adr: receita / noites das reservas que compõem a receita.
 */
export function computeMonth(month: string, list: Reservation[] = reservations): MonthlyMetric {
  const { first, next } = monthBounds(month);
  const revenueByChannel = Object.fromEntries(CHANNEL_IDS.map((id) => [id, 0])) as Record<ChannelId, number>;
  let revenueNights = 0;
  let occupied = 0;
  let blocked = 0;

  for (const r of list) {
    if (r.status === 'confirmed' && r.channelId && r.checkIn >= first && r.checkIn < next) {
      revenueByChannel[r.channelId] += r.total;
      revenueNights += diffDays(r.checkIn, r.checkOut);
    }
    if (r.status === 'confirmed' || r.status === 'pending_payment') occupied += nightsInside(r, first, next);
    if (r.status === 'blocked') blocked += nightsInside(r, first, next);
  }

  const revenue = CHANNEL_IDS.reduce((s, id) => s + revenueByChannel[id], 0);
  const available = diffDays(first, next) * properties.length - blocked;
  return {
    month,
    revenueByChannel,
    occupancy: available > 0 ? Math.round((occupied / available) * 1000) / 1000 : 0,
    adr: revenueNights > 0 ? Math.round(revenue / revenueNights) : 0,
  };
}

export const metrics: MonthlyMetric[] = METRIC_MONTHS.map((m) => computeMonth(m));

export function monthRevenue(m: MonthlyMetric): number {
  return CHANNEL_IDS.reduce((s, id) => s + m.revenueByChannel[id], 0);
}

const round = (n: number, digits: number) => Math.round(n * 10 ** digits) / 10 ** digits;

const oct = metrics[metrics.length - 1]!;
const sep = metrics[metrics.length - 2]!;
const reviews = properties.reduce((s, p) => s + p.reviewsCount, 0);
const rating = properties.reduce((s, p) => s + p.rating * p.reviewsCount, 0) / reviews;

/**
 * Resumo do dashboard: outubro/2026 contra setembro/2026.
 * `*DeltaPct` em fração (0.12 = +12%); `occupancyDeltaPp` em pontos percentuais (4.1 = +4,1 p.p.).
 */
export const dashboardSummary: DashboardSummary = {
  revenueMonth: monthRevenue(oct),
  revenueDeltaPct: round(monthRevenue(oct) / monthRevenue(sep) - 1, 3),
  occupancy: oct.occupancy,
  occupancyDeltaPp: round((oct.occupancy - sep.occupancy) * 100, 1),
  adr: oct.adr,
  adrDeltaPct: round(oct.adr / sep.adr - 1, 3),
  rating: round(rating, 2),
  // Não há histórico de avaliações nos mocks; variação fixa contra setembro.
  ratingDelta: 0.02,
};
