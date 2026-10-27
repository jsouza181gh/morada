import {
  Car,
  Check,
  CookingPot,
  Flame,
  Laptop,
  PawPrint,
  Snowflake,
  Waves,
  WashingMachine,
  Wifi,
  Fence,
  Beef,
  Star,
  Sunset,
  type LucideIcon,
} from 'lucide-react';
import type { Property } from '@/mocks/types';
import { Badge } from '@/components/ui';
import { formatBRL, formatNumber } from '@/lib/format';

const AMENITY_ICONS: Record<string, LucideIcon> = {
  'Wi-Fi': Wifi,
  'Cozinha completa': CookingPot,
  Estacionamento: Car,
  Deck: Fence,
  Churrasqueira: Beef,
  'Máquina de lavar': WashingMachine,
  'Espaço de trabalho': Laptop,
  'Ar-condicionado': Snowflake,
  'Aceita pets': PawPrint,
  Lareira: Flame,
  'Vista para o mar': Sunset,
  Piscina: Waves,
};

export function OverviewTab({ property: p }: { property: Property }) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-5">
        <section className="rounded-lg bg-surface p-6">
          <h2 className="t-headline mb-3 text-ink">Sobre o imóvel</h2>
          <p className="t-body max-w-[60ch] text-ink">{p.description}</p>
        </section>
        <section className="rounded-lg bg-surface p-6">
          <h2 className="t-headline mb-4 text-ink">Comodidades</h2>
          <ul className="flex flex-wrap gap-2">
            {p.amenities.map((a) => {
              const Icon = AMENITY_ICONS[a] ?? Check;
              return (
                <li key={a}>
                  <Badge tone="neutral" className="t-body-sm px-3 py-1.5 text-ink">
                    <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
                    {a}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <div className="flex flex-col gap-5">
        <section className="rounded-lg bg-surface p-6">
          <h2 className="t-headline mb-4 text-ink">Regras</h2>
          <dl className="t-body-sm grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            <dt className="text-ink-2">Check-in</dt>
            <dd className="text-right text-ink tabular-nums">a partir das {p.checkIn}</dd>
            <dt className="text-ink-2">Check-out</dt>
            <dd className="text-right text-ink tabular-nums">até as {p.checkOut}</dd>
            <dt className="text-ink-2">Mínimo de noites</dt>
            <dd className="text-right text-ink">
              {p.minNights} {p.minNights === 1 ? 'noite' : 'noites'}
            </dd>
            <dt className="text-ink-2">Taxa de limpeza</dt>
            <dd className="text-right text-ink tabular-nums">{formatBRL(p.cleaningFee)}</dd>
            <dt className="text-ink-2">Hóspedes</dt>
            <dd className="text-right text-ink">
              até {p.guests}, {p.bedrooms} {p.bedrooms === 1 ? 'quarto' : 'quartos'}, {p.bathrooms}{' '}
              {p.bathrooms === 1 ? 'banheiro' : 'banheiros'}
            </dd>
          </dl>
        </section>
        <section className="rounded-lg bg-surface p-6">
          <h2 className="t-headline mb-2 text-ink">Avaliações</h2>
          {p.reviewsCount > 0 ? (
            <p className="flex items-center gap-2">
              <Star aria-hidden="true" size={24} strokeWidth={1.5} className="fill-ouro text-ouro" />
              <span className="font-display text-[34px] leading-none font-medium text-ink">
                {formatNumber(p.rating, 2)}
              </span>
              <span className="t-body-sm text-ink-2">{formatNumber(p.reviewsCount)} avaliações</span>
            </p>
          ) : (
            <p className="t-body-sm text-ink-2">Ainda sem avaliações.</p>
          )}
        </section>
      </div>
    </div>
  );
}
