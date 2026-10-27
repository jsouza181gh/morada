import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatNumber, formatPct } from '@/lib/format';
import { ChartCard } from './ChartCard';
import type { PropertyRow } from './reportData';

/** Barras horizontais em HTML (lista semântica: o texto já é a alternativa). */
export function OccupancyByProperty({ rows }: { rows: PropertyRow[] }) {
  const reduced = useReducedMotion();
  const sorted = [...rows].sort((a, b) => b.occupancy - a.occupancy);
  return (
    <ChartCard title="Ocupação por imóvel">
      <ul className="space-y-4">
        {sorted.map((r) => (
          <li key={r.id} className="grid gap-1.5 sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-4">
            <span className="t-body-sm truncate text-ink">{r.name}</span>
            <span aria-hidden="true" className="block h-2.5 overflow-hidden rounded-pill bg-bg-alt">
              <motion.span
                className="block h-full rounded-pill bg-verde"
                initial={reduced ? false : { width: 0 }}
                animate={{ width: `${Math.round(r.occupancy * 100)}%` }}
                transition={reduced ? { duration: 0 } : springs.gentle}
              />
            </span>
            <span className="t-body-sm tabular-nums text-ink-2 sm:text-right">
              <span className="font-medium text-ink">{formatPct(r.occupancy)}</span> ·{' '}
              {formatNumber(r.occupiedNights)} {r.occupiedNights === 1 ? 'noite' : 'noites'}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
