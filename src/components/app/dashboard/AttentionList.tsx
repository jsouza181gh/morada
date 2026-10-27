import type { ReactNode } from 'react';
import { Badge, Button, ChannelBadge, EmptyState, Skeleton } from '@/components/ui';
import { CHANNEL_IDS, CHANNEL_NAMES, type Channel, type Property } from '@/mocks/types';

type AttentionListProps = { properties: Property[] | undefined; channels: Channel[] | undefined };

type Item = { key: string; badge: ReactNode; text: string; action?: ReactNode };

function buildItems(properties: Property[], channels: Channel[]): Item[] {
  const errors: Item[] = [];
  const pending: Item[] = [];
  for (const p of properties) {
    for (const id of CHANNEL_IDS) {
      const l = p.channels[id];
      if (l.status === 'error') {
        errors.push({
          key: `err-${p.id}-${id}`,
          badge: <ChannelBadge channel={id} status="error" size="sm" />,
          text: `${p.name}: ${l.issue ?? 'o canal recusou o anúncio.'}`,
          action: (
            <Button variant="link" size="sm" href={`/app/imoveis/${p.id}?aba=canais`}>
              Corrigir
            </Button>
          ),
        });
      } else if (l.status === 'pending') {
        pending.push({
          key: `pen-${p.id}-${id}`,
          badge: <ChannelBadge channel={id} status="pending" size="sm" />,
          text: `${p.name} está em análise pelo canal. Prazo médio de 2 dias.`,
        });
      }
    }
  }
  const health: Item[] = channels
    .filter((c) => c.health !== 'ok')
    .map((c) => ({
      key: `ch-${c.id}`,
      badge: (
        <Badge tone={c.health === 'error' ? 'danger' : 'warning'}>
          <span aria-hidden="true">{c.health === 'error' ? '!' : '•'}</span>
          {CHANNEL_NAMES[c.id]}: {c.health === 'error' ? 'erro de sincronização' : 'atenção'}
        </Badge>
      ),
      text: c.healthNote ?? 'Confira a conexão com o canal.',
      action: (
        <Button variant="link" size="sm" href="/app/canais">
          Ver canal
        </Button>
      ),
    }));
  return [...errors, ...health, ...pending];
}

export function AttentionList({ properties, channels }: AttentionListProps) {
  const loading = !properties || !channels;
  const items = loading ? [] : buildItems(properties, channels);

  return (
    <section aria-labelledby="dash-attention" className="rounded-lg bg-surface p-6 text-ink">
      <h2 id="dash-attention" className="mb-4 text-[21px] leading-7 font-medium">
        Precisa de atenção
      </h2>
      {loading ? (
        <ul className="flex flex-col divide-y divide-line" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="py-3">
              <Skeleton className="h-7 w-44 rounded-pill" />
              <Skeleton className="mt-2 h-5 w-full" />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <EmptyState title="Tudo em dia." className="py-8" />
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {items.map((it) => (
            <li key={it.key} className="py-3 first:pt-0 last:pb-0">
              <div>{it.badge}</div>
              <p className="t-body-sm mt-2 text-ink">{it.text}</p>
              {it.action && <div className="mt-1">{it.action}</div>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
