import { useReducedMotion as useMotionReducedMotion } from 'motion/react';

/** true quando o usuário pede `prefers-reduced-motion: reduce`. Nunca retorna null. */
export function useReducedMotion(): boolean {
  return useMotionReducedMotion() ?? false;
}
