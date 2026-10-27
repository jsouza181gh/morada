/** Classes compartilhadas pelas seções de configurações. */
export const INPUT_CLASS =
  't-body-sm h-11 w-full rounded-md border border-line-strong bg-surface px-3 text-ink placeholder:text-ink-2 disabled:opacity-40';

export const SELECT_TRIGGER_CLASS =
  't-body-sm w-full rounded-md border-line-strong bg-surface px-3 text-ink data-[size=default]:h-11 dark:bg-surface';

export const SELECT_CONTENT_CLASS = 'app-scope bg-surface text-ink';

export const DIALOG_CLASS = 'app-scope gap-5 rounded-lg bg-surface p-6 text-ink ring-line sm:max-w-md';

export const LABEL_CLASS = 't-body-sm mb-1.5 block font-medium text-ink';

export const SECTION_TITLE_CLASS = 'font-display text-[24px] leading-8 font-medium tracking-[-0.01em] text-ink';

export type SectionId = 'perfil' | 'plano' | 'notificacoes' | 'equipe' | 'aparencia';

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'plano', label: 'Plano e cobrança' },
  { id: 'notificacoes', label: 'Notificações' },
  { id: 'equipe', label: 'Equipe' },
  { id: 'aparencia', label: 'Aparência' },
];

export function isSectionId(v: string | null): v is SectionId {
  return SECTIONS.some((s) => s.id === v);
}

/** Máscara de telefone BR: (48) 99812-3456 ou (48) 3222-1234. */
export function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const split = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}
