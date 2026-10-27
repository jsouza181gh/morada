import { useState } from 'react';
import { PageHeader } from '@/components/app/shell';
import { ChannelCard, ComingSoonChannels, HealthBanner } from '@/components/app/channels';
import { EmptyState, Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { formatRelative } from '@/lib/format';
import { getChannels, getProperties } from '@/mocks/api';
import type { Channel, ChannelId, Property } from '@/mocks/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const GRID = 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5';

export default function Channels() {
  useDocumentTitle('Canais');
  const channels = useMock(getChannels);
  const properties = useMock(getProperties);

  if (channels.error || properties.error) {
    return (
      <>
        <PageHeader title="Canais" />
        <EmptyState title="Não foi possível carregar os canais." description="Tente de novo em instantes." />
      </>
    );
  }

  if (!channels.data || !properties.data) {
    return (
      <>
        <PageHeader title="Canais" subtitle="Carregando canais." />
        <div className={GRID} aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </>
    );
  }

  return <ChannelsBoard initial={channels.data} properties={properties.data} />;
}

function ChannelsBoard({ initial, properties }: { initial: Channel[]; properties: Property[] }) {
  const [channels, setChannels] = useState(initial);
  const [synced, setSynced] = useState<Set<ChannelId>>(() => new Set());

  const connected = channels.filter((c) => c.connected);
  const anySynced = connected.some((c) => synced.has(c.id));
  const latest = connected.reduce<string | undefined>(
    (max, c) => (!max || c.lastSyncAt > max ? c.lastSyncAt : max),
    undefined,
  );

  let subtitle = `${connected.length} de ${channels.length} conectados.`;
  if (anySynced) subtitle += ' Última sincronização há poucos segundos.';
  else if (latest) subtitle += ` Última sincronização ${formatRelative(latest)}.`;

  function update(id: ChannelId, patch: Partial<Channel>) {
    setChannels((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function markSynced(id: ChannelId, value: boolean) {
    setSynced((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <>
      <PageHeader title="Canais" subtitle={subtitle} />
      <HealthBanner channels={channels} />
      <div className={GRID}>
        {channels.map((c) => (
          <ChannelCard
            key={c.id}
            channel={c}
            justSynced={synced.has(c.id)}
            published={properties.filter((p) => p.channels[c.id].status === 'published').length}
            totalProperties={properties.length}
            onSynced={() => markSynced(c.id, true)}
            onConnectedChange={(value) => {
              update(c.id, { connected: value });
              // Conectar agora conta como sincronização recente; desconectar pausa.
              markSynced(c.id, value);
            }}
          />
        ))}
      </div>
      <ComingSoonChannels />
    </>
  );
}
