import { motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type Bubble = { from: 'guest' | 'host'; meta?: string; text: string };

const BUBBLES: Bubble[] = [
  { from: 'guest', meta: 'Marina via Airbnb', text: 'Oi! Tem vaga na garagem para um carro?' },
  { from: 'host', text: 'Tem sim, Marina. A vaga é a 12, coberta.' },
  { from: 'guest', meta: 'Thomas via Booking.com', text: 'We arrive at 10 pm, is that ok?' },
];

export function InboxSlide({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const show = active || reduced;
  return (
    <div className="flex flex-col gap-2 rounded-[20px] bg-bg-alt p-4 sm:gap-3 sm:p-5">
      {BUBBLES.map((b, i) => {
        const host = b.from === 'host';
        return (
          <motion.div
            key={i}
            className={cn('flex max-w-[82%] flex-col gap-1', host ? 'items-end self-end' : 'items-start self-start')}
            initial={false}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
            transition={reduced || !active ? { duration: 0 } : { ...springs.gentle, delay: 0.15 + i * 0.35 }}
          >
            {b.meta && <span className="px-1 text-[11px] text-ink-2">{b.meta}</span>}
            <p
              className={cn(
                'px-3.5 py-2 text-[13px] leading-[18px] sm:px-4 sm:py-2.5 sm:text-[14px] sm:leading-[19px]',
                host
                  ? 'rounded-[18px_18px_6px_18px] bg-verde text-on-verde'
                  : 'rounded-[18px_18px_18px_6px] bg-surface text-ink',
              )}
            >
              {b.text}
            </p>
          </motion.div>
        );
      })}
      <div className="mt-1 flex items-center gap-2 rounded-pill bg-surface py-1.5 pr-1.5 pl-4">
        <span className="flex-1 truncate text-[14px] text-ink-2">Responder ao Thomas</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-verde text-on-verde">
          <ArrowUp size={16} strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
