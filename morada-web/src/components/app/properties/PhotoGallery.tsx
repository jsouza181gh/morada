import { useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { IconButton } from '@/components/ui';
import { cn } from '@/lib/cn';

export type PhotoGalleryProps = {
  name: string;
  photos: string[];
  coverIndex: number;
};

/** Ordem de exibição: capa primeiro, depois as demais na ordem original. */
function ordered(photos: string[], coverIndex: number) {
  const cover = photos[coverIndex];
  if (!cover) return photos;
  return [cover, ...photos.filter((_, i) => i !== coverIndex)];
}

export function PhotoGallery({ name, photos, coverIndex }: PhotoGalleryProps) {
  const list = ordered(photos, coverIndex);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const count = list.length;

  function show(i: number) {
    setIndex(i);
    setOpen(true);
  }

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setIndex(count - 1);
    }
  }

  if (count === 0) return null;
  const small = list.slice(1, 5);
  const current = list[index] ?? list[0];

  return (
    <>
      <div className="relative mb-10">
        <div className="grid h-[260px] grid-cols-6 grid-rows-2 gap-2 overflow-hidden rounded-card sm:h-[440px]">
          <button
            type="button"
            onClick={() => show(0)}
            aria-label={`Ampliar foto 1 de ${count}`}
            className="col-span-6 row-span-2 overflow-hidden bg-verde-soft sm:col-span-4"
          >
            <img
              width={1200}
              height={800}
              src={list[0]}
              alt={`Foto principal de ${name}`}
              className="size-full object-cover"
            />
          </button>
          {small.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => show(i + 1)}
              aria-label={`Ampliar foto ${i + 2} de ${count}`}
              className="hidden overflow-hidden bg-verde-soft sm:block"
            >
              <img width={1200} height={800} src={src} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => show(0)}
          className="t-body-sm absolute right-4 bottom-4 inline-flex min-h-11 items-center gap-2 rounded-pill bg-surface px-4 text-ink shadow-float hover:bg-bg-alt sm:min-h-10"
        >
          <Images aria-hidden="true" size={18} strokeWidth={1.5} />
          Ver as {count} fotos
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={onKeyDown}
          className="max-w-[calc(100%-2rem)] gap-3 rounded-lg bg-surface p-3 text-ink sm:max-w-[960px] sm:p-4"
        >
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <DialogTitle className="font-display text-[17px] font-medium text-ink">Fotos de {name}</DialogTitle>
              <DialogDescription className="t-body-sm text-ink-2" aria-live="polite">
                Foto {index + 1} de {count}. Use as setas para navegar.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <IconButton label="Fechar" variant="ghost" size="md">
                <X aria-hidden="true" size={20} strokeWidth={1.5} />
              </IconButton>
            </DialogClose>
          </div>
          <div className="relative overflow-hidden rounded-md bg-verde-soft">
            <img
              width={1200}
              height={800}
              key={current}
              src={current}
              alt={`Foto ${index + 1} de ${count} de ${name}`}
              className="aspect-[3/2] w-full object-cover"
            />
            <IconButton
              label="Foto anterior"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            >
              <ChevronLeft aria-hidden="true" size={20} strokeWidth={1.5} />
            </IconButton>
            <IconButton
              label="Próxima foto"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 -translate-y-1/2"
            >
              <ChevronRight aria-hidden="true" size={20} strokeWidth={1.5} />
            </IconButton>
          </div>
          <div className="flex justify-center gap-1.5" aria-hidden="true">
            {list.map((src, i) => (
              <span key={src} className={cn('size-1.5 rounded-pill', i === index ? 'bg-ink' : 'bg-line-strong')} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
