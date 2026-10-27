import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/cn';
import { CHANNEL_IDS, CHANNEL_NAMES } from '@/mocks/types';
import { fieldA11y, fieldClass, titleForChannel, type StepProps } from '../useWizardDraft';
import { Field } from './StepDetails';

/** Limites de título conhecidos, caso a lista de canais ainda não tenha carregado. */
const FALLBACK_LIMITS: Partial<Record<string, number>> = { airbnb: 50, vrbo: 80 };

export function StepDescription({ draft, update, errors, channels }: StepProps) {
  const limitOf = (id: string) => {
    const ch = channels?.find((c) => c.id === id);
    return ch ? ch.titleMaxLength : (FALLBACK_LIMITS[id] ?? null);
  };
  const titleLen = draft.name.length;
  const airbnbMax = limitOf('airbnb') ?? 50;
  const overAirbnb = titleLen > airbnbMax;
  const descLen = draft.description.trim().length;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <Field
          id="f-name"
          label="Título"
          error={errors.name}
          hintId="f-name-hint"
          hint={
            <span className="flex flex-wrap justify-between gap-2">
              <span className={cn(overAirbnb && 'font-medium text-warning')}>
                {overAirbnb && <span aria-hidden="true">! </span>}
                Airbnb aceita até {airbnbMax} caracteres
                {overAirbnb ? '. O título será cortado lá.' : '.'}
              </span>
              <span className="tabular-nums" aria-live="polite">
                {titleLen} {titleLen === 1 ? 'caractere' : 'caracteres'}
              </span>
            </span>
          }
        >
          <Input
            {...fieldA11y('f-name', errors.name, 'f-name-hint')}
            value={draft.name}
            maxLength={120}
            placeholder="Ex.: Casa da Lagoa com deck e vista"
            onChange={(e) => update({ name: e.target.value })}
            className={fieldClass}
          />
        </Field>

        <Field
          id="f-description"
          label="Descrição"
          error={errors.description}
          hintId="f-description-hint"
          hint={
            <span className="flex flex-wrap justify-between gap-2">
              <span>Entre 50 e 2.000 caracteres. Conte o que torna a estadia especial.</span>
              <span className={cn('tabular-nums', descLen > 0 && descLen < 50 && 'text-warning')}>
                {descLen} / 2.000
              </span>
            </span>
          }
        >
          <Textarea
            {...fieldA11y('f-description', errors.description, 'f-description-hint')}
            value={draft.description}
            maxLength={2000}
            rows={8}
            onChange={(e) => update({ description: e.target.value })}
            className={cn(fieldClass, 'h-auto min-h-48 py-3 leading-[25px]')}
          />
        </Field>
      </div>

      <section aria-labelledby="desc-preview" className="h-fit rounded-lg bg-surface px-6 py-5">
        <h2 id="desc-preview" className="t-headline font-medium text-ink">
          Como fica em cada canal
        </h2>
        <ul className="mt-3 divide-y divide-line">
          {CHANNEL_IDS.map((id) => {
            const max = limitOf(id);
            const shown = titleForChannel(draft.name, max);
            const cut = max !== null && draft.name.trim().length > max;
            return (
              <li key={id} className="flex flex-col gap-1 py-3">
                <span className="t-caption flex items-center justify-between gap-2 text-ink-2">
                  {CHANNEL_NAMES[id]}
                  <span className={cn(cut && 'text-warning')}>
                    {max === null ? 'Sem corte' : cut ? `Cortado em ${max}` : `Até ${max}`}
                  </span>
                </span>
                <span className={cn('t-body-sm break-words', shown ? 'text-ink' : 'text-ink-2')}>
                  {shown || 'O título aparece aqui.'}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
