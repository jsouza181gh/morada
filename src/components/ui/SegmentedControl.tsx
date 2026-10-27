import { useId, useRef, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { cn } from '@/lib/cn';

export type SegmentedControlProps<T extends string> = {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
  className?: string;
};

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const layoutId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const currentIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  function select(index: number) {
    const n = options.length;
    if (n === 0) return;
    const i = (index + n) % n;
    const opt = options[i];
    if (!opt) return;
    onChange(opt.value);
    refs.current[i]?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        select(currentIndex + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        select(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        select(0);
        break;
      case 'End':
        e.preventDefault();
        select(options.length - 1);
        break;
    }
  }

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn('inline-flex rounded-pill bg-line/60 p-1', className)}>
      {options.map((o, i) => {
        const active = i === currentIndex;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={onKeyDown}
            className={cn(
              // Sempre text-ink: ink-2 sobre a trilha (line/60) fica abaixo de 4.5:1. O ativo se distingue pelo thumb e pelo peso.
              't-body-sm relative h-10 rounded-pill px-5 text-ink transition-colors duration-200',
              active && 'font-medium',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={springs.snappy}
                aria-hidden="true"
                className="absolute inset-0 rounded-pill bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
