import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMock } from '@/hooks/useMock';
import { getProperty } from '@/mocks/api';
import { cn } from '@/lib/cn';

const SHOWN = 5;
// Recorte que cada foto ganha no hover, como se fosse preparada para um canal.
const CROPS = [
  { label: '16:9', ratio: '16 / 9' },
  { label: '4:3', ratio: '4 / 3' },
  { label: '1:1', ratio: '1 / 1' },
  { label: '16:9', ratio: '16 / 9' },
  { label: '4:3', ratio: '4 / 3' },
] as const;

const fetchLagoa = () => getProperty('lagoa');

export function PhotosTile() {
  const reduced = useReducedMotion();
  const { data: property } = useMock(fetchLagoa);
  const [cropping, setCropping] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function showCrops() {
    if (cropping) return;
    setCropping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCropping(false), 1000);
  }

  const photos = property?.photos.slice(0, SHOWN) ?? [];
  const extra = property ? property.photos.length - photos.length : 0;

  return (
    <div className="flex h-full flex-col gap-8">
      <h3 className="font-display text-[28px] leading-[32px] font-semibold tracking-[-0.02em]">
        Fotos uma vez. <span className="text-ink-2">No tamanho que cada canal pede.</span>
      </h3>

      <div className="mt-auto grid grid-cols-4 gap-2 sm:gap-3" onPointerEnter={showCrops}>
        {property
          ? photos.map((src, i) => {
              const crop = CROPS[i % CROPS.length] ?? CROPS[0];
              const big = i === 0;
              const last = i === photos.length - 1;
              return (
                <div
                  key={src}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-[14px] bg-verde-soft',
                    big && 'col-span-2 row-span-2',
                  )}
                >
                  <img
                    width={1200}
                    height={800}
                    src={src}
                    alt={big ? `${property.name}, foto de capa` : `${property.name}, foto ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover"
                  />
                  {last && extra > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[17px] font-semibold text-white">
                      <span aria-hidden="true">+{extra}</span>
                      <span className="sr-only">{`Mais ${extra} ${extra === 1 ? 'foto' : 'fotos'}`}</span>
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute inset-0 flex items-center justify-center',
                      !reduced && 'transition-opacity duration-300',
                      cropping ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    <div
                      className="flex max-h-full w-[86%] items-start justify-start rounded-[8px] border-2 border-white shadow-[0_0_0_999px_rgba(0,0,0,.35)]"
                      style={{ aspectRatio: crop.ratio }}
                    >
                      <span className="m-1.5 rounded-pill bg-white px-2 py-0.5 text-[11px] leading-4 font-semibold text-[#1d1d1f]">
                        {crop.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          : Array.from({ length: SHOWN }, (_, i) => (
              <Skeleton key={i} className={cn('aspect-square rounded-[14px]', i === 0 && 'col-span-2 row-span-2')} />
            ))}
      </div>
    </div>
  );
}
