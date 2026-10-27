import { motion } from 'motion/react';
import { easeApple } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { CHANNEL_IDS, CHANNEL_NAMES } from '@/mocks/types';
import { cn } from '@/lib/cn';

export function PublishSlide({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const show = active || reduced;
  return (
    <div className="rounded-[20px] bg-bg-alt p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-semibold text-ink">Publicando Casa da Lagoa</span>
        <span className="text-[13px] text-ink-2 tabular-nums">5 de 6</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-line">
        <motion.div
          className="h-full rounded-pill bg-verde"
          initial={false}
          animate={{ width: show ? '83%' : '0%' }}
          transition={reduced ? { duration: 0 } : { duration: active ? 1.4 : 0, ease: easeApple, delay: active ? 0.2 : 0 }}
        />
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-2 sm:gap-2.5">
        {CHANNEL_IDS.map((id) => {
          const pending = id === 'vrbo';
          return (
            <li
              key={id}
              // No mobile o status desce para baixo do nome, para caber em colunas estreitas.
              className="flex flex-col items-start gap-0.5 rounded-xl bg-surface px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:py-3"
            >
              <span className="truncate text-[14px] text-ink">{CHANNEL_NAMES[id]}</span>
              <span className={cn('shrink-0 text-[12px] font-semibold', pending ? 'text-warning' : 'text-verde')}>
                {pending ? '• Em análise' : '✓ Publicado'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
