import { useRef } from 'react';
import { motion } from 'motion/react';
import { springs, useInView } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HeroStage } from './HeroStage';
import { PriceBar } from './PriceBar';

/** Primeira dobra da landing: promessa, notebook + celular + canais e barra de preço. */
export function Hero() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stageVisible = useInView(stageRef, { once: false, amount: 'some' });

  const enter = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { ...springs.gentle, delay: i * 0.08 },
  });

  return (
    <section className="overflow-hidden bg-bg px-4 pt-14 pb-24">
      <div className="mx-auto flex max-w-[1260px] flex-col items-center text-center">
        <motion.p className="t-eyebrow text-ink" {...enter(0)}>
          Morada para anfitriões
        </motion.p>
        <motion.h1 className="t-hero mt-3 text-ink" {...enter(1)}>
          Um anúncio.
          <br />
          Todos os lugares.
        </motion.h1>
        <motion.p className="t-lead mt-6 max-w-[620px] text-ink-2" {...enter(2)}>
          Cadastre o imóvel uma vez. Publique no Airbnb, Booking.com, Vrbo e mais, com{' '}
          <strong className="font-medium text-ink">calendário e preço sincronizados</strong> em todos.
        </motion.p>

        <HeroStage ref={stageRef} />

        <PriceBar visible={stageVisible} />
      </div>
    </section>
  );
}
