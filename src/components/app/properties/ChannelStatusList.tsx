import { CHANNEL_IDS, CHANNEL_NAMES, type Channel, type ChannelId, type ListingStatus, type Property } from '@/mocks/types';
import { Button, ChannelBadge, Switch } from '@/components/ui';
import { formatBRL, formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';

const STATUS_LABEL: Record<ListingStatus, string> = {
  published: 'Publicado',
  pending: 'Em análise',
  error: 'Erro',
  off: 'Desligado',
};

const DOT: Record<ListingStatus, string> = {
  published: 'bg-verde',
  pending: 'bg-warning',
  error: 'bg-danger',
  off: 'bg-line-strong',
};

function summarizeListings(channels: Property['channels']) {
  let published = 0;
  let errors = 0;
  let pending = 0;
  for (const id of CHANNEL_IDS) {
    const s = channels[id].status;
    if (s === 'published') published++;
    if (s === 'error') errors++;
    if (s === 'pending') pending++;
  }
  return { published, errors, pending, total: CHANNEL_IDS.length };
}

type CompactProps = {
  variant: 'compact';
  listings: Property['channels'];
  className?: string;
};

type FullProps = {
  variant: 'full';
  property: Property;
  channels: Channel[];
  onToggle: (channelId: ChannelId, on: boolean) => void;
  onFix?: (channelId: ChannelId) => void;
  className?: string;
};

export type ChannelStatusListProps = CompactProps | FullProps;

export function ChannelStatusList(props: ChannelStatusListProps) {
  if (props.variant === 'compact') return <CompactList {...props} />;
  return <FullList {...props} />;
}

function CompactList({ listings, className }: CompactProps) {
  const { published, errors, total } = summarizeListings(listings);
  const description = CHANNEL_IDS.map((id) => `${CHANNEL_NAMES[id]}: ${STATUS_LABEL[listings[id].status]}`).join(', ');
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}>
      <span role="img" aria-label={description} title={description} className="flex items-center gap-1">
        {CHANNEL_IDS.map((id) => (
          <span key={id} className={cn('size-2 rounded-[2px]', DOT[listings[id].status])} />
        ))}
      </span>
      <span className="t-body-sm text-ink-2">
        {published} de {total} publicados
        {errors > 0 && <span className="text-danger">, {errors} com erro</span>}
      </span>
    </div>
  );
}

function FullList({ property, channels, onToggle, onFix, className }: FullProps) {
  return (
    <ul className={cn('flex flex-col gap-3', className)}>
      {CHANNEL_IDS.map((id) => {
        const listing = property.channels[id];
        const channel = channels.find((c) => c.id === id);
        const name = CHANNEL_NAMES[id];
        const max = channel?.titleMaxLength ?? null;
        const switchId = `publicar-${property.id}-${id}`;
        return (
          <li key={id} className="rounded-lg bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-[17px] leading-6 font-medium text-ink">{name}</h3>
                  <ChannelBadge channel={id} status={listing.status} size="sm" />
                </div>
                <p className="t-body-sm text-ink">
                  <span className="break-words">{listing.title}</span>
                  {max !== null && (
                    <span
                      className={cn('ml-2 tabular-nums', listing.title.length > max ? 'text-danger' : 'text-ink-2')}
                      aria-label={`${listing.title.length} de ${max} caracteres`}
                    >
                      {listing.title.length}/{max}
                    </span>
                  )}
                </p>
                <p className="t-body-sm text-ink-2">
                  {formatBRL(listing.price)} por noite
                  {channel && <>, {channel.feeLabel}</>}
                  {channel && <>. Sincronizado {formatRelative(channel.lastSyncAt)}</>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor={switchId} className="t-body-sm text-ink-2">
                  Publicar no {name}
                </label>
                <Switch
                  id={switchId}
                  checked={listing.status !== 'off'}
                  onCheckedChange={(on) => onToggle(id, on)}
                  label={`Publicar no ${name}`}
                />
              </div>
            </div>
            {listing.issue && (
              <div className="t-body-sm mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-danger-soft px-4 py-3 text-danger">
                <p>
                  <span aria-hidden="true">! </span>
                  {listing.issue}
                </p>
                <Button variant="link" size="sm" onClick={() => onFix?.(id)}>
                  Corrigir
                </Button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
