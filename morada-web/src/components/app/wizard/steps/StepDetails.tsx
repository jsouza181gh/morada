import { useId, type ReactNode } from 'react';
import {
  AirVent,
  Car,
  CookingPot,
  Fence,
  Flame,
  Heater,
  Laptop,
  Minus,
  PawPrint,
  Plus,
  Sunset,
  WashingMachine,
  Waves,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';
import { AMENITIES, type StepProps } from '../useWizardDraft';

/* ---------- auxiliares de formulário usados por vários passos ---------- */

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  hintId?: string;
  className?: string;
  children: ReactNode;
};

/** Label + controle + erro (id `${id}-error`) e dica opcional. */
export function Field({ id, label, error, hint, hintId, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} className="t-body-sm font-medium text-ink">
        {label}
      </Label>
      {children}
      {hint && (
        <p id={hintId} className="t-caption font-normal text-ink-2">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="t-body-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

type NumberStepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  /** Texto do valor para leitores de tela, ex.: "4 hóspedes". */
  valueText?: (v: number) => string;
};

/** Contador "− valor +" com botões de 44px. */
export function NumberStepper({ label, value, min, max, onChange, valueText }: NumberStepperProps) {
  const labelId = useId();
  const btn =
    'inline-flex size-11 items-center justify-center rounded-pill border border-line-strong bg-surface text-ink transition-colors hover:bg-bg-alt active:scale-[.96] disabled:pointer-events-none disabled:opacity-40';
  return (
    <div role="group" aria-labelledby={labelId} className="flex items-center justify-between gap-4 py-3">
      <span id={labelId} className="t-body text-ink">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={btn}
          aria-label={`Diminuir ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-8 text-center font-display text-[21px] font-medium tabular-nums text-ink">
          <span aria-hidden="true">{value}</span>
          <span className="sr-only">{valueText ? valueText(value) : `${label}: ${value}`}</span>
        </output>
        <button
          type="button"
          className={btn}
          aria-label={`Aumentar ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ---------- passo 2 ---------- */

const AMENITY_ICONS: Record<(typeof AMENITIES)[number], LucideIcon> = {
  'Wi-Fi': Wifi,
  'Ar-condicionado': AirVent,
  'Cozinha completa': CookingPot,
  Estacionamento: Car,
  Piscina: Waves,
  Churrasqueira: Flame,
  Deck: Fence,
  'Máquina de lavar': WashingMachine,
  'Espaço de trabalho': Laptop,
  Lareira: Heater,
  'Vista para o mar': Sunset,
  'Aceita pets': PawPrint,
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function StepDetails({ draft, update }: StepProps) {
  const toggle = (a: string) =>
    update((d) => ({
      amenities: d.amenities.includes(a) ? d.amenities.filter((x) => x !== a) : [...d.amenities, a],
    }));

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section aria-labelledby="details-capacity" className="rounded-lg bg-surface px-6 py-3">
        <h2 id="details-capacity" className="sr-only">
          Capacidade
        </h2>
        <div className="divide-y divide-line">
          <NumberStepper
            label="Hóspedes"
            value={draft.guests}
            min={1}
            max={16}
            onChange={(v) => update({ guests: v })}
            valueText={(v) => plural(v, 'hóspede', 'hóspedes')}
          />
          <NumberStepper
            label="Quartos"
            value={draft.bedrooms}
            min={0}
            max={12}
            onChange={(v) => update({ bedrooms: v })}
            valueText={(v) => plural(v, 'quarto', 'quartos')}
          />
          <NumberStepper
            label="Camas"
            value={draft.beds}
            min={1}
            max={20}
            onChange={(v) => update({ beds: v })}
            valueText={(v) => plural(v, 'cama', 'camas')}
          />
          <NumberStepper
            label="Banheiros"
            value={draft.bathrooms}
            min={1}
            max={10}
            onChange={(v) => update({ bathrooms: v })}
            valueText={(v) => plural(v, 'banheiro', 'banheiros')}
          />
        </div>
      </section>

      <section aria-labelledby="details-amenities">
        <h2 id="details-amenities" className="t-headline font-medium text-ink">
          Comodidades
        </h2>
        <p className="t-body-sm mt-1 text-ink-2">
          {draft.amenities.length === 0
            ? 'Toque para marcar o que o imóvel oferece.'
            : `${plural(draft.amenities.length, 'comodidade marcada', 'comodidades marcadas')}.`}
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AMENITIES.map((a) => {
            const Icon = AMENITY_ICONS[a];
            const on = draft.amenities.includes(a);
            return (
              <li key={a}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(a)}
                  className={cn(
                    'flex h-full min-h-[88px] w-full flex-col items-start justify-between gap-3 rounded-lg border bg-surface p-4 text-left transition-colors active:scale-[.98]',
                    on ? 'border-verde bg-verde-soft text-verde' : 'border-line text-ink hover:border-line-strong',
                  )}
                >
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span className="t-body-sm font-medium">{a}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
