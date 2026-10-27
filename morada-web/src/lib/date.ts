/** Data "hoje" fixa da aplicação (sábado). Nunca use new Date() para "hoje" na UI. */
export const TODAY = '2026-10-24';
/** Hora de referência de "agora": 15:00 em America/Sao_Paulo (UTC-3) = 18:00 UTC. */
export const NOW_ISO = '2026-10-24T18:00:00.000Z';

const DAY_MS = 86_400_000;

function toUTC(iso: string): Date {
  return new Date(iso.slice(0, 10) + 'T00:00:00Z');
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Soma n dias a uma data 'YYYY-MM-DD'. */
export function addDays(iso: string, n: number): string {
  return toISODate(new Date(toUTC(iso).getTime() + n * DAY_MS));
}

/** Diferença em dias (b - a). */
export function diffDays(a: string, b: string): number {
  return Math.round((toUTC(b).getTime() - toUTC(a).getTime()) / DAY_MS);
}

/** Todos os dias entre from e to, inclusivo. Vazio se to < from. */
export function eachDay(from: string, to: string): string[] {
  const n = diffDays(from, to);
  const out: string[] = [];
  for (let i = 0; i <= n; i++) out.push(addDays(from, i));
  return out;
}

/** Sábado ou domingo. */
export function isWeekend(iso: string): boolean {
  const day = toUTC(iso).getUTCDay();
  return day === 0 || day === 6;
}
