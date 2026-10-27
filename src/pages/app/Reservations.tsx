import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/app/shell';
import {
  ReservationFilters,
  type FilterState,
  type Period,
  type PeriodOption,
  type StatusOption,
} from '@/components/app/reservations/ReservationFilters';
import { ReservationSheet } from '@/components/app/reservations/ReservationSheet';
import { ReservationTable, type SortKey, type SortState } from '@/components/app/reservations/ReservationTable';
import { ReservationsSummary } from '@/components/app/reservations/ReservationsSummary';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { addDays, diffDays, TODAY } from '@/lib/date';
import { getChannels, getConversations, getProperties, getReservations } from '@/mocks/api';
import { CHANNEL_IDS, CHANNEL_NAMES, type ChannelId, type Reservation, type ReservationStatus } from '@/mocks/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const PAGE_SIZE = 20;
const DEFAULT_SORT: SortState = { key: 'checkin', dir: 'asc' };

const DEFAULT_FILTERS: FilterState = {
  q: '',
  periodo: 'proximos-30',
  imovel: 'todos',
  canal: 'todos',
  status: 'todas',
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 'proximos-30', label: 'Próximos 30 dias' },
  { value: 'este-mes', label: 'Este mês' },
  { value: 'mes-passado', label: 'Mês passado' },
  { value: 'todos', label: 'Todos' },
];

const STATUS_OPTIONS: StatusOption[] = [
  { value: 'todas', label: 'Todas', slug: 'todas' },
  { value: 'confirmed', label: 'Confirmadas', slug: 'confirmadas' },
  { value: 'pending_payment', label: 'Aguardando pagamento', slug: 'aguardando' },
  { value: 'cancelled', label: 'Canceladas', slug: 'canceladas' },
  { value: 'blocked', label: 'Bloqueios', slug: 'bloqueios' },
];

const STATUS_CSV: Record<ReservationStatus, string> = {
  confirmed: 'Confirmada',
  pending_payment: 'Aguardando pagamento',
  cancelled: 'Cancelada',
  blocked: 'Bloqueio',
};

// ---------- URL ----------

function readFilters(p: URLSearchParams): FilterState {
  const periodo = p.get('periodo');
  const canal = p.get('canal');
  const status = STATUS_OPTIONS.find((o) => o.slug === p.get('status'));
  return {
    q: p.get('q') ?? '',
    periodo: PERIOD_OPTIONS.some((o) => o.value === periodo) ? (periodo as Period) : DEFAULT_FILTERS.periodo,
    imovel: p.get('imovel') ?? DEFAULT_FILTERS.imovel,
    canal: CHANNEL_IDS.includes(canal as ChannelId) ? (canal as ChannelId) : DEFAULT_FILTERS.canal,
    status: status?.value ?? DEFAULT_FILTERS.status,
  };
}

function readSort(p: URLSearchParams): SortState {
  const key = p.get('ordem');
  const dir = p.get('dir');
  if (key !== 'checkin' && key !== 'valor' && key !== 'hospede') return DEFAULT_SORT;
  return { key, dir: dir === 'desc' ? 'desc' : 'asc' };
}

// ---------- Filtro e ordenação ----------

const monthStart = (iso: string) => `${iso.slice(0, 7)}-01`;
const monthEnd = (iso: string) => addDays(monthStart(addDays(monthStart(iso), 32)), -1);

function periodRange(periodo: Period): [string, string] | null {
  switch (periodo) {
    case 'proximos-30':
      return [TODAY, addDays(TODAY, 30)];
    case 'este-mes':
      return [monthStart(TODAY), monthEnd(TODAY)];
    case 'mes-passado': {
      const prev = addDays(monthStart(TODAY), -1);
      return [monthStart(prev), monthEnd(prev)];
    }
    default:
      return null;
  }
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

function applyFilters(list: Reservation[], f: FilterState): Reservation[] {
  const range = periodRange(f.periodo);
  const q = normalize(f.q);
  return list.filter((r) => {
    if (range && !(r.checkOut > range[0] && r.checkIn <= range[1])) return false;
    if (f.imovel !== 'todos' && r.propertyId !== f.imovel) return false;
    if (f.canal !== 'todos' && r.channelId !== f.canal) return false;
    if (f.status !== 'todas' && r.status !== f.status) return false;
    if (q && !normalize(r.guestName).includes(q)) return false;
    return true;
  });
}

function sortRows(list: Reservation[], sort: SortState): Reservation[] {
  const sign = sort.dir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => {
    let cmp = 0;
    if (sort.key === 'valor') cmp = a.total - b.total;
    else if (sort.key === 'hospede') cmp = a.guestName.localeCompare(b.guestName, 'pt-BR');
    if (cmp === 0) cmp = a.checkIn.localeCompare(b.checkIn);
    return cmp * sign || a.id.localeCompare(b.id);
  });
}

// ---------- CSV ----------

