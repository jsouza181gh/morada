import type { ChannelId, SyncHealth } from '@/mocks/types';

/** Artigo usado antes do nome do canal: "o Vrbo", "a Decolar". */
const FEMININE: ChannelId[] = ['decolar', 'expedia'];

export function article(id: ChannelId): { def: 'o' | 'a'; em: 'no' | 'na'; de: 'do' | 'da' } {
  return FEMININE.includes(id) ? { def: 'a', em: 'na', de: 'da' } : { def: 'o', em: 'no', de: 'do' };
}

export const HEALTH_LABEL: Record<SyncHealth, string> = {
  ok: 'Funcionando',
  warning: 'Atenção',
  error: 'Com erro',
};

export const HEALTH_TONE: Record<SyncHealth, 'verde' | 'warning' | 'danger'> = {
  ok: 'verde',
  warning: 'warning',
  error: 'danger',
};

export const HEALTH_RANK: Record<SyncHealth, number> = { ok: 0, warning: 1, error: 2 };

/** Classes do conteúdo de Dialog no visual Morada (o portal fica fora do `.app-scope`). */
export const DIALOG_CLASS = 'app-scope gap-5 rounded-lg bg-surface p-6 text-ink ring-line sm:max-w-md';

/** Botão destrutivo local (o Button da T01 não tem variante danger). */
export const DANGER_BUTTON_CLASS =
  'inline-flex items-center justify-center gap-1.5 rounded-pill bg-danger px-[21px] py-[11px] text-[17px] text-white transition-opacity hover:opacity-90 active:scale-[.98] disabled:pointer-events-none disabled:opacity-40 max-sm:min-h-11';
