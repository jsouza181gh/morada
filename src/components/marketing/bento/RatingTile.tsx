import { Star } from 'lucide-react';
import { CountUp } from '@/components/motion';
import { useMock } from '@/hooks/useMock';
import { getDashboardSummary } from '@/mocks/api';

const twoDecimals = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// CountUp arredonda para inteiro a cada quadro: contamos em centésimos.
const fromHundredths = (v: number) => twoDecimals.format(v / 100);

export function RatingTile() {
  const { data } = useMock(getDashboardSummary);

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex gap-1" role="img" aria-label="5 estrelas">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={22} strokeWidth={1.5} className="fill-ouro text-ouro" aria-hidden="true" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <p className="t-stat">
          {data ? (
            <CountUp from={400} to={Math.round(data.rating * 100)} format={fromHundredths} />
          ) : (
            <span className="opacity-0" aria-hidden="true">
              0,00
            </span>
          )}
        </p>
        <p className="t-body-sm text-ink-2">Sua nota média, somando as avaliações de todos os canais.</p>
      </div>
    </div>
  );
}
