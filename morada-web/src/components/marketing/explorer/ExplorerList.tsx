import { useEffect, useRef, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import { Pill, Skeleton } from '@/components/ui';
import { springs, useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';
import type { Channel, ChannelId } from '@/mocks/types';

const MotionPill = motion.create(Pill);

export type ExplorerListProps = {
  channels: Channel[] | undefined;
  active: ChannelId;
  onChange: (id: ChannelId) => void;
  panelId: string;
  /** id do elemento de cada aba (o painel usa o da ativa em aria-labelledby). */
  tabId: (id: ChannelId) => string;
};

export function ExplorerList({ channels, active, onChange, panelId, tabId }: ExplorerListProps) {
  const reduced = useReducedMotion();
  const refs = useRef(new Map<ChannelId, HTMLButtonElement>());
  /** A pílula ativa e a inativa são elementos diferentes; devolve o foco ao novo elemento após a troca. */
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    refs.current.get(active)?.focus();
  }, [active]);

  const layoutTransition = reduced ? { duration: 0 } : springs.layout;

  if (!channels) {
    return (
      <div className="flex w-full gap-2 overflow-hidden md:max-w-[360px] md:flex-[1_1_280px] md:flex-col md:gap-3">
        <Skeleton className="h-[120px] w-full shrink-0 rounded-3xl max-md:hidden" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-32 shrink-0 rounded-pill" />
        ))}
      </div>
    );
  }

  const select = (id: ChannelId) => {
    if (id === active) return;
    restoreFocus.current = refs.current.get(id) === document.activeElement;
    onChange(id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = channels.findIndex((c) => c.id === active);
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % channels.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + channels.length) % channels.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = channels.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const id = channels[next]!.id;
    restoreFocus.current = true;
    onChange(id);
  };

  const setRef = (id: ChannelId) => (el: HTMLButtonElement | null) => {
    if (el) refs.current.set(id, el);
    else refs.current.delete(id);
  };

  return (
    <motion.div
      layoutScroll
      role="tablist"
      aria-label="Canais"
      aria-orientation="vertical"
      onKeyDown={onKeyDown}
      className={cn(
        'flex w-full snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none]',
        'md:max-w-[360px] md:flex-[1_1_280px] md:snap-none md:flex-col md:items-start md:gap-3 md:overflow-visible md:pb-0',
      )}
    >
      {channels.map((c) => {
        const isActive = c.id === active;
        const common = {
          id: tabId(c.id),
          role: 'tab',
          'aria-selected': isActive,
          'aria-controls': panelId,
          tabIndex: isActive ? 0 : -1,
          layout: true,
          layoutId: `chip-${c.id}`,
          transition: { layout: layoutTransition },
        } as const;

        if (!isActive) {
          return (
            <MotionPill
              key={c.id}
              ref={setRef(c.id)}
              {...common}
              aria-pressed={undefined}
              icon={<Plus strokeWidth={1.5} />}
              onClick={() => select(c.id)}
              className="h-11 shrink-0 snap-start md:h-10"
              style={{ borderRadius: 999 }}
            >
              <motion.span layout="position" transition={{ layout: layoutTransition }}>
                {c.name}
              </motion.span>
            </MotionPill>
          );
        }

        return (
          <motion.button
            key={c.id}
            ref={setRef(c.id)}
            type="button"
            {...common}
            onClick={() => select(c.id)}
            style={{ borderRadius: 24 }}
            className={cn(
              // < 1068px: pílula preenchida
              'inline-flex h-11 shrink-0 snap-start items-center gap-2 bg-verde pr-4 pl-2.5 text-left text-[14px] font-medium whitespace-nowrap text-on-verde',
              // ≥ 1068px: cartão expandido
              'md:block md:h-auto md:w-full md:bg-bg-alt md:px-5.5 md:py-4.5 md:whitespace-normal md:text-ink',
            )}
          >
            <motion.span
              layout="position"
              transition={{ layout: layoutTransition }}
              className="flex items-center gap-2 md:gap-2.5"
            >
              <span
                aria-hidden="true"
                className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-pill border-[1.5px] border-current md:border-0 md:bg-verde md:text-on-verde"
              >
                <Check strokeWidth={2} className="size-3.5" />
              </span>
              <span className="md:text-[17px] md:font-semibold">{c.name}</span>
            </motion.span>
            <motion.span
              className="mt-2 hidden text-[15px] leading-[22px] font-normal text-ink-2 md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.3, delay: 0.2 }}
            >
              {c.blurb}
            </motion.span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
