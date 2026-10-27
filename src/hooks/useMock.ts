import { useCallback, useEffect, useLayoutEffect, useRef, useState, type DependencyList } from 'react';

/**
 * Carrega dados de uma função da API mock.
 * Refaz a chamada quando `deps` mudam ou com `reload()`; ignora respostas de chamadas antigas.
 */
export function useMock<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): { data: T | undefined; loading: boolean; error: Error | undefined; reload: () => void } {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [nonce, setNonce] = useState(0);
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let cancelled = false;
    // oxlint-disable-next-line react/set-state-in-effect -- reinicia o estado quando as deps mudam
    setLoading(true);
    setError(undefined);
    fnRef
      .current()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps -- deps vêm do chamador
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { data, loading, error, reload };
}
