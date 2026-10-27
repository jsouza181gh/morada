import { createElement, type ElementType, type ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springs } from './springs';

// motion.create precisa ser estável entre renders: um componente por tag/componente.
const motionCache = new Map<ElementType, ElementType>();
function getMotion(as: ElementType): ElementType {
  let m = motionCache.get(as);
  if (!m) {
    m = motion.create(as as Parameters<typeof motion.create>[0]) as ElementType;
    motionCache.set(as, m);
  }
  return m;
}

const VIEWPORT = { once: true, amount: 0.25 } as const;

// Sem IntersectionObserver (ex.: jsdom nos testes) whileInView quebraria e o conteúdo
// ficaria invisível: renderiza estático, como no reduced motion.
const canObserve = typeof IntersectionObserver !== 'undefined';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** deslocamento inicial em px (default 24) */
  y?: number;
  className?: string;
  as?: ElementType;
};

/** Fade + translateY ao entrar na viewport, uma vez. Com reduced motion renderiza estático. */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion() || !canObserve;
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return createElement(
    getMotion(as),
    {
      className,
      initial: { opacity: 0, y },
      whileInView: { opacity: 1, y: 0 },
      viewport: VIEWPORT,
      transition: { ...springs.gentle, delay },
    },
    children,
  );
}

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/** Container que revela os `RevealItem` filhos em sequência (stagger de 80ms). */
export function RevealGroup({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion() || !canObserve;
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const variants: Variants = delay
    ? { ...groupVariants, visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }
    : groupVariants;
  return createElement(
    getMotion(as),
    { className, variants, initial: 'hidden', whileInView: 'visible', viewport: VIEWPORT },
    children,
  );
}

/** Filho direto de `RevealGroup`. */
export function RevealItem({
  children,
  className,
  y = 24,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion() || !canObserve;
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const variants: Variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: springs.gentle },
  };
  return createElement(getMotion(as), { className, variants }, children);
}
