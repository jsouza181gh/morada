import { useCallback, useEffect, useSyncExternalStore } from 'react';

/**
 * Preferência de tema compartilhada (Topbar e Configurações > Aparência).
 * Salva em `morada:theme`; `auto` segue `prefers-color-scheme`.
 */
export type ThemePref = 'light' | 'dark' | 'auto';

export const THEME_KEY = 'morada:theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function readStoredPref(): ThemePref {
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark' || v === 'auto') return v;
  } catch {
    // armazenamento indisponível: segue o sistema
  }
  return 'auto';
}

let currentPref: ThemePref | null = null;
const listeners = new Set<() => void>();

function getPref(): ThemePref {
  if (currentPref === null) currentPref = readStoredPref();
  return currentPref;
}

function subscribePref(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function setThemePref(next: ThemePref) {
  currentPref = next;
  try {
    window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // ignora: o tema vale só para esta sessão
  }
  listeners.forEach((l) => l());
}

function subscribeSystem(cb: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getSystemDark(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;
}

/** Lê/escreve a preferência; `dark` é o tema efetivo. Use `applyToDocument` em um único lugar (AppLayout). */
export function useTheme({ applyToDocument = false }: { applyToDocument?: boolean } = {}) {
  const pref = useSyncExternalStore(subscribePref, getPref, () => 'auto' as ThemePref);
  const systemDark = useSyncExternalStore(subscribeSystem, getSystemDark, () => false);
  const dark = pref === 'dark' || (pref === 'auto' && systemDark);

  useEffect(() => {
    if (applyToDocument) document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [applyToDocument, dark]);

  const setDark = useCallback((value: boolean) => setThemePref(value ? 'dark' : 'light'), []);

  return { pref, dark, setPref: setThemePref, setDark };
}
