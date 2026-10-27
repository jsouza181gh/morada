import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle, Loader2, MoreHorizontal, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge, Button, IconButton } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/cn';
import { formatRelative } from '@/lib/format';
import type { Channel } from '@/mocks/types';
import { ConnectDialog, DisconnectDialog } from './ChannelDialogs';
import { HEALTH_LABEL, HEALTH_TONE } from './channelText';

export type ChannelCardProps = {
  channel: Channel;
  /** true quando foi sincronizado nesta sessão (mostra "há poucos segundos"). */
  justSynced: boolean;
  published: number;
  totalProperties: number;
  onSynced: () => void;
  onConnectedChange: (connected: boolean) => void;
};

export function ChannelCard({
  channel,
  justSynced,
  published,
  totalProperties,
  onSynced,
  onConnectedChange,
}: ChannelCardProps) {
  const [syncing, setSyncing] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function sync() {
    setSyncing(true);
    timer.current = window.setTimeout(() => {
      setSyncing(false);
      onSynced();
      toast.success(`${channel.name} sincronizado.`);
    }, 1000);
  }

  const { connected } = channel;
  const headingId = `canal-${channel.id}-titulo`;
  const noteTone = channel.health === 'error' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning';

  return (
    <article
      id={`canal-${channel.id}`}
      tabIndex={-1}
      aria-labelledby={headingId}
      className="flex scroll-mt-24 flex-col gap-4 rounded-lg bg-surface p-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde"
    >
      <div className={cn('flex items-start justify-between gap-3', !connected && 'opacity-60')}>
        <h2 id={headingId} className="text-[21px] leading-7 font-medium text-ink">
          {channel.name}
        </h2>
        {connected ? (
          <Badge tone={HEALTH_TONE[channel.health]}>
            <span aria-hidden="true">{channel.health === 'ok' ? '✓' : '!'}</span>
            {HEALTH_LABEL[channel.health]}
          </Badge>
        ) : (
          <Badge tone="neutral">
            <span aria-hidden="true">–</span>
            Desconectado
          </Badge>
        )}
      </div>

      <dl className={cn('t-body-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-2', !connected && 'opacity-60')}>
        <dt className="text-ink-2">Conta</dt>
        <dd className="min-w-0 truncate text-right text-ink">{connected ? (channel.accountLabel ?? '—') : '—'}</dd>
        <dt className="text-ink-2">Taxa</dt>
        <dd className="text-right text-ink">{channel.feeLabel}</dd>
        <dt className="text-ink-2">Limite de título</dt>
        <dd className="text-right text-ink">
          {channel.titleMaxLength ? `${channel.titleMaxLength} caracteres` : 'Sem limite'}
        </dd>
        <dt className="text-ink-2">Imóveis publicados</dt>
        <dd className="text-right text-ink">
          {published} de {totalProperties}
        </dd>
        <dt className="text-ink-2">Última sincronização</dt>
        <dd className="text-right text-ink" aria-live="polite">
          {!connected ? 'Pausada' : justSynced ? 'há poucos segundos' : formatRelative(channel.lastSyncAt)}
        </dd>
      </dl>

      {connected && channel.healthNote && (
        <p className={cn('t-body-sm flex items-start gap-2 rounded-md p-3', noteTone)}>
          <AlertTriangle size={18} strokeWidth={1.5} aria-hidden="true" className="mt-px shrink-0" />
          {channel.healthNote}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        {connected ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={sync}
            disabled={syncing}
            aria-busy={syncing || undefined}
            className="max-sm:min-h-11"
            iconLeft={
              syncing ? (
                <Loader2 size={16} strokeWidth={1.5} className="motion-safe:animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw size={16} strokeWidth={1.5} aria-hidden="true" />
              )
            }
          >
            {syncing ? 'Sincronizando' : 'Sincronizar agora'}
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setConnectOpen(true)} className="max-sm:min-h-11">
            Conectar
          </Button>
        )}

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <IconButton label={`Mais ações para ${channel.name}`} variant="ghost">
              <MoreHorizontal size={20} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="app-scope w-60 bg-surface text-ink">
            <DropdownMenuItem asChild className="t-body-sm">
              <Link to={`/app/imoveis?canal=${channel.id}`}>Ver anúncios neste canal</Link>
            </DropdownMenuItem>
            {connected ? (
              <DropdownMenuItem
                className="t-body-sm text-danger focus:text-danger"
                onSelect={() => setDisconnectOpen(true)}
              >
                Desconectar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="t-body-sm" onSelect={() => setConnectOpen(true)}>
                Conectar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DisconnectDialog
        channel={channel}
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        onConfirm={() => {
          onConnectedChange(false);
          toast(`${channel.name} desconectado.`);
        }}
      />
      <ConnectDialog
        channel={channel}
        open={connectOpen}
        onOpenChange={setConnectOpen}
        onConfirm={() => {
          onConnectedChange(true);
          toast.success(`${channel.name} conectado.`);
        }}
      />
    </article>
  );
}
