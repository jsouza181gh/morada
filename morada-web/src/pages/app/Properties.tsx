import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/app/shell';
import { PropertyCard } from '@/components/app/properties/PropertyCard';
import { PropertyRow } from '@/components/app/properties/PropertyRow';
import { PropertyFilters, type StatusFilter, type ViewMode } from '@/components/app/properties/PropertyFilters';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { getProperties, getReservations } from '@/mocks/api';
import type { Property, Reservation } from '@/mocks/types';
import { addDays, TODAY } from '@/lib/date';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const WINDOW_DAYS = 30;

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function matchesStatus(p: Property, status: StatusFilter) {
  if (status === 'todos') return true;
  const hasIssue = Object.values(p.channels).some((l) => l.status === 'pending' || l.status === 'error');
  return status === 'pendencia' ? hasIssue : !hasIssue;
}

/** Próxima chegada e ocupação dos próximos 30 dias, por imóvel. */
function computeStats(reservations: Reservation[] | undefined) {
  const end = addDays(TODAY, WINDOW_DAYS);
  const next = new Map<string, string>();
  const nights = new Map<string, Set<string>>();
  for (const r of reservations ?? []) {
    if (r.status === 'cancelled') continue;
    if (r.status !== 'blocked' && r.checkIn >= TODAY) {
      const current = next.get(r.propertyId);
      if (!current || r.checkIn < current) next.set(r.propertyId, r.checkIn);
    }
    if (r.status === 'blocked') continue;
    const set = nights.get(r.propertyId) ?? new Set<string>();
    for (let d = r.checkIn < TODAY ? TODAY : r.checkIn; d < r.checkOut && d < end; d = addDays(d, 1)) set.add(d);
    nights.set(r.propertyId, set);
  }
  return {
    nextArrival: (id: string) => next.get(id),
    occupancy: (id: string) => (nights.get(id)?.size ?? 0) / WINDOW_DAYS,
  };
}

function readStatus(v: string | null): StatusFilter {
  return v === 'pendencia' || v === 'publicado' ? v : 'todos';
}

export default function Properties() {
  useDocumentTitle('Imóveis');
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const status = readStatus(params.get('status'));
  const view: ViewMode = params.get('view') === 'lista' ? 'lista' : 'grade';

  const { data: properties, loading } = useMock(getProperties);
  const { data: reservations } = useMock(() => getReservations({ from: TODAY }));
  const stats = useMemo(() => computeStats(reservations), [reservations]);

  function update(key: 'q' | 'status' | 'view', value: string, fallback: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return (properties ?? []).filter(
      (p) => (!q || normalize(`${p.name} ${p.city} ${p.neighborhood}`).includes(q)) && matchesStatus(p, status),
    );
  }, [properties, query, status]);

  function clearFilters() {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('q');
        next.delete('status');
        return next;
      },
      { replace: true },
    );
  }

  return (
    <>
      <PageHeader
        title="Imóveis"
        subtitle="7 de 10 imóveis no plano Pro"
        actions={
          <Button href="/app/imoveis/novo" iconLeft={<Plus aria-hidden="true" size={20} strokeWidth={1.5} />}>
            Cadastrar imóvel
          </Button>
        }
      />
      <PropertyFilters
        query={query}
        status={status}
        view={view}
        onQueryChange={(v) => update('q', v, '')}
        onStatusChange={(v) => update('status', v, 'todos')}
        onViewChange={(v) => update('view', v, 'grade')}
      />

      {loading && !properties ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[380px] rounded-lg bg-surface" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg bg-surface">
          <EmptyState
            title="Nenhum imóvel encontrado."
            description="Tente outro nome ou limpe os filtros."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Limpar filtros
              </Button>
            }
          />
        </div>
      ) : view === 'grade' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-5">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} nextArrival={stats.nextArrival(p.id)} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-surface">
          <Table className="t-body-sm">
            <TableHeader>
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="pl-5 text-ink-2">Imóvel</TableHead>
                <TableHead className="px-4 text-ink-2">Canais</TableHead>
                <TableHead className="px-4 text-ink-2">Diária</TableHead>
                <TableHead className="px-4 text-ink-2">Ocupação 30 dias</TableHead>
                <TableHead className="px-4 text-ink-2">Próxima chegada</TableHead>
                <TableHead className="pr-5 text-right">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <PropertyRow
                  key={p.id}
                  property={p}
                  nextArrival={stats.nextArrival(p.id)}
                  occupancy={stats.occupancy(p.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
