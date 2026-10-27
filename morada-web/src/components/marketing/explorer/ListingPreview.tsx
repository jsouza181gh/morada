import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AnimatePresence, motion } from 'motion/react';
import { Star } from 'lucide-react';
import { PhoneFrame, PhoneStatusBar } from '@/components/mockups';
import { Badge, Skeleton } from '@/components/ui';
import { easeApple, useReducedMotion } from '@/components/motion';
import { formatBRL, formatNumber } from '@/lib/format';
import type { Channel, ChannelId, ListingStatus, Property } from '@/mocks/types';

/** Complementos fixos de cada canal (texto do mockup; números vêm do imóvel). */
function complementsFor(id: ChannelId, p: Property): { subtitle: string; cta: string; tags: string[] } {
  switch (id) {
    case 'airbnb':
      return {
        subtitle: `Casa inteira em ${p.city}`,
        cta: 'Reservar',
        tags: [`${p.guests} hóspedes`, `${p.bedrooms} quartos`, 'Wi-Fi'],
      };
    case 'booking':
      return {
        subtitle: `Casa de temporada, ${p.neighborhood}`,
        cta: 'Ver disponibilidade',
        tags: ['Cancelamento grátis', 'Estacionamento'],
      };
    case 'vrbo':
      return {
        subtitle: `Casa, ${p.guests} hóspedes, ${p.city}`,
        cta: 'Solicitar reserva',
        tags: ['Ideal para famílias', 'Deck'],
      };
    case 'trivago':
      return { subtitle: 'Comparado com 2 ofertas', cta: 'Ver oferta', tags: ['Melhor preço'] };
    case 'decolar':
      return { subtitle: `Aluguel de temporada, ${p.city}`, cta: 'Reservar', tags: ['Parcelamento'] };
    case 'expedia':
      return { subtitle: `Vacation home in ${p.city}`, cta: 'Reserve', tags: ['Free Wi-Fi', 'Deck'] };
  }
}

const STATUS: Record<ListingStatus, { tone: 'verde' | 'warning' | 'danger' | 'neutral'; label: string; mark: string }> =
  {
    published: { tone: 'verde', label: 'Publicado', mark: '✓' },
    pending: { tone: 'warning', label: 'Em análise', mark: '•' },
    error: { tone: 'danger', label: 'Erro', mark: '!' },
    off: { tone: 'neutral', label: 'Desligado', mark: '–' },
  };

/** Celular menor em telas muito estreitas (375px), para não gerar rolagem horizontal. */
const NARROW_QUERY = '(max-width: 400px)';

export type ListingPreviewProps = {
  channel: Channel | undefined;
  property: Property | undefined;
  panelId: string;
  labelledBy: string | undefined;
};

export function ListingPreview({ channel, property, panelId, labelledBy }: ListingPreviewProps) {
  const reduced = useReducedMotion();
  const narrow = useMediaQuery(NARROW_QUERY);
  const ready = channel && property;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={labelledBy}
      aria-live="polite"
      aria-busy={!ready}
      className="flex min-w-0 flex-[999_1_380px] flex-col items-center justify-center gap-6"
    >
      <PhoneFrame width={narrow ? 270 : 300}>
        <div className="relative flex h-full flex-col">
          <PhoneStatusBar className="absolute inset-x-0 top-0 z-[5] text-ink" />
          {ready ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={channel.id}
                className="flex h-full flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: reduced ? 0 : 0.4, ease: easeApple } }}
                exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.2, ease: easeApple } }}
              >
                <ScreenContent channel={channel} property={property} />
              </motion.div>
            </AnimatePresence>
          ) : (
            <ScreenSkeleton />
          )}
        </div>
      </PhoneFrame>

      {/* < 1068px: o blurb aparece abaixo do celular (no desktop ele fica no cartão da lista). */}
      <div className="min-h-[66px] max-w-[46ch] text-center md:hidden">
        {channel ? (
          <p className="text-[15px] leading-[22px] text-ink-2">{channel.blurb}</p>
        ) : (
          <Skeleton className="mx-auto h-11 w-72" />
        )}
      </div>
    </div>
  );
}

function ScreenContent({ channel, property }: { channel: Channel; property: Property }) {
  const listing = property.channels[channel.id];
  const extra = complementsFor(channel.id, property);
  const status = STATUS[listing.status];
  const cover = property.photos[property.coverIndex] ?? property.photos[0];

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-line px-4.5 pt-[52px] pb-3">
        <span className="text-[13px] font-semibold">{channel.name}</span>
        <Badge tone={status.tone} className="px-2 py-0.5 text-[11px]">
          <span aria-hidden="true">{status.mark}</span>
          {status.label}
        </Badge>
      </div>

      <div className="relative h-[210px] shrink-0 bg-verde-soft">
        <img
          width={1200}
          height={800}
          src={cover}
          alt={`Foto de capa da ${property.name}, em ${property.neighborhood}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 bottom-3 rounded-pill bg-black/55 px-2.5 py-0.5 text-[11px] text-white">
          1 de {property.photos.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-4.5 pt-4">
        <p className="line-clamp-2 text-[18px] leading-[23px] font-semibold">{listing.title}</p>
        <p className="text-[13px] text-ink-2">{extra.subtitle}</p>
        <p className="flex items-center gap-1 text-[13px]">
          <Star aria-hidden="true" strokeWidth={1.5} className="size-3.5 fill-ouro text-ouro" />
          <span>
            {formatNumber(property.rating, 2)} ({property.reviewsCount} avaliações)
          </span>
        </p>
        <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Destaques">
          {extra.tags.map((t) => (
            <li key={t} className="rounded-pill bg-bg-alt px-2.5 py-1 text-[11px] text-ink-2">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-4.5 pt-3 pb-6">
        <p className="text-[13px] text-ink-2">
          <strong className="text-[16px] font-semibold text-ink">{formatBRL(listing.price)}</strong> noite
        </p>
        <span
          aria-hidden="true"
          className="rounded-pill bg-verde px-3.5 py-2 text-[12px] font-semibold whitespace-nowrap text-on-verde"
        >
          {extra.cta}
        </span>
      </div>
    </>
  );
}

function ScreenSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4.5 pt-[52px] pb-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-16 rounded-pill" />
      </div>
      <Skeleton className="h-[210px] shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col gap-3 px-4.5 pt-4">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3.5 w-2/5" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16 rounded-pill" />
          <Skeleton className="h-6 w-20 rounded-pill" />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4.5 pt-3 pb-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-24 rounded-pill" />
      </div>
    </div>
  );
}
