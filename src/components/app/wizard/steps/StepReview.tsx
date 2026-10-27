import type { ReactNode } from 'react';
import { Badge, Button } from '@/components/ui';
import { formatBRL } from '@/lib/format';
import { channelPrice } from '@/mocks/properties';
import {
  PETS_AMENITY,
  STEP_LABELS,
  TYPE_LABEL,
  readinessFor,
  titleForChannel,
  type StepProps,
} from '../useWizardDraft';

type ReviewSectionProps = {
  id: string;
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: ReactNode;
};

function ReviewSection({ id, title, step, onEdit, children }: ReviewSectionProps) {
  return (
    <section aria-labelledby={id} className="rounded-lg bg-surface p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="t-headline font-medium text-ink">
          {title}
        </h2>
        <Button
          variant="link"
          size="sm"
          onClick={() => onEdit(step)}
          aria-label={`Editar ${STEP_LABELS[step]?.toLowerCase()}`}
        >
          Editar
        </Button>
      </div>
      <div className="t-body-sm mt-3 text-ink">{children}</div>
    </section>
  );
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function StepReview({ draft, channels, onEdit }: StepProps & { onEdit: (step: number) => void }) {
  const chosen = (channels ?? []).filter((c) => draft.selectedChannels.includes(c.id));
  const rules = [
    draft.amenities.includes(PETS_AMENITY) ? 'Aceita pets' : 'Não aceita pets',
    draft.allowsParties ? 'Permite festas' : 'Sem festas',
    draft.noSmoking ? 'Proibido fumar' : 'Permite fumar',
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ReviewSection id="rv-local" title="Local" step={0} onEdit={onEdit}>
        <p>
          {draft.street}, {draft.number}
          {draft.complement ? ` – ${draft.complement}` : ''}
        </p>
        <p className="text-ink-2">
          {draft.neighborhood}, {draft.city} – {draft.state} · CEP {draft.cep}
        </p>
        <p className="mt-2 text-ink-2">{TYPE_LABEL[draft.type]}</p>
      </ReviewSection>

      <ReviewSection id="rv-details" title="Detalhes" step={1} onEdit={onEdit}>
        <p>
          {[
            plural(draft.guests, 'hóspede', 'hóspedes'),
            plural(draft.bedrooms, 'quarto', 'quartos'),
            plural(draft.beds, 'cama', 'camas'),
            plural(draft.bathrooms, 'banheiro', 'banheiros'),
          ].join(' · ')}
        </p>
        <p className="mt-2 text-ink-2">
          {draft.amenities.length > 0 ? draft.amenities.join(', ') : 'Nenhuma comodidade marcada.'}
        </p>
      </ReviewSection>

      <ReviewSection id="rv-photos" title="Fotos" step={2} onEdit={onEdit}>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-3">
          {draft.photos.slice(0, 6).map((url, i) => (
            <li key={url} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-verde-soft">
              <img
                width={1200}
                height={800}
                src={url}
                alt={`Foto ${i + 1}${i === 0 ? ', capa' : ''}`}
                loading="lazy"
                className="size-full object-cover"
              />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-ink-2">{plural(draft.photos.length, 'foto', 'fotos')}. A primeira é a capa.</p>
      </ReviewSection>

      <ReviewSection id="rv-description" title="Descrição" step={3} onEdit={onEdit}>
        <p className="font-medium break-words">{draft.name}</p>
        <p className="mt-1 line-clamp-4 break-words whitespace-pre-line text-ink-2">{draft.description}</p>
      </ReviewSection>

      <ReviewSection id="rv-pricing" title="Preço e regras" step={4} onEdit={onEdit}>
        <p>
          Você recebe <span className="font-medium">{formatBRL(draft.nightlyNet)}</span> por noite · limpeza{' '}
          {formatBRL(draft.cleaningFee)} · mínimo de {plural(draft.minNights, 'noite', 'noites')}
        </p>
        <p className="mt-1 text-ink-2">
          Check-in a partir de {draft.checkIn} · check-out até {draft.checkOut} · {rules.join(' · ')}
        </p>
        {chosen.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[280px] text-left">
              <caption className="sr-only">Preço por noite em cada canal escolhido</caption>
              <tbody>
                {chosen.map((c) => (
                  <tr key={c.id} className="border-t border-line">
                    <th scope="row" className="py-2 font-normal text-ink-2">
                      {c.name}
                    </th>
                    <td className="py-2 text-right tabular-nums">
                      {formatBRL(channelPrice(draft.nightlyNet, c.feePct))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ReviewSection>

      <ReviewSection id="rv-channels" title="Canais" step={5} onEdit={onEdit}>
        {chosen.length === 0 ? (
          <p className="text-danger">Nenhum canal escolhido.</p>
        ) : (
          <ul className="divide-y divide-line">
            {chosen.map((c) => {
              const ready = readinessFor(c.id, draft.photos.length);
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">
                    <span className="font-medium">{c.name}</span>
                    <span className="block truncate text-ink-2">{titleForChannel(draft.name, c.titleMaxLength)}</span>
                  </span>
                  <Badge tone={ready.tone}>
                    <span aria-hidden="true">
                      {ready.tone === 'verde' ? '✓' : ready.tone === 'warning' ? '•' : '!'}
                    </span>
                    {ready.label}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </ReviewSection>
    </div>
  );
}
