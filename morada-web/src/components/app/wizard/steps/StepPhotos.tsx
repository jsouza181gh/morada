import { useEffect, useRef, useState, type DragEvent, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, GripVertical, ImagePlus, Trash2 } from 'lucide-react';
import { Badge, Button, IconButton } from '@/components/ui';
import { springs, useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';
import { MIN_PHOTOS, SAMPLE_PHOTOS, type StepProps } from '../useWizardDraft';

type DragState = { url: string; pointerId: number; startX: number; startY: number; active: boolean };

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  if (item !== undefined) next.splice(to, 0, item);
  return next;
}

export function StepPhotos({ draft, update, errors }: StepProps) {
  const photos = draft.photos;
  const reduced = useReducedMotion();
  const [dragOver, setDragOver] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const tileRefs = useRef(new Map<string, HTMLLIElement>());
  const btnRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<{ url: string; side: 'left' | 'right' } | null>(null);
  const drag = useRef<DragState | null>(null);

  // Depois de mover pelo teclado, devolve o foco ao botão da mesma foto.
  useEffect(() => {
    const p = pendingFocus.current;
    if (!p) return;
    pendingFocus.current = null;
    const primary = btnRefs.current.get(`${p.url}|${p.side}`);
    const other = btnRefs.current.get(`${p.url}|${p.side === 'left' ? 'right' : 'left'}`);
    (primary && !primary.disabled ? primary : other)?.focus();
  }, [photos]);

  const describePosition = (index: number, total: number) =>
    `Foto movida para a posição ${index + 1} de ${total}.${index === 0 ? ' Agora é a capa.' : ''}`;

  const addFiles = (files: FileList | File[] | null) => {
    if (!files) return;
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => URL.createObjectURL(f));
    if (urls.length === 0) return;
    update((d) => ({ photos: [...d.photos, ...urls] }));
    setAnnounce(`${urls.length === 1 ? '1 foto adicionada' : `${urls.length} fotos adicionadas`}.`);
  };

  const addSamples = () => {
    update((d) => ({ photos: [...d.photos, ...SAMPLE_PHOTOS.filter((s) => !d.photos.includes(s))] }));
    setAnnounce('Fotos de exemplo adicionadas.');
  };

  const remove = (url: string) => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    update((d) => ({ photos: d.photos.filter((p) => p !== url) }));
    setAnnounce('Foto removida.');
  };

  const moveBy = (url: string, delta: -1 | 1) => {
    const from = photos.indexOf(url);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= photos.length) return;
    pendingFocus.current = { url, side: delta < 0 ? 'left' : 'right' };
    update({ photos: moveItem(photos, from, to) });
    setAnnounce(describePosition(to, photos.length));
  };

  /* ---- arrastar com mouse, caneta ou toque (pointer events) ---- */
  const onPointerDown = (e: PointerEvent<HTMLLIElement>, url: string) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    // No toque, só a alça inicia o arraste (o resto da foto continua rolando a página).
    if (e.pointerType === 'touch' && !target.closest('[data-drag-handle]')) return;
    drag.current = { url, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, active: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (!d.active) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return;
      d.active = true;
      setDragging(d.url);
    }
    for (const [url, el] of tileRefs.current) {
      if (url === d.url) continue;
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        const from = photos.indexOf(d.url);
        const to = photos.indexOf(url);
        if (from >= 0 && to >= 0 && from !== to) update({ photos: moveItem(photos, from, to) });
        break;
      }
    }
  };

  const endDrag = (e: PointerEvent<HTMLLIElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (d.active) {
      setDragging(null);
      const index = photos.indexOf(d.url);
      if (index >= 0) setAnnounce(describePosition(index, photos.length));
    }
  };

  /* ---- soltar arquivos ---- */
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const missing = Math.max(0, MIN_PHOTOS - photos.length);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="f-photos"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-12 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verde',
            dragOver
              ? 'border-verde bg-verde-soft'
              : errors.photos
                ? 'border-danger bg-surface'
                : 'border-line-strong bg-surface hover:bg-bg-alt',
          )}
        >
          <input
            id="f-photos"
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            aria-invalid={errors.photos ? true : undefined}
            aria-describedby={errors.photos ? 'f-photos-error' : 'f-photos-hint'}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <ImagePlus size={32} strokeWidth={1.5} aria-hidden="true" className="text-verde" />
          <span className="t-headline font-medium text-ink">Arraste as fotos para cá</span>
          <span id="f-photos-hint" className="t-body-sm text-ink-2">
            ou <span className="text-verde underline">escolha do computador</span>. JPG ou PNG.
          </span>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="t-body-sm text-ink-2" aria-live="polite">
            {photos.length === 0
              ? 'Nenhuma foto ainda.'
              : `${photos.length === 1 ? '1 foto' : `${photos.length} fotos`}${missing > 0 ? `. ${missing === 1 ? 'Falta 1' : `Faltam ${missing}`} para o mínimo.` : '.'}`}
          </p>
          <Button variant="secondary" size="sm" onClick={addSamples}>
            Usar fotos de exemplo
          </Button>
        </div>
        {errors.photos && (
          <p id="f-photos-error" className="t-body-sm text-danger">
            {errors.photos}
          </p>
        )}
      </div>

      {photos.length > 0 && (
        <section aria-labelledby="photos-order">
          <h2 id="photos-order" className="t-headline font-medium text-ink">
            Ordem das fotos
          </h2>
          <p className="t-body-sm mt-1 text-ink-2">
            Arraste para reordenar ou use os botões de cada foto. A primeira vira a capa.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((url, i) => {
              const isDragging = dragging === url;
              return (
                <motion.li
                  key={url}
                  layout={!reduced}
                  transition={springs.layout}
                  ref={(el: HTMLLIElement | null) => {
                    if (el) tileRefs.current.set(url, el);
                    else tileRefs.current.delete(url);
                  }}
                  onPointerDown={(e) => onPointerDown(e, url)}
                  onPointerMove={onPointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  className={cn(
                    'relative flex cursor-grab flex-col overflow-hidden rounded-lg bg-surface select-none',
                    isDragging && 'z-10 cursor-grabbing shadow-float ring-2 ring-verde',
                  )}
                  style={{ scale: isDragging && !reduced ? 1.03 : 1 }}
                >
                  <div className="relative aspect-[4/3] bg-verde-soft">
                    <img
                      width={1200}
                      height={800}
                      src={url}
                      alt={`Foto ${i + 1}${i === 0 ? ', capa' : ''}`}
                      loading="lazy"
                      draggable={false}
                      className="pointer-events-none size-full object-cover"
                    />
                    {i === 0 && (
                      <Badge tone="dark" className="absolute top-2 left-2">
                        Capa
                      </Badge>
                    )}
                    <span
                      data-drag-handle
                      aria-hidden="true"
                      className="absolute top-1.5 right-1.5 flex size-11 touch-none items-center justify-center rounded-pill bg-surface/85 text-ink backdrop-blur"
                    >
                      <GripVertical size={20} strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-1 py-1">
                    <div className="flex">
                      <IconButton
                        variant="ghost"
                        label={`Mover foto ${i + 1} para a esquerda`}
                        disabled={i === 0}
                        onClick={() => moveBy(url, -1)}
                        ref={(el) => {
                          if (el) btnRefs.current.set(`${url}|left`, el);
                          else btnRefs.current.delete(`${url}|left`);
                        }}
                      >
                        <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        variant="ghost"
                        label={`Mover foto ${i + 1} para a direita`}
                        disabled={i === photos.length - 1}
                        onClick={() => moveBy(url, 1)}
                        ref={(el) => {
                          if (el) btnRefs.current.set(`${url}|right`, el);
                          else btnRefs.current.delete(`${url}|right`);
                        }}
                      >
                        <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
                      </IconButton>
                    </div>
                    <IconButton variant="ghost" label={`Remover foto ${i + 1}`} onClick={() => remove(url)}>
                      <Trash2 size={20} strokeWidth={1.5} aria-hidden="true" />
                    </IconButton>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
