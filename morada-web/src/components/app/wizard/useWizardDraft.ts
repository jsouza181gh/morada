import { useCallback, useEffect, useRef, useState } from 'react';
import { channelPrice } from '@/mocks/properties';
import { CHANNEL_IDS, type Channel, type ChannelId, type ChannelListing, type Property } from '@/mocks/types';

export type PropertyDraft = Omit<Property, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>;

/**
 * Rascunho do wizard: campos de `PropertyDraft` (sem `channels`, montado na publicação)
 * mais campos só do cadastro (endereço completo, camas, regras, canais escolhidos).
 */
export type WizardDraft = Omit<PropertyDraft, 'channels'> & {
  cep: string;
  street: string;
  number: string;
  complement: string;
  beds: number;
  allowsParties: boolean;
  noSmoking: boolean;
  selectedChannels: ChannelId[];
  /** Canais conectados durante o cadastro (simulação do fluxo "Conectar"). */
  connectedChannels: ChannelId[];
};

export const STEP_LABELS = ['Local', 'Detalhes', 'Fotos', 'Descrição', 'Preço e regras', 'Canais', 'Revisão'];
export const STEP_COUNT = STEP_LABELS.length;
export const MIN_PHOTOS = 5;
export const PETS_AMENITY = 'Aceita pets';
const STORAGE_KEY = 'morada:draft';
const DEBOUNCE_MS = 800;

/** Canal simulado como desconectado para mostrar o fluxo de conexão. */
export const DISCONNECTED_BY_DEFAULT: ChannelId[] = ['decolar'];

export const EMPTY_DRAFT: WizardDraft = {
  name: '',
  type: 'casa',
  city: '',
  state: '',
  neighborhood: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  guests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 1,
  amenities: [],
  photos: [],
  coverIndex: 0,
  description: '',
  nightlyNet: 0,
  cleaningFee: 0,
  minNights: 2,
  checkIn: '15:00',
  checkOut: '11:00',
  allowsParties: false,
  noSmoking: true,
  selectedChannels: CHANNEL_IDS.filter((id) => !DISCONNECTED_BY_DEFAULT.includes(id)),
  connectedChannels: [],
};

export const AMENITIES = [
  'Wi-Fi',
  'Ar-condicionado',
  'Cozinha completa',
  'Estacionamento',
  'Piscina',
  'Churrasqueira',
  'Deck',
  'Máquina de lavar',
  'Espaço de trabalho',
  'Lareira',
  'Vista para o mar',
  PETS_AMENITY,
] as const;

export const PROPERTY_TYPES: { value: Property['type']; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'loft', label: 'Loft' },
  { value: 'chale', label: 'Chalé' },
  { value: 'studio', label: 'Studio' },
];

export const TYPE_LABEL: Record<Property['type'], string> = Object.fromEntries(
  PROPERTY_TYPES.map((t) => [t.value, t.label]),
) as Record<Property['type'], string>;

export const UFS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA',
  'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
];

/** Mapa fixo de CEPs mock. */
export const CEP_MAP: Record<string, { city: string; state: string; neighborhood: string; street: string }> = {
  '88062000': { city: 'Florianópolis', state: 'SC', neighborhood: 'Lagoa da Conceição', street: 'Rua das Rendeiras' },
  '01310100': { city: 'São Paulo', state: 'SP', neighborhood: 'Bela Vista', street: 'Avenida Paulista' },
  '22070011': { city: 'Rio de Janeiro', state: 'RJ', neighborhood: 'Copacabana', street: 'Avenida Atlântica' },
};

export const SAMPLE_PHOTOS = Array.from(
  { length: 6 },
  (_, i) => `https://picsum.photos/seed/morada-novo-${i + 1}/1200/800`,
);

export const CHECKIN_TIMES = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '20:00', '22:00'];
export const CHECKOUT_TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

/** Classes dos campos de texto (sobre o Input/Textarea do shadcn). */
export const fieldClass =
  'h-11 rounded-md border-line-strong bg-surface px-3 text-[17px] md:text-[17px] text-ink placeholder:text-ink-2 focus-visible:border-verde focus-visible:ring-0 aria-invalid:border-danger aria-invalid:ring-0';

