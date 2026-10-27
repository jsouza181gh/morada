import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

function wrap(i: number, count: number): number {
  return count > 0 ? ((i % count) + count) % count : 0;
}

function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

/**
 * Autoplay de carrossel: avança `index` em loop a cada `intervalMs` enquanto está tocando,
 * habilitado e com a aba visível. `setIndex` pausa (o usuário assumiu o controle).
 * Com reduced motion começa (e fica) pausado.
 */
export function useAutoplay({
  count,
  intervalMs = 5000,
  enabled = true,
}: {
  count: number;
  intervalMs?: number;
  enabled?: boolean;
}): {
  index: number;
  setIndex: (i: number) => void;
  playing: boolean;
  toggle: () => void;
  pause: () => void;
  play: () => void;
} {
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const [rawIndex, setRawIndex] = useState(0);
  // null = o usuário ainda não escolheu: toca, exceto com reduced motion (pausa sozinho).
  const [userPlaying, setUserPlaying] = useState<boolean | null>(null);
  const playing = userPlaying ?? !reduced;
  const index = wrap(rawIndex, count);

  // Um timeout por índice: mudar o índice (manual ou automático) reinicia a contagem.
  useEffect(() => {
    if (!playing || !enabled || !visible || count < 2) return;
    const id = window.setTimeout(() => setRawIndex((i) => wrap(wrap(i, count) + 1, count)), intervalMs);
    return () => window.clearTimeout(id);
  }, [index, playing, enabled, visible, count, intervalMs]);

  const setIndex = useCallback(
    (i: number) => {
      setRawIndex(wrap(i, count));
      setUserPlaying(false);
    },
    [count],
  );
  const toggle = useCallback(() => setUserPlaying((p) => !(p ?? !reduced)), [reduced]);
  const pause = useCallback(() => setUserPlaying(false), []);
  const play = useCallback(() => setUserPlaying(true), []);

  return { index, setIndex, playing, toggle, pause, play };
}
