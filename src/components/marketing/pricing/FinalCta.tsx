import { useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui';
import { useInView, useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';

const BLOCK_COUNT = 48;

/** Atraso "aleatório" determinístico (0–1,4s) por bloco: mesma sequência em todo render. */
function blockDelay(i: number): number {
  const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 1.4;
}

const BLOCKS = Array.from({ length: BLOCK_COUNT }, (_, i) => ({
  id: `b-${i}`,
  pill: (i + 1) % 5 === 0,
  delay: blockDelay(i),
}));

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <section ref={ref} id="comecar" className="relative overflow-hidden bg-surface-dark px-4 py-40 text-on-dark">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid grid-cols-12 content-center gap-3 px-4 opacity-[.08]"
      >
        {BLOCKS.map((b) =>
          reduce ? (
            <div key={b.id} className={cn('h-16 bg-on-dark', b.pill ? 'rounded-pill' : 'rounded-[14px]')} />
          ) : (
            <motion.div
              key={b.id}
              className={cn('h-16 bg-on-dark', b.pill ? 'rounded-pill' : 'rounded-[14px]')}
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: inView ? b.delay : 0, ease: 'easeOut' }}
            />
          ),
        )}
      </div>

      <div className="relative mx-auto flex max-w-[980px] flex-col items-center text-center">
        <h2 className="t-section-xl">
          Seu próximo hóspede
          <br />
          já está procurando.
        </h2>
        <p className="t-lead mt-6 max-w-[60ch] text-on-dark-2">
          Coloque o imóvel em todos os canais ainda hoje. Os primeiros 14 dias são por nossa conta.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" href="/cadastro">
            Cadastrar meu imóvel
          </Button>
          <Button variant="on-dark" size="lg" href="mailto:vendas@morada.app">
            Falar com vendas
          </Button>
        </div>
      </div>
    </section>
  );
}
