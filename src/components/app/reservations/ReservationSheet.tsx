import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Link } from 'react-router';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button, IconButton } from '@/components/ui';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/cn';
import { addDays, diffDays } from '@/lib/date';
import { formatBRL, formatDateShort, formatWeekday } from '@/lib/format';
import {
  CHANNEL_IDS,
  CHANNEL_NAMES,
  type Channel,
  type ChannelId,
  type Conversation,
  type Property,
  type Reservation,
} from '@/mocks/types';
import { StatusBadge } from './StatusBadge';

export type ReservationSheetProps = {
  reservation: Reservation | undefined;
  properties: Property[];
  channels: Channel[];
  conversations: Conversation[];
  onClose: () => void;
  /** Elemento que abriu o painel; recebe o foco ao fechar. */
  returnFocusTo: () => HTMLElement | null;
};

const DESKTOP_QUERY = '(min-width: 734px)';

// Decolar e Expedia usam artigo feminino ("na Decolar", "pela Expedia").
const FEMININE: ChannelId[] = ['decolar', 'expedia'];
const em = (id: ChannelId) => `${FEMININE.includes(id) ? 'na' : 'no'} ${CHANNEL_NAMES[id]}`;
const por = (id: ChannelId) => `${FEMININE.includes(id) ? 'pela' : 'pelo'} ${CHANNEL_NAMES[id]}`;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const longDate = (iso: string) => `${formatWeekday(iso)}, ${formatDateShort(iso)}`;

type TimelineEvent = { label: string; date: string };

function timelineFor(r: Reservation, property: Property | undefined): TimelineEvent[] {
  const created = r.createdAt.slice(0, 10);
  const others = property
    ? CHANNEL_IDS.filter((id) => id !== r.channelId && property.channels[id].status === 'published').length
    : 0;
  const closed = others > 0 ? `Datas fechadas em ${plural(others, 'canal', 'canais')}` : null;

  if (r.status === 'blocked' || !r.channelId) {
    return [
      { label: 'Datas bloqueadas por você', date: created },
      ...(closed ? [{ label: closed, date: created }] : []),
    ];
  }
  const events: TimelineEvent[] = [{ label: `Reserva criada ${em(r.channelId)}`, date: created }];
  if (closed) events.push({ label: closed, date: created });
  if (r.status === 'confirmed') events.push({ label: 'Pagamento confirmado', date: created });
  if (r.status === 'pending_payment') events.push({ label: 'Aguardando pagamento do hóspede', date: created });
  if (r.status === 'cancelled') {
    const day = addDays(created, 1) < r.checkIn ? addDays(created, 1) : created;
    events.push({ label: 'Reserva cancelada pelo hóspede', date: day });
    if (others > 0) events.push({ label: `Datas reabertas em ${plural(others, 'canal', 'canais')}`, date: day });
  }
  return events;
}

