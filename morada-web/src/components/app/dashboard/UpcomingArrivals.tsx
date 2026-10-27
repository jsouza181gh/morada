import { Link } from 'react-router';
import { Badge, Button, Skeleton } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TODAY } from '@/lib/date';
import { formatBRL, formatRange } from '@/lib/format';
import { CHANNEL_NAMES, type Property, type Reservation } from '@/mocks/types';

type UpcomingArrivalsProps = { reservations: Reservation[] | undefined; properties: Property[] | undefined };

const LIMIT = 6;
const headClass = 't-caption h-10 px-3 text-ink-2';
const rowClass = 'border-line hover:bg-transparent';

export function UpcomingArrivals({ reservations, properties }: UpcomingArrivalsProps) {
  const loading = !reservations || !properties;
  const names = new Map(properties?.map((p) => [p.id, p.name]));
  const rows = (reservations ?? [])
    .filter((r) => r.checkIn >= TODAY && (r.status === 'confirmed' || r.status === 'pending_payment'))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn) || a.guestName.localeCompare(b.guestName, 'pt-BR'))
    .slice(0, LIMIT);

  return (
    <section aria-labelledby="dash-upcoming" className="rounded-lg bg-surface p-6 text-ink">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <h2 id="dash-upcoming" className="text-[21px] leading-7 font-medium">
          Próximas chegadas
        </h2>
        <Button variant="link" size="sm" href="/app/reservas">
          Ver todas as reservas
        </Button>
      </div>

      <Table className="t-body-sm min-w-[640px]" aria-busy={loading || undefined}>
        <TableHeader>
          <TableRow className={rowClass}>
            <TableHead className={headClass}>Hóspede</TableHead>
            <TableHead className={headClass}>Imóvel</TableHead>
            <TableHead className={headClass}>Datas</TableHead>
            <TableHead className={headClass}>Canal</TableHead>
            <TableHead className={`${headClass} text-right`}>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: LIMIT }, (_, i) => (
                <TableRow key={i} className={rowClass} aria-hidden="true">
                  <TableCell className="h-[52px] px-3">
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="px-3">
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell className="px-3">
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="px-3">
                    <Skeleton className="h-6 w-20 rounded-pill" />
                  </TableCell>
                  <TableCell className="px-3">
                    <Skeleton className="ml-auto h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))
            : rows.map((r) => (
                <TableRow key={r.id} className={rowClass}>
                  <TableCell className="h-[52px] px-3">
                    <Link to={`/app/reservas?id=${r.id}`} className="font-medium text-ink hover:text-verde hover:underline">
                      {r.guestName}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3">{names.get(r.propertyId) ?? r.propertyId}</TableCell>
                  <TableCell className="px-3 text-ink-2">{formatRange(r.checkIn, r.checkOut)}</TableCell>
                  <TableCell className="px-3">
                    {r.channelId ? <Badge tone="neutral">{CHANNEL_NAMES[r.channelId]}</Badge> : null}
                  </TableCell>
                  <TableCell className="px-3 text-right font-medium tabular-nums">{formatBRL(r.total)}</TableCell>
                </TableRow>
              ))}
          {!loading && rows.length === 0 && (
            <TableRow className={rowClass}>
              <TableCell colSpan={5} className="px-3 py-6 text-center text-ink-2">
                Nenhuma chegada nos próximos 14 dias.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
