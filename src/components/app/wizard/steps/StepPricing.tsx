import { Skeleton, Switch } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/cn';
import { formatBRL, formatNumber } from '@/lib/format';
import { channelPrice } from '@/mocks/properties';
import { CHECKIN_TIMES, CHECKOUT_TIMES, PETS_AMENITY, fieldA11y, fieldClass, type StepProps } from '../useWizardDraft';
import { Field, NumberStepper } from './StepDetails';

const toNumber = (v: string) => Number(v.replace(/\D/g, '').slice(0, 6)) || 0;

function TimeSelect({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Field id={id} label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={cn(fieldClass, 'w-full data-[size=default]:h-11')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="app-scope">
          {options.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <li className="flex min-h-14 items-center justify-between gap-4 py-2">
      <span aria-hidden="true" className="t-body text-ink">
        {label}
      </span>
      <Switch label={label} checked={checked} onCheckedChange={onChange} />
    </li>
  );
}

export function StepPricing({ draft, update, errors, channels }: StepProps) {
  const pets = draft.amenities.includes(PETS_AMENITY);
  const setPets = (on: boolean) =>
    update((d) => ({
      amenities: on ? [...d.amenities.filter((a) => a !== PETS_AMENITY), PETS_AMENITY] : d.amenities.filter((a) => a !== PETS_AMENITY),
    }));

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,6fr)]">
      <div className="flex min-w-0 flex-col gap-8">
        <Field id="f-nightlyNet" label="Quero receber por noite" error={errors.nightlyNet}>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 font-display text-[28px] font-medium text-ink-2"
            >
              R$
            </span>
            <Input
              {...fieldA11y('f-nightlyNet', errors.nightlyNet)}
              inputMode="numeric"
              placeholder="0"
              value={draft.nightlyNet ? formatNumber(draft.nightlyNet) : ''}
              onChange={(e) => update({ nightlyNet: toNumber(e.target.value) })}
              className={cn(
                fieldClass,
                'h-20 rounded-lg pl-16 font-display text-[40px] font-medium tracking-[-0.02em] md:text-[40px]',
              )}
            />
          </div>
        </Field>

        <section aria-labelledby="pricing-table">
          <h2 id="pricing-table" className="t-headline font-medium text-ink">
            Preço em cada canal
          </h2>
          <div className="mt-3 overflow-x-auto rounded-lg bg-surface">
            {channels ? (
              <table className="t-body-sm w-full min-w-[420px] text-left">
                <thead className="text-ink-2">
                  <tr className="border-b border-line">
                    <th scope="col" className="px-5 py-3 font-medium">
                      Canal
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Taxa
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Preço final
                    </th>
                  </tr>
                </thead>
                <tbody aria-live="polite">
                  {channels.map((c) => (
                    <tr key={c.id} className="border-b border-line last:border-0">
                      <th scope="row" className="px-5 py-3 font-medium text-ink">
                        {c.name}
                      </th>
                      <td className="px-5 py-3 text-ink-2">{c.feeLabel}</td>
                      <td className="px-5 py-3 text-right text-ink tabular-nums">
                        {draft.nightlyNet > 0 ? formatBRL(channelPrice(draft.nightlyNet, c.feePct)) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col gap-3 p-5">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-6" />
                ))}
              </div>
            )}
          </div>
          <p className="t-caption mt-2 font-normal text-ink-2">Preços arredondados para cima, de 5 em 5 reais.</p>
        </section>
      </div>

      <div className="flex min-w-0 flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
          <Field id="f-cleaningFee" label="Taxa de limpeza" className="col-span-2 sm:col-span-1">
            <div className="relative">
              <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-2">
                R$
              </span>
              <Input
                id="f-cleaningFee"
                inputMode="numeric"
                placeholder="0"
                value={draft.cleaningFee ? formatNumber(draft.cleaningFee) : ''}
                onChange={(e) => update({ cleaningFee: toNumber(e.target.value) })}
                className={cn(fieldClass, 'pl-10')}
              />
            </div>
          </Field>
          <TimeSelect
            id="f-checkIn"
            label="Check-in a partir de"
            value={draft.checkIn}
            options={CHECKIN_TIMES}
            onChange={(v) => update({ checkIn: v })}
          />
          <TimeSelect
            id="f-checkOut"
            label="Check-out até"
            value={draft.checkOut}
            options={CHECKOUT_TIMES}
            onChange={(v) => update({ checkOut: v })}
          />
        </div>

        <div className="rounded-lg bg-surface px-6 py-1">
          <NumberStepper
            label="Mínimo de noites"
            value={draft.minNights}
            min={1}
            max={30}
            onChange={(v) => update({ minNights: v })}
            valueText={(v) => `Mínimo de ${v} ${v === 1 ? 'noite' : 'noites'}`}
          />
        </div>

        <section aria-labelledby="pricing-rules">
          <h2 id="pricing-rules" className="t-headline font-medium text-ink">
            Regras da casa
          </h2>
          <ul className="mt-3 divide-y divide-line rounded-lg bg-surface px-6">
            <ToggleRow label="Aceita pets" checked={pets} onChange={setPets} />
            <ToggleRow label="Permite festas" checked={draft.allowsParties} onChange={(v) => update({ allowsParties: v })} />
            <ToggleRow label="Proibido fumar" checked={draft.noSmoking} onChange={(v) => update({ noSmoking: v })} />
          </ul>
        </section>
      </div>
    </div>
  );
}
