import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BrowserFrame } from '@/components/mockups';
import { Badge } from '@/components/ui';
import { springs, useInView, useReducedMotion } from '@/components/motion';
import { CHANNEL_IDS, CHANNEL_NAMES } from '@/mocks/types';
import { cn } from '@/lib/cn';

const LOGIN_URLS = [
  'airbnb.com.br/hosting',
  'admin.booking.com',
  'vrbo.com/host',
  'trivago.com.br',
  'decolar.com/anunciantes',
  'expediapartnercentral.com',
];

const STAGGER = 0.07;
/** A janela da Morada surge depois da cascata da esquerda. */
const MORADA_DELAY = LOGIN_URLS.length * STAGGER + 0.35;

/** Posição de cada janela da cascata; `spread` é o estado de hover/foco (30% mais aberto). */
function windowPose(k: number, spread: boolean) {
  const sign = k % 2 === 0 ? -1 : 1;
  const rotate = sign * (1 + k * 0.4) * (spread ? 1.3 : 1);
  // Na horizontal o espaço é curto (58% + 40% ≈ 100%); limita o deslocamento extra para não vazar do cartão.
  const left = Math.min(k * 8 * (spread ? 1.3 : 1), 42);
  const top = k * 34 * (spread ? 1.3 : 1);
  return { rotate, left: `${left}%`, top };
}

function LoginBody() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="h-2 w-[60%] rounded-pill bg-bg-alt" />
      <div className="h-[22px] rounded-[6px] border border-line" />
      <div className="h-[22px] rounded-[6px] border border-line" />
    </div>
  );
}

function MoradaList() {
  return (
    <ul className="flex flex-col px-4 py-2">
      {CHANNEL_IDS.map((id) => {
        const pending = id === 'vrbo';
        return (
          <li key={id} className="flex items-center justify-between gap-3 border-b border-line py-2 last:border-b-0">
            <span className="t-body-sm truncate text-ink">{CHANNEL_NAMES[id]}</span>
            {pending ? (
              <Badge tone="warning">
                <span aria-hidden="true">•</span>
                Em análise
              </Badge>
            ) : (
              <Badge tone="verde">
                <span aria-hidden="true">✓</span>
                Publicado
              </Badge>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = useReducedMotion();
  const shown = reduced || inView;
  const [spread, setSpread] = useState(false);

  return (
    <section className="bg-bg-alt px-4 py-36">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-14">
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="t-section-xl">Seis abas a menos.</h2>
          <p className="t-lead max-w-[640px] text-ink-2">Antes, um login por canal. Agora, um painel só.</p>
        </header>

        <div ref={ref} className="flex flex-wrap gap-6">
          <figure
            className="flex min-w-0 flex-col gap-6 rounded-card bg-surface p-6 sm:p-10"
            style={{ flex: '1 1 420px' }}
            onMouseEnter={() => setSpread(true)}
            onMouseLeave={() => setSpread(false)}
          >
            <figcaption className="text-[17px] font-semibold text-ink-2">Sem a Morada</figcaption>
            <div className="relative h-[300px]" aria-hidden="true">
              {LOGIN_URLS.map((url, k) => {
                const pose = windowPose(k, spread);
                return (
                  <motion.div
                    key={url}
                    className={cn('absolute w-[58%]', k >= 4 && 'hidden sm:block')}
                    style={{ zIndex: k }}
                    initial={reduced ? false : { ...windowPose(k, false), y: -48, opacity: 0 }}
                    animate={shown ? { ...pose, y: 0, opacity: 1 } : { ...windowPose(k, false), y: -48, opacity: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            ...springs.gentle,
                            y: { ...springs.gentle, delay: k * STAGGER },
                            opacity: { duration: 0.3, delay: k * STAGGER },
                          }
                    }
                  >
                    <BrowserFrame url={url} style={{ boxShadow: '0 6px 18px rgba(0,0,0,.08)' }}>
                      <LoginBody />
                    </BrowserFrame>
                  </motion.div>
                );
              })}
            </div>
          </figure>

          <figure
            className="flex min-w-0 flex-col gap-6 rounded-card bg-surface p-6 sm:p-10"
            style={{ flex: '1 1 420px' }}
          >
            <figcaption className="text-[17px] font-semibold text-verde">Com a Morada</figcaption>
            <motion.div
              aria-hidden="true"
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
              transition={reduced ? { duration: 0 } : { ...springs.gentle, delay: MORADA_DELAY }}
            >
              <BrowserFrame url="morada.app" style={{ height: 300 }}>
                <MoradaList />
              </BrowserFrame>
            </motion.div>
          </figure>
        </div>
      </div>
    </section>
  );
}
