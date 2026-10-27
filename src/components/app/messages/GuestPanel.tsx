import { useId, type ReactNode } from 'react';
import { Avatar, Badge, type BadgeProps, Button } from '@/components/ui';
import { CHANNEL_NAMES, type Property, type Reservation, type ReservationStatus } from '@/mocks/types';
import { formatBRL, formatRange } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { InboxConversation } from './ConversationItem';

const STATUS: Record<ReservationStatus, { label: string; tone: BadgeProps['tone']; mark: string }> = {
  confirmed: { label: 'Confirmada', tone: 'verde', mark: '✓' },
  pending_payment: { label: 'Aguardando pagamento', tone: 'warning', mark: '•' },
  cancelled: { label: 'Cancelada', tone: 'danger', mark: '!' },
  blocked: { label: 'Bloqueio', tone: 'neutral', mark: '–' },
};

export type GuestPanelProps = {
  conversation: InboxConversation;
  property?: Property;
  reservation?: Reservation;
  onCheckinShortcut: () => void;
  className?: string;
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="t-caption text-ink-2">{label}</dt>
      <dd className="t-body-sm text-right text-ink">{children}</dd>
    </div>
  );
}

export function GuestPanel({ conversation, property, reservation, onCheckinShortcut, className }: GuestPanelProps) {
  const uid = useId();
  const channel = CHANNEL_NAMES[conversation.channelId];
  const status = reservation ? STATUS[reservation.status] : undefined;
  const cover = property ? property.photos[property.coverIndex] : undefined;

  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar name={conversation.guestName} size={72} />
        <div>
          <h2 className="text-[19px] leading-6 font-medium text-ink">{conversation.guestName}</h2>
          <p className="t-caption mt-1 text-ink-2">Hóspede via {channel}</p>
        </div>
      </div>

      {reservation && (
        <section aria-labelledby={`${uid}-reserva`} className="flex flex-col gap-4 rounded-lg bg-surface p-4">
          <h3 id={`${uid}-reserva`} className="t-caption text-ink-2">
            Reserva
          </h3>
          {property && (
            <div className="flex items-center gap-3">
              {cover && (
                <img
                  width={1200}
                  height={800}
                  src={cover}
                  alt={property.name}
                  loading="lazy"
                  className="size-14 shrink-0 rounded-md bg-verde-soft object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="t-body-sm truncate font-medium text-ink">{property.name}</p>
                <p className="t-caption truncate text-ink-2">
                  {property.neighborhood}, {property.city}
                </p>
              </div>
            </div>
          )}
          <dl className="flex flex-col gap-2">
            <Row label="Datas">{formatRange(reservation.checkIn, reservation.checkOut)}</Row>
            <Row label="Hóspedes">
              {reservation.guests} {reservation.guests === 1 ? 'hóspede' : 'hóspedes'}
            </Row>
            <Row label="Valor">{formatBRL(reservation.total)}</Row>
            {status && (
              <Row label="Status">
                <Badge tone={status.tone}>
                  <span aria-hidden="true">{status.mark}</span>
                  {status.label}
                </Badge>
              </Row>
            )}
          </dl>
          <Button variant="link" size="sm" href={`/app/reservas?r=${reservation.id}`} className="self-start">
            Ver reserva
          </Button>
        </section>
      )}

      {property && (
        <section aria-labelledby={`${uid}-imovel`} className="flex flex-col gap-3">
          <h3 id={`${uid}-imovel`} className="t-caption text-ink-2">
            Imóvel
          </h3>
          <dl className="flex flex-col gap-2">
            <Row label="Check-in">a partir das {property.checkIn}</Row>
            <Row label="Check-out">até {property.checkOut}</Row>
            <Row label="Endereço">
              {property.neighborhood}, {property.city} – {property.state}
            </Row>
          </dl>
        </section>
      )}

      <section aria-labelledby={`${uid}-atalhos`} className="flex flex-col gap-3">
        <h3 id={`${uid}-atalhos`} className="t-caption text-ink-2">
          Atalhos
        </h3>
        <Button variant="secondary" size="sm" fullWidth onClick={onCheckinShortcut} className="max-sm:min-h-11">
          Enviar instruções de check-in
        </Button>
      </section>
    </div>
  );
}
