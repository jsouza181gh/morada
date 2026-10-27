import type { Ref } from 'react';
import { motion } from 'motion/react';
import { LaptopFrame, PhoneFrame } from '@/components/mockups';
import { Parallax, springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FloatingChannels } from './FloatingChannels';
import { LockScreen } from './LockScreen';
import { MiniDashboard } from './MiniDashboard';

/** Atraso (s) em que o notebook começa a entrar, depois do texto do hero. */
const STAGE_DELAY = 0.3;

export function HeroStage({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Painel da Morada num notebook e um celular recebendo uma nova reserva, cercados pelos canais conectados"
      className="relative mt-12 w-full max-w-[1180px] md:h-[640px]"
    >
      <div aria-hidden="true">
        {/* Notebook: px-[7%] abaixo de 1068px reserva a folga da base (14% mais larga que a tampa). */}
        <motion.div
          className="relative z-0 mx-auto w-full max-w-[860px] px-[7%] md:px-0 md:pt-5"
          initial={reduced ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: STAGE_DELAY }}
        >
          <Parallax offset={30}>
            <LaptopFrame>
              <MiniDashboard />
            </LaptopFrame>
          </Parallax>
        </motion.div>

        {/* Celular: só no desktop */}
        <motion.div
          className="absolute top-[150px] right-[2%] z-10 hidden md:block"
          initial={reduced ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...springs.gentle, delay: STAGE_DELAY + 0.15 }}
        >
          <PhoneFrame width={238}>
            <LockScreen />
          </PhoneFrame>
        </motion.div>

        <FloatingChannels delay={STAGE_DELAY + 0.3} />
      </div>
    </div>
  );
}
