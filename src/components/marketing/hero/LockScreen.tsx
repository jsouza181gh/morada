import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type Notification = { title: string; text: string; tone: string };

const NOTIFICATIONS: Notification[] = [
  {
    title: 'Nova reserva',
    text: 'Thomas, 26 a 30 out, via Booking.com. Datas fechadas nos outros 5 canais.',
    tone: 'bg-surface/88',
  },
  { title: 'Marina via Airbnb', text: 'Tem estacionamento?', tone: 'bg-surface/70' },
];

function NotificationCard({ n }: { n: Notification }) {
  return (
    <div className={cn('flex items-start gap-2 rounded-[18px] p-2.5 backdrop-blur', n.tone)}>
      <span className="grid size-[30px] shrink-0 place-items-center rounded-[8px] bg-surface-dark font-display text-[14px] font-semibold text-white">
        M
      </span>
      <span className="min-w-0 text-[11px] leading-[14px] text-ink">
        <strong className="block font-semibold">{n.title}</strong>
        {n.text}
      </span>
    </div>
  );
}

/** Tela de bloqueio do celular do hero. Decorativa. */
export function LockScreen() {
  const reduced = useReducedMotion();
  const [first, second] = NOTIFICATIONS as [Notification, Notification];

  return (
    <div className="flex h-full flex-col bg-verde-soft pt-[54px] text-center">
      <span className="text-[12px] font-medium text-verde-strong">sábado, 24 de outubro</span>
      <span className="font-display text-[58px] leading-[1.05] font-medium tracking-[-0.03em] text-verde-strong">
        9:41
      </span>
      <div className="mt-6 flex flex-col gap-1.5 px-2.5 text-left">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 1.2 }}
        >
          <NotificationCard n={first} />
        </motion.div>
        <NotificationCard n={second} />
      </div>
    </div>
  );
}
