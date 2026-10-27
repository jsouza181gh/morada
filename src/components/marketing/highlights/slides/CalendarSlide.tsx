import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
/** Novembro/2026: o dia 1 cai num domingo; 30 dias + 5 células vazias = grade 7×5. */
const DAYS = Array.from({ length: 35 }, (_, i) => (i < 30 ? i + 1 : null));
const BOOKED = new Set([3, 4, 5, 11, 12, 18, 19, 20, 21, 26, 27]);
const BOOKED_ORDER = [...BOOKED];

export function CalendarSlide({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const show = active || reduced;
  return (
    <div className="mx-auto w-full max-w-[344px] sm:mx-0">
      <div className="grid grid-cols-7 gap-1.5 pb-2">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-center text-[11px] text-on-dark-2">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;
          const booked = BOOKED.has(day);
          return (
            <span
              key={day}
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white/8 text-[13px] text-on-dark-2 tabular-nums sm:h-11 sm:aspect-auto"
            >
              {booked && (
                <motion.span
                  className="absolute inset-0 rounded-xl bg-on-dark"
                  initial={false}
                  animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6 }}
                  transition={
                    reduced || !active
                      ? { duration: 0 }
                      : { ...springs.snappy, delay: 0.15 + BOOKED_ORDER.indexOf(day) * 0.04 }
                  }
                />
              )}
              <span className={booked && show ? 'relative font-semibold text-surface-dark' : 'relative'}>{day}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
