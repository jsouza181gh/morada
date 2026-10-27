import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Channel } from '@/mocks/types';
import { article, DANGER_BUTTON_CLASS, DIALOG_CLASS } from './channelText';

type DialogProps = {
  channel: Channel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DisconnectDialog({ channel, open, onOpenChange, onConfirm }: DialogProps) {
  const a = article(channel.id);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CLASS} showCloseButton={false}>
        <DialogTitle className="font-display text-[21px] leading-7 font-medium text-ink">
          Desconectar {a.def} {channel.name}?
        </DialogTitle>
        <DialogDescription className="t-body-sm text-ink-2">
          Seus anúncios continuam {a.em} {channel.name}, mas deixam de ser sincronizados pela Morada.
        </DialogDescription>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <button
            type="button"
            className={DANGER_BUTTON_CLASS}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Desconectar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConnectDialog({ channel, open, onOpenChange, onConfirm }: DialogProps) {
  const a = article(channel.id);
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function handleOpenChange(next: boolean) {
    if (busy) return;
    onOpenChange(next);
  }

  function confirm() {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      onConfirm();
      onOpenChange(false);
    }, 800);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={DIALOG_CLASS} showCloseButton={false}>
        <DialogTitle className="font-display text-[21px] leading-7 font-medium text-ink">
          Conectar {a.def} {channel.name}
        </DialogTitle>
        <DialogDescription className="t-body-sm text-ink-2">
          Você vai entrar no site {a.de} {channel.name} e autorizar a Morada.
        </DialogDescription>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => handleOpenChange(false)} disabled={busy}>
            Cancelar
          </Button>
          <Button
            onClick={confirm}
            disabled={busy}
            aria-busy={busy || undefined}
            iconLeft={
              busy ? (
                <Loader2 size={18} strokeWidth={1.5} className="motion-safe:animate-spin" aria-hidden="true" />
              ) : undefined
            }
          >
            {busy ? 'Conectando' : 'Continuar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
