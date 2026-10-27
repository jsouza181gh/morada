import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Skeleton } from '@/components/ui';
import { easeApple, useReducedMotion } from '@/components/motion';
import { useMock } from '@/hooks/useMock';
import { getChannels, getProperty } from '@/mocks/api';
import { formatBRL } from '@/lib/format';
import type { ChannelId } from '@/mocks/types';
import { ExplorerList } from './ExplorerList';
import { ListingPreview } from './ListingPreview';

const PANEL_ID = 'canais-previa';
const tabId = (id: ChannelId) => `canal-tab-${id}`;

export function ChannelExplorer() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<ChannelId>('airbnb');
  const { data: channels } = useMock(getChannels);
  const { data: property } = useMock(() => getProperty('lagoa'));

  const channel = channels?.find((c) => c.id === active);

  return (
    <section id="canais" aria-labelledby="canais-titulo" className="bg-bg-alt px-4 py-28">
      <h2 id="canais-titulo" className="t-section mx-auto mb-10 max-w-[980px]">
        Explore os canais.
      </h2>

      <div className="mx-auto flex min-h-[680px] max-w-[1180px] flex-wrap items-center gap-12 rounded-card bg-surface px-[clamp(24px,5vw,72px)] py-14">
        <ExplorerList channels={channels} active={active} onChange={setActive} panelId={PANEL_ID} tabId={tabId} />
        <ListingPreview
          channel={channel}
          property={property}
          panelId={PANEL_ID}
          labelledBy={channels ? tabId(active) : undefined}
        />
      </div>

      <div className="t-body-sm mx-auto mt-6 flex min-h-5 max-w-[980px] justify-center text-center text-ink-2">
        {channel && property ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={channel.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduced ? 0 : 0.4, ease: easeApple } }}
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.2, ease: easeApple } }}
            >
              Taxa do canal: {channel.feeLabel}. Você recebe {formatBRL(property.nightlyNet)} por noite em todos.
            </motion.p>
          </AnimatePresence>
        ) : (
          <Skeleton className="h-5 w-80 max-w-full" />
        )}
      </div>
    </section>
  );
}
