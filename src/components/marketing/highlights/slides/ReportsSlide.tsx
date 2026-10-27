import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { metrics } from '@/mocks/metrics';

type Column = { label: string; airbnb: number; booking: number; others: number };

const LABELS = ['mai', 'jun', 'jul', 'ago', 'set', 'out'];
const MONTHS = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];

/** Valores proporcionais crescentes, usados se o mock não tiver receita nesses meses. */
const FALLBACK: Column[] = LABELS.map((label, i) => ({
  label,
  airbnb: 40 + i * 9,
  booking: 26 + i * 6,
  others: 14 + i * 4,
}));

function buildColumns(): Column[] {
  const cols = MONTHS.map((month, i) => {
    const r = metrics.find((m) => m.month === month)?.revenueByChannel;
    if (!r) return null;
    return {
      label: LABELS[i]!,
      airbnb: r.airbnb,
      booking: r.booking,
      others: r.vrbo + r.trivago + r.decolar + r.expedia,
    };
  });
  if (cols.some((c) => c === null)) return FALLBACK;
  const valid = cols as Column[];
  return valid.every((c) => c.airbnb + c.booking + c.others > 0) ? valid : FALLBACK;
}

const COLUMNS = buildColumns();
const MAX = Math.max(...COLUMNS.map((c) => c.airbnb + c.booking + c.others));

export function ReportsSlide({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const show = active || reduced;
  return (
    <div className="grid h-[220px] grid-cols-6 items-end gap-2 sm:h-[260px] sm:gap-3">
      {COLUMNS.map((c, i) => {
        const total = c.airbnb + c.booking + c.others;
        const pct = (total / MAX) * 100;
        // Blocos de baixo para cima: Airbnb, Booking.com, outros.
        const parts = [
          { key: 'others', value: c.others, cls: 'bg-white/25' },
          { key: 'booking', value: c.booking, cls: 'bg-on-dark-2' },
          { key: 'airbnb', value: c.airbnb, cls: 'bg-on-dark' },
        ];
        return (
          <div key={c.label} className="flex h-full flex-col items-stretch justify-end gap-2">
            <motion.div
              className="flex origin-bottom flex-col gap-[3px]"
              // A linha de rótulos (h-5 + gap-2) completa a altura total.
              style={{ height: `calc((100% - 28px) * ${pct / 100})` }}
              initial={false}
              animate={{ scaleY: show ? 1 : 0.08, opacity: show ? 1 : 0.4 }}
              transition={reduced || !active ? { duration: 0 } : { ...springs.gentle, delay: 0.1 + i * 0.06 }}
            >
              {parts.map((p) => (
                <div key={p.key} className={`min-h-1 rounded-[8px] ${p.cls}`} style={{ flexGrow: p.value, flexBasis: 0 }} />
              ))}
            </motion.div>
            <span className="h-5 text-center text-[12px] text-on-dark-2">{c.label}</span>
          </div>
        );
      })}
    </div>
  );
}
