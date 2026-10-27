import { useCallback, useSyncExternalStore } from 'react';

/** Lê a media query agora; `fallback` vale quando `matchMedia` não existe (ex.: alguns ambientes de teste). */
export function matchesMedia(query: string, fallback = false): boolean {
  return typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : fallback;
}

/** Estado reativo de uma media query (useSyncExternalStore, sem efeito extra por render). */
export function useMediaQuery(query: string, fallback = false): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (typeof window.matchMedia !== 'function') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => matchesMedia(query, fallback),
    () => fallback,
  );
}
