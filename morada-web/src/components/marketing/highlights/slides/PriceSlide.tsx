import { motion } from 'motion/react';
import { easeApple } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { channels } from '@/mocks/channels';
import { channelPrice } from '@/mocks/properties';
import { CHANNEL_NAMES, type ChannelId } from '@/mocks/types';
import { formatBRL } from '@/lib/format';

const NET = 480;
const LISTED: ChannelId[] = ['airbnb', 'booking', 'vrbo', 'decolar', 'expedia'];
/** Valores da task, usados se o mock de canais não tiver a taxa. */
const FALLBACK: Record<string, number> = { airbnb: 495, booking: 565, vrbo: 505, decolar: 545, expedia: 565 };

const ROWS = LISTED.map((id) => {
  const fee = channels.find((c) => c.id === id)?.feePct;
  return { id, name: CHANNEL_NAMES[id], price: fee === undefined ? FALLBACK[id]! : channelPrice(NET, fee) };
});

export function PriceSlide({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const show = active || reduced;
  const fill = show ? '58%' : '20%';
  const transition = reduced || !active ? { duration: 0 } : { duration: 1.1, ease: easeApple, delay: 0.2 };
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:items-end sm:gap-6">
      <div className="rounded-[20px] bg-bg-alt p-4 sm:p-6">
        <p className="text-[13px] text-ink-2">Quero receber por noite</p>
        <p className="mt-1 font-display text-[36px] leading-none font-medium tracking-[-0.03em] text-ink tabular-nums sm:text-[48px]">
          {formatBRL(NET)}
        </p>
        <div className="relative mt-4 mb-2 h-1.5 rounded-pill bg-line sm:mt-7 sm:mb-0">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-pill bg-verde"
            initial={false}
            animate={{ width: fill }}
            transition={transition}
          />
          <motion.span
            className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,.25)]"
            initial={false}
            animate={{ left: fill }}
            transition={transition}
          />
        </div>
        <div className="mt-3 hidden justify-between text-[12px] sm:flex text-ink-2 tabular-nums">
          <span>{formatBRL(200)}</span>
          <span>{formatBRL(800)}</span>
        </div>
      </div>
      <ul className="divide-y divide-line">
        {ROWS.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-1 text-[14px] sm:py-2.5 sm:text-[15px]">
            <span className="text-ink-2">{r.name}</span>
            <span className="font-semibold text-ink tabular-nums">{formatBRL(r.price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
