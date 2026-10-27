import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';
import { createProperty } from '@/mocks/api';
import type { Channel, ChannelId } from '@/mocks/types';
import type { PropertyDraft } from './useWizardDraft';

type Phase = 'waiting' | 'sending' | 'done';

type PublishProgressProps = {
  /** Imóvel a publicar; `null` mantém o diálogo fechado. */
  payload: PropertyDraft | null;
  /** Canais escolhidos, na ordem de publicação. */
  channels: Channel[];
  /** Chamado quando o imóvel foi criado (limpa o rascunho). */
  onPublished: () => void;
  /** "Cadastrar outro": fecha e recomeça o wizard. */
  onAnother: () => void;
  /** Fecha sem publicar (só em caso de erro). */
  onClose: () => void;
};

/** Duração determinística de 600–900ms por canal. */
const stepMs = (i: number) => 600 + ((i * 137) % 301);

export function PublishProgress({ payload, channels, onPublished, onAnother, onClose }: PublishProgressProps) {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [phases, setPhases] = useState<Partial<Record<ChannelId, Phase>>>({});
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const onPublishedRef = useRef(onPublished);
  useEffect(() => {
    onPublishedRef.current = onPublished;
  });
  const viewRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!payload) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const ids = channels.map((c) => c.id);
    // oxlint-disable-next-line react/set-state-in-effect -- reinicia o progresso a cada publicação
    setPhases(Object.fromEntries(ids.map((id) => [id, 'waiting'])) as Partial<Record<ChannelId, Phase>>);
    setCreatedId(null);
    setError(null);

    const created = createProperty(payload);
    const sequence = new Promise<void>((resolve) => {
      let elapsed = 0;
      channels.forEach((c, i) => {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setPhases((p) => ({ ...p, [c.id]: 'sending' }));
            setAnnounce(`${c.name}: enviando.`);
          }, elapsed),
        );
        elapsed += stepMs(i);
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setPhases((p) => ({ ...p, [c.id]: 'done' }));
            setAnnounce(`${c.name}: ${c.id === 'vrbo' ? 'em análise' : 'publicado'}.`);
            if (i === channels.length - 1) resolve();
          }, elapsed),
        );
      });
      if (channels.length === 0) resolve();
    });

    Promise.all([created, sequence])
      .then(([property]) => {
        if (cancelled) return;
        setCreatedId(property.id);
        setAnnounce('Seu imóvel está no ar.');
        onPublishedRef.current();
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Não foi possível publicar.');
      });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [payload, channels]);

  // Leva o foco ao botão principal quando termina.
  useEffect(() => {
    if (createdId) viewRef.current?.focus();
  }, [createdId]);

  const finished = createdId !== null;
  const running = payload !== null && !finished && !error;
  const doneCount = channels.filter((c) => phases[c.id] === 'done').length;
  const pct = channels.length ? Math.round((doneCount / channels.length) * 100) : 100;

  return (
    <Dialog
      open={payload !== null}
      onOpenChange={(open) => {
        if (!open && !running) (finished ? onAnother : onClose)();
      }}
    >
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(e) => running && e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="app-scope gap-5 rounded-card bg-surface p-8 text-ink ring-0 sm:max-w-[480px]"
      >
        <DialogTitle className="font-display text-[28px] leading-8 font-medium tracking-[-0.02em] break-words text-ink">
          {finished ? 'Seu imóvel está no ar.' : `Publicando ${payload?.name ?? ''}`}
        </DialogTitle>
        <DialogDescription className="t-body-sm text-ink-2">
          {error
            ? error
            : finished
              ? 'O Vrbo revisa anúncios novos. A Morada avisa quando ele for aprovado.'
              : 'Isso leva alguns segundos. Não feche esta janela.'}
        </DialogDescription>

        <div
          role="progressbar"
          aria-label="Progresso da publicação"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="h-1.5 overflow-hidden rounded-pill bg-bg-alt"
        >
          <div
            className={cn('h-full rounded-pill bg-verde', !reduced && 'transition-[width] duration-500 ease-out')}
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="divide-y divide-line">
          {channels.map((c) => {
            const phase = phases[c.id] ?? 'waiting';
            const review = c.id === 'vrbo';
            return (
              <li key={c.id} className="flex min-h-12 items-center justify-between gap-3 py-2">
                <span className="t-body font-medium text-ink">{c.name}</span>
                <span
                  className={cn(
                    't-body-sm inline-flex items-center gap-1.5',
                    phase === 'done' ? (review ? 'text-warning' : 'text-verde') : 'text-ink-2',
                  )}
                >
                  {phase === 'waiting' && 'Na fila'}
                  {phase === 'sending' && (
                    <>
                      <Loader2
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className={cn(!reduced && 'animate-spin')}
                      />
                      Enviando…
                    </>
                  )}
                  {phase === 'done' &&
                    (review ? (
                      <>
                        <span aria-hidden="true">•</span> Em análise
                      </>
                    ) : (
                      <>
                        <Check size={16} strokeWidth={2} aria-hidden="true" /> Publicado
                      </>
                    ))}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        {(finished || error) && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={finished ? onAnother : onClose}>
              {finished ? 'Cadastrar outro' : 'Voltar ao cadastro'}
            </Button>
            {finished && (
              <Button ref={viewRef} onClick={() => navigate(`/app/imoveis/${createdId}`)}>
                Ver imóvel
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
