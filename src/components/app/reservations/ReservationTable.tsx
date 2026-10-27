import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Badge, Button, EmptyState } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/cn';
import { diffDays } from '@/lib/date';
import { formatBRL, formatDateShort, formatNumber, formatRange } from '@/lib/format';
import { CHANNEL_NAMES, type Reservation } from '@/mocks/types';
import { StatusBadge } from './StatusBadge';

export type SortKey = 'checkin' | 'valor' | 'hospede';
export type SortDir = 'asc' | 'desc';
export type SortState = { key: SortKey; dir: SortDir };

export type ReservationTableProps = {
  rows: Reservation[];
  total: number;
  page: number;
  pageSize: number;
  sort: SortState;
  onSort: (key: SortKey) => void;
  onPageChange: (page: number) => void;
  onOpen: (id: string, opener: HTMLElement) => void;
  propertyName: (id: string) => string;
};

const guestsLabel = (r: Reservation) =>
  r.status === 'blocked' ? (r.note ?? 'Bloqueio manual') : `${r.guests} ${r.guests === 1 ? 'hóspede' : 'hóspedes'}`;
const channelLabel = (r: Reservation) => (r.channelId ? CHANNEL_NAMES[r.channelId] : 'Manual');
const valueLabel = (r: Reservation) => (r.status === 'blocked' ? '—' : formatBRL(r.total));
const nightsOf = (r: Reservation) => diffDays(r.checkIn, r.checkOut);

function SortHeader({
  label,
  column,
  sort,
  onSort,
  align = 'left',
}: {
  label: string;
  column: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
  align?: 'left' | 'right';
}) {
  const active = sort.key === column;
  const Icon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <TableHead
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn('h-11 px-3 text-ink-2', align === 'right' && 'text-right')}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          '-mx-1.5 inline-flex items-center gap-1 rounded-sm px-1.5 py-1 font-medium transition-colors hover:text-ink',
          active && 'text-ink',
        )}
      >
        {label}
        <Icon size={14} strokeWidth={1.5} aria-hidden="true" className={cn(!active && 'opacity-60')} />
      </button>
    </TableHead>
  );
}

export function ReservationTable({
  rows,
  total,
  page,
  pageSize,
  sort,
  onSort,
  onPageChange,
  onOpen,
  propertyName,
}: ReservationTableProps) {
  if (total === 0) {
    return (
      <div className="rounded-lg bg-surface">
        <EmptyState title="Nenhuma reserva com esses filtros." />
      </div>
    );
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop/tablet: tabela */}
      <div className="hidden rounded-lg bg-surface sm:block">
        <Table className="min-w-[820px] text-[14px] text-ink">
          <caption className="sr-only">Reservas. Ordene pelos cabeçalhos com botão.</caption>
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              <SortHeader label="Hóspede" column="hospede" sort={sort} onSort={onSort} />
              <TableHead className="h-11 px-3 text-ink-2">Imóvel</TableHead>
              <SortHeader label="Check-in" column="checkin" sort={sort} onSort={onSort} />
              <TableHead className="h-11 px-3 text-ink-2">Check-out</TableHead>
              <TableHead className="h-11 px-3 text-right text-ink-2">Noites</TableHead>
              <TableHead className="h-11 px-3 text-ink-2">Canal</TableHead>
              <TableHead className="h-11 px-3 text-ink-2">Status</TableHead>
              <SortHeader label="Valor" column="valor" sort={sort} onSort={onSort} align="right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className="border-line hover:bg-bg-alt/60">
                <TableCell className="px-3 py-3">
                  <button
                    type="button"
                    onClick={(e) => onOpen(r.id, e.currentTarget)}
                    className="rounded-sm text-left font-medium text-ink hover:text-verde hover:underline"
                  >
                    {r.guestName}
                  </button>
                  <div className="t-caption font-normal text-ink-2">{guestsLabel(r)}</div>
                </TableCell>
                <TableCell className="px-3 py-3">{propertyName(r.propertyId)}</TableCell>
                <TableCell className="px-3 py-3">{formatDateShort(r.checkIn)}</TableCell>
                <TableCell className="px-3 py-3">{formatDateShort(r.checkOut)}</TableCell>
                <TableCell className="px-3 py-3 text-right tabular-nums">{nightsOf(r)}</TableCell>
                <TableCell className="px-3 py-3">
                  <Badge tone="neutral">{channelLabel(r)}</Badge>
                </TableCell>
                <TableCell className="px-3 py-3">
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell
                  className={cn(
                    'px-3 py-3 text-right tabular-nums',
                    r.status === 'cancelled' && 'text-ink-2 line-through',
                  )}
                >
                  {valueLabel(r)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cartões */}
      <ul className="flex flex-col gap-3 sm:hidden" aria-label="Reservas">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col gap-3 rounded-lg bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={(e) => onOpen(r.id, e.currentTarget)}
                  className="-my-2 block min-h-11 rounded-sm py-2 text-left text-[17px] font-medium text-ink hover:text-verde"
                >
                  {r.guestName}
                </button>
                <p className="t-caption text-ink-2">{guestsLabel(r)}</p>
              </div>
              <StatusBadge status={r.status} className="shrink-0" />
            </div>
            <p className="t-body-sm text-ink">
              {formatRange(r.checkIn, r.checkOut)} · {nightsOf(r)} {nightsOf(r) === 1 ? 'noite' : 'noites'}
              <span className="block text-ink-2">{propertyName(r.propertyId)}</span>
            </p>
            <div className="flex items-center justify-between gap-3">
              <Badge tone="neutral">{channelLabel(r)}</Badge>
              <span className={cn('font-medium tabular-nums', r.status === 'cancelled' && 'text-ink-2 line-through')}>
                {valueLabel(r)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-3">
        <p className="t-body-sm text-ink-2" aria-live="polite">
          Mostrando {formatNumber(first)}–{formatNumber(last)} de {formatNumber(total)}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="max-sm:min-h-11"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="max-sm:min-h-11"
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima
          </Button>
        </div>
      </nav>
    </div>
  );
}