export function ReservationSheet({
  reservation,
  properties,
  channels,
  conversations,
  onClose,
  returnFocusTo,
}: ReservationSheetProps) {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  // Mantém o conteúdo visível durante a animação de saída.
  const [shown, setShown] = useState(reservation);
  if (reservation && reservation !== shown) setShown(reservation);

  const r = reservation ?? shown;
  const property = r ? properties.find((p) => p.id === r.propertyId) : undefined;
  const channel = r?.channelId ? channels.find((c) => c.id === r.channelId) : undefined;
  const conversation = r ? conversations.find((c) => c.reservationId === r.id) : undefined;

  return (
    <Sheet open={Boolean(reservation)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={desktop ? 'right' : 'bottom'}
        showCloseButton={false}
        onCloseAutoFocus={(e) => {
          const el = returnFocusTo();
          if (el?.isConnected) {
            e.preventDefault();
            el.focus();
          }
        }}
        className={cn(
          'app-scope gap-0 overflow-y-auto border-line bg-surface p-0 text-ink',
          'data-[side=right]:w-[440px] data-[side=right]:max-w-full data-[side=right]:sm:max-w-[440px]',
          'data-[side=bottom]:max-h-[88dvh] data-[side=bottom]:rounded-t-lg',
        )}
      >
        {r && (
          <div className="flex flex-col gap-6 p-6 pb-[calc(24px+env(safe-area-inset-bottom))]">
            <header className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-3">
                <SheetTitle className="font-display text-[28px] leading-[1.15] font-medium tracking-[-0.02em] text-ink">
                  {r.guestName}
                </SheetTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={r.status} />
                  <span className="t-body-sm text-ink-2">
                    {r.channelId ? CHANNEL_NAMES[r.channelId] : 'Bloqueio manual'}
                  </span>
                </div>
                <SheetDescription className="t-body-sm text-ink-2">
                  {r.status === 'blocked'
                    ? (r.note ?? 'Datas fechadas por você.')
                    : `${plural(r.guests, 'hóspede', 'hóspedes')} · ${property?.name ?? ''}`}
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <IconButton label="Fechar" variant="ghost" size="md" className="-mt-2 -mr-2">
                  <X size={20} strokeWidth={1.5} aria-hidden="true" />
                </IconButton>
              </SheetClose>
            </header>

            <section aria-label="Datas" className="grid grid-cols-3 gap-3 rounded-md bg-bg-alt p-4">
              <div>
                <p className="t-caption text-ink-2">Check-in</p>
                <p className="t-body-sm font-medium text-ink">{longDate(r.checkIn)}</p>
                {property && <p className="t-caption text-ink-2">a partir das {property.checkIn}</p>}
              </div>
              <div>
                <p className="t-caption text-ink-2">Check-out</p>
                <p className="t-body-sm font-medium text-ink">{longDate(r.checkOut)}</p>
                {property && <p className="t-caption text-ink-2">até as {property.checkOut}</p>}
              </div>
              <div>
                <p className="t-caption text-ink-2">Noites</p>
                <p className="t-body-sm font-medium text-ink">{diffDays(r.checkIn, r.checkOut)}</p>
              </div>
            </section>

            {property && (
              <Link
                to={`/app/imoveis/${property.id}`}
                className="group flex items-center gap-4 rounded-md p-1 -m-1 transition-colors hover:bg-bg-alt"
              >
                <img
                  width={1200}
                  height={800}
                  src={property.photos[property.coverIndex] ?? property.photos[0]}
                  alt={property.name}
                  loading="lazy"
                  className="h-14 w-20 shrink-0 rounded-sm bg-verde-soft object-cover"
                />
                <span className="min-w-0">
                  <span className="t-body-sm block font-medium text-ink group-hover:text-verde">{property.name}</span>
                  <span className="t-caption block text-ink-2">
                    {property.neighborhood}, {property.city}/{property.state}
                  </span>
                </span>
              </Link>
            )}

            {r.channelId && property && (
              <Values r={r} channelId={r.channelId} property={property} feePct={channel?.feePct ?? 0} />
            )}

            <section aria-labelledby="reserva-historico">
              <h3 id="reserva-historico" className="t-body-sm mb-3 font-medium text-ink">
                Histórico
              </h3>
              <ol className="flex flex-col gap-3">
                {timelineFor(r, property).map((ev, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-pill bg-line-strong" />
                    <span className="t-body-sm text-ink">
                      {ev.label}
                      <span className="t-caption block text-ink-2">{formatDateShort(ev.date)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="flex flex-col items-start gap-3">
              {conversation && (
                <Button variant="link" href={`/app/mensagens?c=${conversation.id}`}>
                  Abrir conversa
                </Button>
              )}
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" href={`/app/calendario?imovel=${r.propertyId}`}>
                  Ver no calendário
                </Button>
                {r.status === 'pending_payment' && r.channelId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast(`Lembrete enviado ${por(r.channelId as ChannelId)}.`)}
                  >
                    Lembrar hóspede do pagamento
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Values({
  r,
  channelId,
  property,
  feePct,
}: {
  r: Reservation;
  channelId: ChannelId;
  property: Property;
  feePct: number;
}) {
  const nights = diffDays(r.checkIn, r.checkOut);
  const nightly = property.channels[channelId].price;
  const fee = Math.round(r.total * feePct);
  return (
    <section aria-labelledby="reserva-valores">
      <h3 id="reserva-valores" className="t-body-sm mb-3 font-medium text-ink">
        Valores
      </h3>
      <dl className="t-body-sm flex flex-col gap-2">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-2">
            {formatBRL(nightly)} × {plural(nights, 'noite', 'noites')}
          </dt>
          <dd className="tabular-nums">{formatBRL(r.total)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-2">
            Taxa {em(channelId).replace(/^n/, 'd')} (estimada, {Math.round(feePct * 100)}%)
          </dt>
          <dd className="tabular-nums">{fee > 0 ? `− ${formatBRL(fee)}` : formatBRL(0)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-line pt-2">
          <dt className="font-medium text-ink">Você recebe</dt>
          <dd className="font-medium text-verde tabular-nums">{formatBRL(r.total - fee)}</dd>
        </div>
      </dl>
      {r.status === 'cancelled' && (
        <p className="t-caption mt-2 text-ink-2">Reserva cancelada. Valores apenas para referência.</p>
      )}
    </section>
  );
}
