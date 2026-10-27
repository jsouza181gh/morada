import { useRef, type RefObject } from 'react';
import { useInView as useMotionInView } from 'motion/react';

const supported = typeof IntersectionObserver !== 'undefined';

/**
 * Wrapper do useInView do motion. Por padrão dispara uma vez, com 25% do elemento visível.
 * Sem IntersectionObserver (ex.: jsdom) considera o elemento visível.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = true, amount = 0.25 }: { once?: boolean; amount?: number | 'some' | 'all' } = {},
): boolean {
  const detached = useRef<Element>(null);
  const inView = useMotionInView(supported ? ref : detached, { once, amount });
  return supported ? inView : true;
}
