import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Badge, Button, Skeleton, Switch } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useReducedMotion } from '@/components/motion';
import { cn } from '@/lib/cn';
import type { Channel, ChannelId } from '@/mocks/types';
import { ListingPreviewCard } from '../ListingPreviewCard';
import { isConnected, readinessFor, type StepProps } from '../useWizardDraft';

export function StepChannels({ draft, update, channels }: StepProps) {
  const reduced = useReducedMotion();
  const [previewId, setPreviewId] = useState<ChannelId>(() => draft.selectedChannels[0] ?? 'airbnb');
  const [connecting, setConnecting] = useState<Channel | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const setSelected = (id: ChannelId, on: boolean) =>
    update((d) => ({
      selectedChannels: on ? [...d.selectedChannels.filter((x) => x !== id), id] : d.selectedChannels.filter((x) => x !== id),
    }));

  const confirmConnect = () => {
    if (!connecting) return;
    const id = connecting.id;
    setBusy(true);
    timer.current = setTimeout(() => {
      update((d) => ({
        connectedChannels: [...d.connectedChannels.filter((x) => x !== id), id],
        selectedChannels: [...d.selectedChannels.filter((x) => x !== id), id],
      }));
      setBusy(false);
      setConnecting(null);
      setPreviewId(id);
    }, 800);
  };

  if (!channels) {
    return (
      <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-3 rounded-lg bg-surface p-6">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
        <Skeleton className="aspect-[4/3] rounded-lg" />
      </div>
    );
  }

  const preview = channels.find((c) => c.id === previewId) ?? channels[0];

  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <ul aria-label="Canais" className="divide-y divide-line rounded-lg bg-surface px-6 py-2">
        {channels.map((c) => {
          const connected = isConnected(c, draft);
          const selected = draft.selectedChannels.includes(c.id);
          const ready = readinessFor(c.id, draft.photos.length);
          const isPreview = preview?.id === c.id;
          return (
            <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <button
                  type="button"
                  aria-pressed={isPreview}
                  onClick={() => setPreviewId(c.id)}
                  className={cn(
                    't-body -mx-1 rounded-sm px-1 text-left font-medium transition-colors',
                    isPreview ? 'text-verde underline underline-offset-4' : 'text-ink hover:text-verde',
                  )}
                >
                  {c.name}
                  <span className="sr-only"> (ver prévia)</span>
                </button>
                <span className="t-body-sm text-ink-2">
                  {connected ? (c.accountLabel ? `Conta conectada: ${c.accountLabel}` : 'Conta conectada') : 'Conta não conectada'}
                </span>
              </div>
              {connected ? (
                <>
                  <Badge tone={ready.tone}>
                    <span aria-hidden="true">{ready.tone === 'verde' ? '✓' : ready.tone === 'warning' ? '•' : '!'}</span>
                    {ready.label}
                  </Badge>
                  <Switch label={`Publicar no ${c.name}`} checked={selected} onCheckedChange={(v) => setSelected(c.id, v)} />
                </>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setConnecting(c)} aria-label={`Conectar ${c.name}`}>
                  Conectar
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {preview && (
        <div className="md:sticky md:top-6">
          <ListingPreviewCard channel={preview} draft={draft} />
        </div>
      )}

      <Dialog
        open={connecting !== null}
        onOpenChange={(open) => {
          if (!open && !busy) setConnecting(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="app-scope gap-3 rounded-card bg-surface p-8 text-ink ring-0 sm:max-w-[440px]"
        >
          <DialogTitle className="font-display text-[28px] leading-8 font-medium tracking-[-0.02em] text-ink">
            Conectar {connecting?.name}
          </DialogTitle>
          <DialogDescription className="t-body text-ink-2">
            Você vai entrar no site da {connecting?.name} e autorizar a Morada.
          </DialogDescription>
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" disabled={busy} onClick={() => setConnecting(null)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmConnect}
              disabled={busy}
              iconLeft={
                busy ? (
                  <Loader2 size={18} strokeWidth={1.5} aria-hidden="true" className={cn(!reduced && 'animate-spin')} />
                ) : undefined
              }
            >
              {busy ? 'Conectando…' : 'Continuar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
