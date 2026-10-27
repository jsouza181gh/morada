import { useRef } from 'react';
import { motion } from 'motion/react';
import { springs, useInView, useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';

const DAYS = 14;

/** Dias ocupados (1 a 14) por canal. */
const ROWS = [
  { label: 'Airbnb', days: [2, 3, 4] },
  { label: 'Booking.com', days: [7, 8] },
  { label: 'Vrbo', days: [11, 12, 13] },
] as const;

const MERGED = new Set<number>(ROWS.flatMap((r) => [...r.days]));

/* Geometria vertical (px) usada para calcular quanto cada célula "desce" até a linha Morada. */
const ROW_H = 20;
const ROW_GAP = 12; // gap-3
const MORADA_H = 30;
const MORADA_OFFSET = 20 + 1 + 20; // mt-5 + borda + pt-5
const MORADA_TOP = ROWS.length * ROW_H + (ROWS.length - 1) * ROW_GAP + MORADA_OFFSET;

/** Atraso (s) do início da queda de cada linha de canal. */
const ROW_DELAY = 0.3;
/** Quanto depois do início da queda a célula da Morada acende. */
const LIGHT_AFTER = 0.45;

/** Linha de canal de cada dia ocupado, para saber quando a célula Morada acende. */
const rowOfDay = new Map<number, number>();
ROWS.forEach((r, i) => r.days.forEach((d) => rowOfDay.set(d, i)));

export function CalendarMerge({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const done = reduced || inView;

  return (
    <div ref={ref} aria-hidden="true" className={cn('w-full max-w-[820px]', className)}>
      <div className="flex flex-col gap-3">
        {ROWS.map((row, r) => {
          const drop = MORADA_TOP + MORADA_H / 2 - (r * (ROW_H + ROW_GAP) + ROW_H / 2);
          return (
            <div key={row.label} className="flex h-5 items-center">
              <span className="t-body-sm w-[110px] shrink-0 truncate text-on-dark-2">{row.label}</span>
              <div className="grid min-w-0 flex-1 grid-cols-14 gap-1">
                {Array.from({ length: DAYS }, (_, i) => {
                  const day = i + 1;
                  const busy = (row.days as readonly number[]).includes(day);
                  return (
                    <div
                      key={day}
                      className={cn('relative h-5 rounded-[6px]', busy ? 'bg-on-dark' : 'bg-white/10')}
                    >
                      {busy && !reduced && (
                        <motion.span
                          className="absolute inset-0 rounded-[6px] bg-on-dark"
                          initial={{ y: 0, opacity: 0 }}
                          animate={inView ? { y: drop, opacity: [0, 0.9, 0] } : { y: 0, opacity: 0 }}
                          transition={{
                            y: { ...springs.gentle, delay: r * ROW_DELAY },
                            opacity: { duration: 0.7, times: [0, 0.15, 1], delay: r * ROW_DELAY },
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center border-t border-white/18 pt-5">
        <span className="t-body-sm w-[110px] shrink-0 font-semibold text-on-dark">Morada</span>
        <div className="grid min-w-0 flex-1 grid-cols-14 gap-1">
          {Array.from({ length: DAYS }, (_, i) => {
            const day = i + 1;
            const busy = MERGED.has(day);
            const r = rowOfDay.get(day) ?? 0;
            const indexInRow = busy ? (ROWS[r]?.days as readonly number[] | undefined)?.indexOf(day) ?? 0 : 0;
            return (
              <div key={day} className="relative h-[30px] overflow-hidden rounded-[6px] bg-white/10">
                {busy && (
                  <motion.span
                    className="absolute inset-0 rounded-[6px] bg-on-dark"
                    initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                    animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                    transition={{ ...springs.gentle, delay: r * ROW_DELAY + LIGHT_AFTER + indexInRow * 0.05 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
