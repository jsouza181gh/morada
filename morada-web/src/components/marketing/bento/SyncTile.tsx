import { useRef } from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { easeApple } from '@/components/motion';

export function SyncTile() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });

  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-8">
      <motion.span
        className="inline-flex w-fit text-on-dark"
        initial={false}
        animate={{ rotate: !reduced && inView ? 360 : 0 }}
        transition={{ duration: reduced ? 0 : 1.1, delay: 0.3, ease: easeApple }}
        aria-hidden="true"
      >
        <RefreshCw size={40} strokeWidth={1.5} />
      </motion.span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[40px] leading-[44px] font-semibold tracking-[-0.025em]">Em segundos.</h3>
        <p className="t-body text-on-dark-2">Reserva entrou num canal, a data fecha nos outros.</p>
      </div>
    </div>
  );
}
