import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatNumber } from '@/lib/format';
import { easeApple } from './springs';

/**
 * Anima um número de `from` até `to` quando entra na viewport (uma vez).
 * Com reduced motion mostra o valor final. Leitores de tela recebem só o valor final.
 */
export function CountUp({
  to,
  from = 0,
  format = formatNumber,
  duration = 1.2,
  className,
}: {
  to: number;
  from?: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const [value, setValue] = useState(from);
  const final = format(to);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(from, to, {
      duration,
      ease: easeApple,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [reduced, inView, from, to, duration]);

  const shown = reduced ? final : format(Math.round(value));

  return (
    <span ref={ref} className={className} aria-live="off" aria-label={final}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