/** Atributos de acessibilidade de um campo com possível erro (id do erro = `${id}-error`). */
export function fieldA11y(id: string, error: string | undefined, hintId?: string) {
  const describedBy = [error ? `${id}-error` : null, hintId ?? null].filter(Boolean).join(' ');
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy || undefined,
  } as const;
}

export function formatCep(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

/** Título como sai no canal: corta no limite do canal (com reticências). */
export function titleForChannel(title: string, max: number | null): string {
  const t = title.trim();
  if (max === null || t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function isConnected(channel: Channel, draft: WizardDraft): boolean {
  if (draft.connectedChannels.includes(channel.id)) return true;
  if (DISCONNECTED_BY_DEFAULT.includes(channel.id)) return false;
  return channel.connected;
}

export type Readiness = { tone: 'verde' | 'warning' | 'danger'; label: string };

export function readinessFor(channelId: ChannelId, photoCount: number): Readiness {
  if (channelId === 'vrbo') return { tone: 'warning', label: 'Passa por análise' };
  if (channelId === 'expedia' && photoCount < 8) return { tone: 'danger', label: 'Falta foto' };
  return { tone: 'verde', label: 'Pronto' };
}

export function channelsLabel(n: number): string {
  return n === 1 ? '1 canal' : `${n} canais`;
}

/** Monta o objeto aceito por `createProperty`. */
export function toPropertyDraft(draft: WizardDraft, channels: Channel[]): PropertyDraft {
  const {
    cep: _cep,
    street: _street,
    number: _number,
    complement: _complement,
    beds: _beds,
    allowsParties: _parties,
    noSmoking: _smoking,
    selectedChannels,
    connectedChannels: _connected,
    ...base
  } = draft;
  const listings = {} as Record<ChannelId, ChannelListing>;
  for (const id of CHANNEL_IDS) {
    const ch = channels.find((c) => c.id === id);
    const selected = selectedChannels.includes(id);
    listings[id] = {
      status: !selected ? 'off' : id === 'vrbo' ? 'pending' : 'published',
      price: channelPrice(draft.nightlyNet, ch?.feePct ?? 0),
      title: titleForChannel(draft.name, ch?.titleMaxLength ?? null),
    };
  }
  return { ...base, name: draft.name.trim(), coverIndex: 0, channels: listings };
}

export type Errors = Partial<Record<string, string>>;

/** Erros do passo (índice 0–6), na ordem dos campos na tela. */
export function validateStep(step: number, d: WizardDraft): Errors {
  const e: Errors = {};
  switch (step) {
    case 0:
      if (d.cep.replace(/\D/g, '').length !== 8) e.cep = 'Informe o CEP com 8 números.';
      if (!d.street.trim()) e.street = 'Informe a rua.';
      if (!d.number.trim()) e.number = 'Informe o número. Use "s/n" se não houver.';
      if (!d.neighborhood.trim()) e.neighborhood = 'Informe o bairro.';
      if (!d.city.trim()) e.city = 'Informe a cidade.';
      if (!d.state) e.state = 'Escolha a UF.';
      break;
    case 2:
      if (d.photos.length < MIN_PHOTOS) {
        const missing = MIN_PHOTOS - d.photos.length;
        e.photos = `Envie pelo menos ${MIN_PHOTOS} fotos. ${missing === 1 ? 'Falta 1' : `Faltam ${missing}`}.`;
      }
      break;
    case 3: {
      const title = d.name.trim();
      if (!title) e.name = 'Dê um título ao anúncio.';
      else if (title.length > 120) e.name = 'Use no máximo 120 caracteres.';
      const len = d.description.trim().length;
      if (len < 50) e.description = `Escreva pelo menos 50 caracteres. Faltam ${50 - len}.`;
      else if (len > 2000) e.description = 'Use no máximo 2.000 caracteres.';
      break;
    }
    case 4:
      if (!(d.nightlyNet > 0)) e.nightlyNet = 'Informe quanto quer receber por noite.';
      break;
    case 5:
      if (d.selectedChannels.length === 0) e.channels = 'Ligue ao menos um canal.';
      break;
  }
  return e;
}

type Stored = { draft: WizardDraft; step: number; maxStep: number; savedAt: number };

function readStorage(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Stored>;
    if (!parsed || typeof parsed !== 'object' || !parsed.draft) return null;
    const draft: WizardDraft = { ...EMPTY_DRAFT, ...parsed.draft };
    // URLs `blob:` não sobrevivem ao recarregar a página.
    draft.photos = (draft.photos ?? []).filter((p) => typeof p === 'string' && !p.startsWith('blob:'));
    const clamp = (n: unknown) => Math.min(STEP_COUNT - 1, Math.max(0, typeof n === 'number' ? Math.floor(n) : 0));
    const maxStep = clamp(parsed.maxStep);
    return { draft, step: Math.min(clamp(parsed.step), maxStep), maxStep, savedAt: Number(parsed.savedAt) || Date.now() };
  } catch {
    return null;
  }
}

function writeStorage(value: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* armazenamento indisponível: segue só em memória */
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Estado do rascunho com salvamento em localStorage (debounce de 800ms). */
export function useWizardDraft() {
  const [initial] = useState(readStorage);
  const [draft, setDraft] = useState<WizardDraft>(initial?.draft ?? EMPTY_DRAFT);
  const [step, setStepState] = useState(initial?.step ?? 0);
  const [maxStep, setMaxStep] = useState(initial?.maxStep ?? 0);
  const [savedAt, setSavedAt] = useState<number | null>(initial?.savedAt ?? null);
  const [restored, setRestored] = useState(initial !== null);
  const [dirty, setDirty] = useState(false);

  const latest = useRef<Stored>({ draft, step, maxStep, savedAt: savedAt ?? 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disabled = useRef(false);

  const save = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (disabled.current) return;
    const now = Date.now();
    writeStorage({ ...latest.current, savedAt: now });
    setSavedAt(now);
    setDirty(false);
  }, []);

  const schedule = useCallback(() => {
    if (disabled.current) return;
    setDirty(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(save, DEBOUNCE_MS);
  }, [save]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const update = useCallback(
    (patch: Partial<WizardDraft> | ((d: WizardDraft) => Partial<WizardDraft>)) => {
      setDraft((prev) => {
        const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) };
        latest.current = { ...latest.current, draft: next };
        return next;
      });
      schedule();
    },
    [schedule],
  );

  const setStep = useCallback(
    (next: number) => {
      const s = Math.min(STEP_COUNT - 1, Math.max(0, next));
      const max = Math.max(latest.current.maxStep, s);
      latest.current = { ...latest.current, step: s, maxStep: max };
      setStepState(s);
      setMaxStep(max);
      schedule();
    },
    [schedule],
  );

  /** Salva já, se houver alteração pendente. */
  const flush = useCallback(() => {
    if (timer.current) save();
  }, [save]);

  /** Apaga o rascunho e volta ao passo 1. */
  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    clearStorage();
    latest.current = { draft: EMPTY_DRAFT, step: 0, maxStep: 0, savedAt: 0 };
    setDraft(EMPTY_DRAFT);
    setStepState(0);
    setMaxStep(0);
    setSavedAt(null);
    setDirty(false);
    setRestored(false);
  }, []);

  /** Apaga o armazenamento e para de salvar (usado ao publicar). */
  const discard = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    disabled.current = true;
    clearStorage();
    setDirty(false);
  }, []);

  /** Volta a salvar depois de um `discard`. */
  const resume = useCallback(() => {
    disabled.current = false;
  }, []);

  return {
    draft,
    update,
    step,
    setStep,
    maxStep,
    savedAt,
    dirty,
    restored,
    dismissRestored: () => setRestored(false),
    flush,
    reset,
    discard,
    resume,
  };
}

export type WizardDraftApi = ReturnType<typeof useWizardDraft>;

/** Props comuns a todos os passos. */
export type StepProps = {
  draft: WizardDraft;
  update: WizardDraftApi['update'];
  errors: Errors;
  channels: Channel[] | undefined;
};
