import { motion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { springs } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

type CarouselControlsProps = {
  labels: string[];
  index: number;
  onSelect: (i: number) => void;
  playing: boolean;
  /** true quando o autoplay está de fato contando (tocando, sem hover/foco, aba visível). */
  running: boolean;
  intervalMs: number;
  onToggle: () => void;
};

export function CarouselControls({
  labels,
  index,
  onSelect,
  playing,
  running,
  intervalMs,
  onToggle,
}: CarouselControlsProps) {
  const reduced = useReducedMotion();
  const total = labels.length;
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <div
        role="group"
        aria-label="Escolher destaque"
        className="flex h-14 items-center rounded-pill bg-line/55 px-[17px] backdrop-blur-xl"
      >
        {labels.map((label, i) => {
          const active = i === index;
          return (
            <button
              key={label}
              type="button"
              aria-label={`Destaque ${i + 1} de ${total}: ${label}`}
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(i)}
              // Área de toque maior que o ponto: 44px de altura e ao menos 24px de largura (WCAG 2.5.8), ponto visual de 8px.
              className="group flex h-11 min-w-6 items-center justify-center px-2"
            >
              <motion.span
                className={cn(
                  'relative block h-2 overflow-hidden rounded-pill transition-colors',
                  active ? 'bg-line-strong' : 'bg-line-strong group-hover:bg-ink-2',
                )}
                initial={false}
                animate={{ width: active ? 48 : 8 }}
                transition={reduced ? { duration: 0 } : springs.snappy}
              >
                {active && (
                  <motion.span
                    // Recomeça a cada troca de slide e a cada retomada do autoplay.
                    key={`${index}-${running ? 'run' : 'hold'}`}
                    className="absolute inset-0 origin-left rounded-pill bg-ink"
                    initial={{ scaleX: running && !reduced ? 0 : 1 }}
                    animate={{ scaleX: 1 }}
                    transition={running && !reduced ? { duration: intervalMs / 1000, ease: 'linear' } : { duration: 0 }}
                  />
                )}
              </motion.span>
            </button>
          );
        })}
      </div>
      <IconButton
        size="lg"
        variant="glass"
        label={playing ? 'Pausar destaques' : 'Reproduzir destaques'}
        onClick={onToggle}
      >
        {playing ? (
          <Pause size={20} strokeWidth={1.5} fill="currentColor" aria-hidden="true" />
        ) : (
          <Play size={20} strokeWidth={1.5} fill="currentColor" aria-hidden="true" className="translate-x-px" />
        )}
      </IconButton>
    </div>
  );
}