function csvCell(value: string | number): string {
  const s = String(value);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows: Reservation[], propertyName: (id: string) => string) {
  const header = ['Hóspede', 'Hóspedes', 'Imóvel', 'Check-in', 'Check-out', 'Noites', 'Canal', 'Status', 'Valor'];
  const lines = rows.map((r) =>
    [
      r.guestName,
      r.guests,
      propertyName(r.propertyId),
      r.checkIn,
      r.checkOut,
      diffDays(r.checkIn, r.checkOut),
      r.channelId ? CHANNEL_NAMES[r.channelId] : 'Manual',
      STATUS_CSV[r.status],
      String(r.total).replace('.', ','),
    ]
      .map(csvCell)
      .join(';'),
  );
  // BOM para o Excel reconhecer UTF-8; ";" é o separador padrão em pt-BR.
  const blob = new Blob(['﻿' + [header.join(';'), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'reservas-morada.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

// ---------- Página ----------

export default function Reservations() {
  useDocumentTitle('Reservas');
  const [params, setParams] = useSearchParams();
  const reservationsQuery = useMock(() => getReservations(), []);
  const { data: properties = [] } = useMock(getProperties);
  const { data: channels = [] } = useMock(getChannels);
  const { data: conversations = [] } = useMock(getConversations);
  const reservations = reservationsQuery.data;
  const openerRef = useRef<HTMLElement | null>(null);

  const filters = useMemo(() => readFilters(params), [params]);
  const sort = useMemo(() => readSort(params), [params]);
  // `?r=` é aceito como alias de `?id=` (links vindos de Mensagens).
  const openId = params.get('id') ?? params.get('r');

  const update = useCallback(
    (patch: Record<string, string | null>, replace = true) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === null || v === '') next.delete(k);
            else next.set(k, v);
          }
          return next;
        },
        { replace },
      );
    },
    [setParams],
  );

  const propertyName = useCallback((id: string) => properties.find((p) => p.id === id)?.name ?? id, [properties]);

  const sorted = useMemo(
    () => (reservations ? sortRows(applyFilters(reservations, filters), sort) : []),
    [reservations, filters, sort],
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const rawPage = Number.parseInt(params.get('pagina') ?? '1', 10);
  const page = Math.min(pageCount, Math.max(1, Number.isFinite(rawPage) ? rawPage : 1));
  const rows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isDefault =
    filters.q === DEFAULT_FILTERS.q &&
    filters.periodo === DEFAULT_FILTERS.periodo &&
    filters.imovel === DEFAULT_FILTERS.imovel &&
    filters.canal === DEFAULT_FILTERS.canal &&
    filters.status === DEFAULT_FILTERS.status;

  const onFiltersChange = (patch: Partial<FilterState>) => {
    const url: Record<string, string | null> = { pagina: null };
    if ('q' in patch) url.q = patch.q ?? null;
    if (patch.periodo) url.periodo = patch.periodo === DEFAULT_FILTERS.periodo ? null : patch.periodo;
    if (patch.imovel) url.imovel = patch.imovel === 'todos' ? null : patch.imovel;
    if (patch.canal) url.canal = patch.canal === 'todos' ? null : patch.canal;
    if (patch.status)
      url.status =
        patch.status === 'todas' ? null : (STATUS_OPTIONS.find((o) => o.value === patch.status)?.slug ?? null);
    update(url);
  };

  const onClear = () => update({ q: null, periodo: null, imovel: null, canal: null, status: null, pagina: null });

  const onSort = (key: SortKey) => {
    const dir = sort.key === key ? (sort.dir === 'asc' ? 'desc' : 'asc') : key === 'valor' ? 'desc' : 'asc';
    const isDefaultSort = key === DEFAULT_SORT.key && dir === DEFAULT_SORT.dir;
    update({ ordem: isDefaultSort ? null : key, dir: isDefaultSort ? null : dir, pagina: null });
  };

  const onPageChange = (next: number) => update({ pagina: next <= 1 ? null : String(next) }, false);

  const onOpen = (id: string, opener: HTMLElement) => {
    openerRef.current = opener;
    update({ id, r: null }, false);
  };

  const openReservation = openId ? reservations?.find((r) => r.id === openId) : undefined;

  return (
    <>
      <PageHeader
        title="Reservas"
        actions={
          <Button
            variant="secondary"
            size="sm"
            className="max-sm:min-h-11"
            iconLeft={<Download size={18} strokeWidth={1.5} aria-hidden="true" />}
            disabled={!reservations || sorted.length === 0}
            onClick={() => downloadCsv(sorted, propertyName)}
          >
            Exportar CSV
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        <ReservationsSummary reservations={reservations} />

        <ReservationFilters
          value={filters}
          onChange={onFiltersChange}
          onClear={onClear}
          canClear={!isDefault}
          properties={properties}
          periodOptions={PERIOD_OPTIONS}
          statusOptions={STATUS_OPTIONS}
        />

        {reservationsQuery.error ? (
          <div className="rounded-lg bg-surface">
            <EmptyState
              title="Não foi possível carregar as reservas."
              action={
                <Button variant="secondary" size="sm" onClick={reservationsQuery.reload}>
                  Tentar de novo
                </Button>
              }
            />
          </div>
        ) : !reservations ? (
          <div role="status" aria-label="Carregando reservas" className="flex flex-col gap-3 rounded-lg bg-surface p-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <ReservationTable
            rows={rows}
            total={sorted.length}
            page={page}
            pageSize={PAGE_SIZE}
            sort={sort}
            onSort={onSort}
            onPageChange={onPageChange}
            onOpen={onOpen}
            propertyName={propertyName}
          />
        )}
      </div>

      <ReservationSheet
        reservation={openReservation}
        properties={properties}
        channels={channels}
        conversations={conversations}
        onClose={() => update({ id: null, r: null })}
        returnFocusTo={() => openerRef.current}
      />
    </>
  );
}
