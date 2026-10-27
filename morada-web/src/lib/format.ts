import { NOW_ISO } from './date';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;

// Intl usa espaço não separável entre "R$" e o número; normalizamos para espaço comum.
const normalizeSpaces = (s: string) => s.replace(/[  ]/g, ' ');

const brlInt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brlFull = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

/** formatBRL(1250) → "R$ 1.250"; com centavos quando não inteiro: "R$ 1.250,50". */
export function formatBRL(value: number): string {
  return normalizeSpaces(Number.isInteger(value) ? brlInt.format(value) : brlFull.format(value));
}

/** formatBRLFull(1250.5) → "R$ 1.250,50". */
export function formatBRLFull(value: number): string {
  return normalizeSpaces(brlFull.format(value));
}

/** formatPct(0.87) → "87%". */
export function formatPct(ratio: number, fractionDigits = 0): string {
  return normalizeSpaces(
    new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: fractionDigits }).format(ratio),
  );
}

/** Número inteiro pt-BR: formatNumber(12345) → "12.345". */
export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: fractionDigits }).format(value);
}

function parts(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number) as [number, number, number];
  return { y, m, d };
}

/** formatDateShort('2026-10-26') → "26 out". */
export function formatDateShort(iso: string): string {
  const { m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
}

/** formatRange('2026-10-26','2026-10-30') → "26 a 30 out"; meses diferentes → "30 out a 2 nov". */
export function formatRange(from: string, to: string): string {
  const a = parts(from);
  const b = parts(to);
  if (a.y === b.y && a.m === b.m) return `${a.d} a ${b.d} ${MONTHS[b.m - 1]}`;
  if (a.y === b.y) return `${formatDateShort(from)} a ${formatDateShort(to)}`;
  return `${formatDateShort(from)} ${a.y} a ${formatDateShort(to)} ${b.y}`;
}

/** formatWeekday('2026-10-26') → "seg". */
export function formatWeekday(iso: string): string {
  return WEEKDAYS[new Date(iso.slice(0, 10) + 'T00:00:00Z').getUTCDay()]!;
}

/** Tempo relativo a TODAY 15:00 (America/Sao_Paulo): "agora", "há 2 min", "há 3 h", "ontem", "há 4 dias", "em 2 dias". */
export function formatRelative(iso: string): string {
  const diffMs = new Date(NOW_ISO).getTime() - new Date(iso).getTime();
  const future = diffMs < 0;
  const min = Math.floor(Math.abs(diffMs) / 60_000);
  const wrap = (s: string) => (future ? `em ${s}` : `há ${s}`);
  if (min < 1) return 'agora';
  if (min < 60) return wrap(`${min} min`);
  const h = Math.floor(min / 60);
  if (h < 24) return wrap(`${h} h`);
  const days = Math.floor(h / 24);
  if (days === 1) return future ? 'amanhã' : 'ontem';
  if (days < 30) return wrap(`${days} dias`);
  const months = Math.floor(days / 30);
  if (months < 12) return wrap(months === 1 ? '1 mês' : `${months} meses`);
  const years = Math.floor(days / 365);
  return wrap(years <= 1 ? '1 ano' : `${years} anos`);
}
