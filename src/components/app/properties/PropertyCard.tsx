import { Link } from 'react-router';
import { Star } from 'lucide-react';
import type { Property } from '@/mocks/types';
import { formatBRL, formatDateShort, formatNumber } from '@/lib/format';
import { ChannelStatusList } from './ChannelStatusList';

export type PropertyCardProps = {
  property: Property;
  /** Data 'YYYY-MM-DD' da próxima chegada, se houver. */
  nextArrival?: string;
};

function formatRating(rating: number): string {
  return formatNumber(rating, 2);
}

export function PropertyCard({ property: p, nextArrival }: PropertyCardProps) {
  const cover = p.photos[p.coverIndex] ?? p.photos[0];
  return (
    <article className="relative flex flex-col overflow-hidden rounded-lg bg-surface transition-transform duration-200 focus-within:ring-2 focus-within:ring-verde hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="relative">
        {cover && (
          <img
            width={1200}
            height={800}
            src={cover}
            alt={`Foto de capa de ${p.name}`}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-t-lg bg-verde-soft object-cover"
          />
        )}
        {p.reviewsCount > 0 && (
          <span className="t-caption absolute top-3 left-3 inline-flex items-center gap-1 rounded-pill bg-surface px-2.5 py-1 text-ink shadow-float">
            <Star aria-hidden="true" size={14} strokeWidth={1.5} className="fill-ouro text-ouro" />
            <span className="sr-only">Nota </span>
            {formatRating(p.rating)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h2 className="text-[17px] leading-6 font-medium text-ink">
            <Link to={`/app/imoveis/${p.id}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {p.name}
            </Link>
          </h2>
          <p className="t-body-sm text-ink-2">
            {p.neighborhood}, {p.city}
          </p>
          <p className="t-body-sm text-ink-2">
            {p.guests} hóspedes, {p.bedrooms} {p.bedrooms === 1 ? 'quarto' : 'quartos'}
          </p>
        </div>
        <ChannelStatusList variant="compact" listings={p.channels} />
        <div className="t-body-sm mt-auto flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-line pt-3 text-ink-2">
          <span>
            <span className="font-medium text-ink">{formatBRL(p.nightlyNet)}</span> por noite (você recebe)
          </span>
          <span>{nextArrival ? `Próxima chegada ${formatDateShort(nextArrival)}` : 'Sem chegadas marcadas'}</span>
        </div>
      </div>
    </article>
  );
}
