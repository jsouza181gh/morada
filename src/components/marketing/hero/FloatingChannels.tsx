import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { ChannelBadge } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ChannelId, ListingStatus } from '@/mocks/types';

/** Posições no palco desktop (≥ 1068px). Abaixo disso os chips viram uma fileira e estas posições são ignoradas. */
const CHIPS: { id: ChannelId; status: ListingStatus; pos: CSSProperties }[] = [
  { id: 'airbnb', status: 'published', pos: { left: 0, top: 70 } },
  { id: 'booking', status: 'published', pos: { left: '3%', top: 250 } },
  { id: 'vrbo', status: 'pending', pos: { left: 0, top: 430 } },
  { id: 'trivago', status: 'published', pos: { right: 0, top: 40 } },
  { id: 'decolar', status: 'published', pos: { left: '12%', top: 560 } },
  { id: 'expedia', status: 'published', pos: { right: '22%', top: 580 } },
];

/** Os seis canais "flutuando" em volta do notebook. Decorativo (o palco tem role="img"). */
export function FloatingChannels({ delay = 0 }: { delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="pointer-events-none z-20 mt-6 flex flex-wrap justify-center gap-2 md:absolute md:inset-0 md:mt-0 md:block">
      {CHIPS.map((c, i) => (
        <motion.div
          key={c.id}
          className="md:absolute"
          style={c.pos}
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.gentle, delay: delay + i * 0.06 }}
        >
          <ChannelBadge channel={c.id} status={c.status} className="rounded-pill shadow-float" />
        </motion.div>
      ))}
    </div>
  );
}
