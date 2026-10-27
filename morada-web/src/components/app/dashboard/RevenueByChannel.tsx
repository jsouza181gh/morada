import { motion } from 'motion/react';
import { Skeleton } from '@/components/ui';
import { springs, useReducedMotion } from '@/components/motion';
import { formatBRL } from '@/lib/format';
import { CHANNEL_IDS, CHANNEL_NAMES, type MonthlyMetric } from '@/mocks/types';
import { cn } from '@/lib/cn';

type RevenueByChannelProps = { month: MonthlyMetric | undefined };

export function RevenueByChannel({ month }: RevenueByChannelProps) {
  const reduced = useReducedMotion();
  const rows = month
    ? CHANNEL_IDS.map((id) => ({ id, name: CHANNEL_NAMES[id], value: month.revenueByChannel[id] })).sort(
        (a, b) => b.value - a.value,
      )
    : [];
  const max = rows[0]?.value ?? 0;

  return (
    <section aria-labelledby="dash-revenue-channel" className="rounded-lg bg-surface p-6 text-ink">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 id="dash-revenue-channel" className="text-[21px] leading-7 font-medium">
          Receita por canal
        </h2>
        <p className="t-body-sm text-ink-2">Outubro</p>
      </div>

      {!month ? (
        <ul className="flex flex-col gap-4" aria-hidden="true">
          {CHANNEL_IDS.map((id) => (
            <li key={id} className="grid grid-cols-[110px_1fr_90px] items-center gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 rounded-pill" />
              <Skeleton className="ml-auto h-5 w-16" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r, i) => {
            const pct = max > 0 ? (r.value / max) * 100 : 0;
            return (
              <li key={r.id} className="grid grid-cols-[110px_1fr_90px] items-center gap-3">
                <span className="t-body-sm truncate">{r.name}</span>
                <div className="h-3 overflow-hidden rounded-pill bg-bg-alt" aria-hidden="true">
                  <motion.div
                    className={cn('h-full origin-left rounded-pill', i === 0 ? 'bg-verde' : 'bg-verde-strong/75')}
                    style={{ width: `${pct}%` }}
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ ...springs.gentle, delay: i * 0.05 }}
                  />
                </div>
                <span className="t-body-sm text-right font-medium tabular-nums">{formatBRL(r.value)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
