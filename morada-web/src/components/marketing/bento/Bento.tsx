import { RevealGroup, RevealItem } from '@/components/motion';
import { cn } from '@/lib/cn';
import { PriceChartTile } from './PriceChartTile';
import { RatingTile } from './RatingTile';
import { SyncTile } from './SyncTile';
import { RevenueDonutTile } from './RevenueDonutTile';
import { PhotosTile } from './PhotosTile';
import { SecurityTile } from './SecurityTile';
import { TeamTile } from './TeamTile';

const tile = 'rounded-card p-8 sm:p-10 min-w-0';
const light = 'bg-bg-alt text-ink';

/** Grade de recursos ("Explore os detalhes"). Mobile 1 coluna, tablet 2, desktop 6. */
export function Bento() {
  return (
    <section id="recursos" aria-labelledby="recursos-title" className="bg-bg py-36 px-4">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-12">
        <h2 id="recursos-title" className="t-section-xl text-center">
          Feito para quem
          <br />
          vive de temporada.
        </h2>

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
          <RevealItem className={cn(tile, light, 'sm:col-span-2 md:col-span-4 md:row-span-2 md:min-h-[520px]')}>
            <PriceChartTile />
          </RevealItem>
          <RevealItem className={cn(tile, light, 'md:col-span-2')}>
            <RatingTile />
          </RevealItem>
          <RevealItem className={cn(tile, 'bg-surface-dark text-on-dark md:col-span-2')}>
            <SyncTile />
          </RevealItem>
          <RevealItem className={cn(tile, light, 'sm:col-span-2 md:col-span-3')}>
            <RevenueDonutTile />
          </RevealItem>
          <RevealItem className={cn(tile, light, 'sm:col-span-2 md:col-span-3')}>
            <PhotosTile />
          </RevealItem>
          <RevealItem className={cn(tile, light, 'md:col-span-2')}>
            <SecurityTile />
          </RevealItem>
          <RevealItem className={cn(tile, light, 'md:col-span-4')}>
            <TeamTile />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
