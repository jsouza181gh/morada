export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  layout: { type: 'spring', stiffness: 300, damping: 32 },
} as const;

/** Curva para transições por tempo (ex.: crossfade de 0.4s). */
export const easeApple = [0.3, 1, 0.4, 1] as const;
