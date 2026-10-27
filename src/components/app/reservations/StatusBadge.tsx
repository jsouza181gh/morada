import { Check, Clock, Lock, X, type LucideIcon } from 'lucide-react';
import { Badge, type BadgeProps } from '@/components/ui';
import type { ReservationStatus } from '@/mocks/types';

const STATUS_LABELS: Record<ReservationStatus, string> = {
  confirmed: 'Confirmada',
  pending_payment: 'Aguardando pagamento',
  cancelled: 'Cancelada',
  blocked: 'Bloqueio',
};

const STYLE: Record<ReservationStatus, { tone: NonNullable<BadgeProps['tone']>; icon: LucideIcon }> = {
  confirmed: { tone: 'verde', icon: Check },
  pending_payment: { tone: 'warning', icon: Clock },
  cancelled: { tone: 'neutral', icon: X },
  blocked: { tone: 'dark', icon: Lock },
};

export type StatusBadgeProps = { status: ReservationStatus; className?: string };

/** Status da reserva com ícone e palavra (nunca só cor). */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { tone, icon: Icon } = STYLE[status];
  return (
    <Badge tone={tone} className={className}>
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
