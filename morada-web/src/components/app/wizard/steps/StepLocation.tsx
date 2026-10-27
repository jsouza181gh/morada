import { Building, Building2, House, MapPin, Sofa, TreePine, type LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/cn';
import type { Property } from '@/mocks/types';
import { CEP_MAP, PROPERTY_TYPES, UFS, fieldA11y, fieldClass, formatCep, type StepProps } from '../useWizardDraft';
import { Field } from './StepDetails';

const TYPE_ICONS: Record<Property['type'], LucideIcon> = {
  casa: House,
  apartamento: Building2,
  loft: Sofa,
  chale: TreePine,
  studio: Building,
};

export function StepLocation({ draft, update, errors }: StepProps) {
  const onCep = (value: string) => {
    const cep = formatCep(value);
    const hit = CEP_MAP[cep.replace(/\D/g, '')];
    if (hit) {
      update((d) => ({
        cep,
        city: hit.city,
        state: hit.state,
        neighborhood: hit.neighborhood,
        street: d.street || hit.street,
      }));
    } else {
      update({ cep });
    }
  };

  const cepDigits = draft.cep.replace(/\D/g, '');
  const cepHint =
    cepDigits.length === 8 && CEP_MAP[cepDigits]
      ? `Encontramos ${CEP_MAP[cepDigits]?.neighborhood}, ${CEP_MAP[cepDigits]?.city}.`
      : 'Exemplo: 88062-000.';

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="flex min-w-0 flex-col gap-10">
        <div className="grid grid-cols-6 gap-x-4 gap-y-5">
          <Field
            id="f-cep"
            label="CEP"
            error={errors.cep}
            hint={cepHint}
            hintId="f-cep-hint"
            className="col-span-6 sm:col-span-3"
          >
            <Input
              {...fieldA11y('f-cep', errors.cep, 'f-cep-hint')}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              maxLength={9}
              value={draft.cep}
              onChange={(e) => onCep(e.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field id="f-street" label="Rua" error={errors.street} className="col-span-6">
            <Input
              {...fieldA11y('f-street', errors.street)}
              autoComplete="address-line1"
              value={draft.street}
              onChange={(e) => update({ street: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field id="f-number" label="Número" error={errors.number} className="col-span-3 sm:col-span-2">
            <Input
              {...fieldA11y('f-number', errors.number)}
              value={draft.number}
              onChange={(e) => update({ number: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field id="f-complement" label="Complemento (opcional)" className="col-span-3 sm:col-span-4">
            <Input
              id="f-complement"
              autoComplete="address-line2"
              value={draft.complement}
              onChange={(e) => update({ complement: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field id="f-neighborhood" label="Bairro" error={errors.neighborhood} className="col-span-6 sm:col-span-3">
            <Input
              {...fieldA11y('f-neighborhood', errors.neighborhood)}
              value={draft.neighborhood}
              onChange={(e) => update({ neighborhood: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field id="f-city" label="Cidade" error={errors.city} className="col-span-4 sm:col-span-2">
            <Input
              {...fieldA11y('f-city', errors.city)}
              autoComplete="address-level2"
              value={draft.city}
              onChange={(e) => update({ city: e.target.value })}
              className={fieldClass}
            />
          </Field>
          <Field id="f-state" label="UF" error={errors.state} className="col-span-2 sm:col-span-1">
            <Select value={draft.state} onValueChange={(v) => update({ state: v })}>
              <SelectTrigger
                {...fieldA11y('f-state', errors.state)}
                className={cn(fieldClass, 'w-full data-[size=default]:h-11')}
              >
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent className="app-scope max-h-72">
                {UFS.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="t-headline font-medium text-ink">Tipo do imóvel</legend>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PROPERTY_TYPES.map((t) => {
              const Icon = TYPE_ICONS[t.value];
              const on = draft.type === t.value;
              return (
                <label
                  key={t.value}
                  className={cn(
                    'relative flex min-h-[88px] cursor-pointer flex-col items-start justify-between gap-3 rounded-lg border bg-surface p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verde',
                    on ? 'border-verde bg-verde-soft text-verde' : 'border-line text-ink hover:border-line-strong',
                  )}
                >
                  <input
                    type="radio"
                    name="property-type"
                    value={t.value}
                    checked={on}
                    onChange={() => update({ type: t.value })}
                    className="sr-only"
                  />
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                  <span className="t-body-sm font-medium">{t.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <MapCard label={draft.neighborhood && draft.city ? `${draft.neighborhood}, ${draft.city}` : undefined} />
    </div>
  );
}

/** Cartão de "mapa" decorativo: grade de ruas em SVG e pino. */
function MapCard({ label }: { label?: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative hidden min-h-[320px] overflow-hidden rounded-card bg-verde-soft sm:block md:min-h-[420px]"
    >
      <svg className="absolute inset-0 size-full text-verde" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 420">
        <g stroke="currentColor" strokeOpacity="0.14" fill="none">
          <path d="M-10 70 L410 40" strokeWidth="10" />
          <path d="M-10 190 L410 230" strokeWidth="14" />
          <path d="M-10 330 L410 300" strokeWidth="8" />
          <path d="M70 -10 L110 430" strokeWidth="9" />
          <path d="M230 -10 L200 430" strokeWidth="12" />
          <path d="M340 -10 L360 430" strokeWidth="7" />
          <path d="M-10 420 C 120 300, 260 380, 410 120" strokeWidth="5" />
        </g>
        <path d="M250 250 C 300 230, 360 260, 410 250 L410 420 L250 420 Z" fill="currentColor" fillOpacity="0.08" />
      </svg>
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <span className="flex size-12 items-center justify-center rounded-pill bg-verde text-on-verde">
          <MapPin size={24} strokeWidth={1.5} />
        </span>
        <span className="h-3 w-0.5 bg-verde" />
      </div>
      <p className="t-caption absolute right-4 bottom-4 left-4 rounded-md bg-surface/90 px-3 py-2 text-ink-2">
        {label ?? 'O pino aparece no bairro do imóvel.'}
      </p>
    </div>
  );
}
