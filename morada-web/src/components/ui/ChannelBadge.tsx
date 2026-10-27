import type { HTMLAttributes } from 'react';
import { CHANNEL_NAMES, type ChannelId, type ListingStatus } from '@/mocks/types';
import { cn } from '@/lib/cn';
import { Badge, type BadgeProps } from './Badge';

export type ChannelBadgeProps = {
  channel: ChannelId;
  status: ListingStatus;
  size?: 'sm' | 'md';
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'className'>;

const statusMap: Record<ListingStatus, { tone: NonNullable<BadgeProps['tone']>; mark: string; label: string }> = {
  published: { tone: 'verde', mark: '✓', label: 'Publicado' },
  pending: { tone: 'warning', mark: '•', label: 'Em análise' },
  error: { tone: 'danger', mark: '!', label: 'Erro' },
  off: { tone: 'neutral', mark: '–', label: 'Desligado' },
};

export function ChannelBadge({ channel, status, size = 'md', className, ...rest }: ChannelBadgeProps) {
  const s = statusMap[status];
  const name = CHANNEL_NAMES[channel];
  return (
    <span
      title={`${name}: ${s.label}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border border-line bg-surface py-1 pr-1 text-ink',
        size === 'sm' ? 'pl-2.5 text-[12px]' : 'pl-3 text-[14px]',
        className,
      )}
      {...rest}
    >
      <span className="whitespace-nowrap">{name}</span>
      <Badge tone={s.tone}>
        <span aria-hidden="true">{s.mark}</span>
        {s.label}
      </Badge>
    </span>
  );
}
