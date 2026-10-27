import { Link, useNavigate } from 'react-router';
import { Ellipsis } from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/mocks/types';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconButton } from '@/components/ui';
import { formatBRL, formatDateShort, formatPct } from '@/lib/format';
import { ChannelStatusList } from './ChannelStatusList';

export type PropertyRowProps = {
  property: Property;
  /** Data 'YYYY-MM-DD' da próxima chegada, se houver. */
  nextArrival?: string;
  /** Ocupação dos próximos 30 dias, 0–1. */
  occupancy: number;
};

export function PropertyRow({ property: p, nextArrival, occupancy }: PropertyRowProps) {
  const navigate = useNavigate();
  const cover = p.photos[p.coverIndex] ?? p.photos[0];
  return (
    <TableRow className="border-line hover:bg-bg-alt/60">
      <TableCell className="py-3 pr-4 pl-5">
        <div className="flex items-center gap-3">
          {cover && (
            <img
              width={1200}
              height={800}
              src={cover}
              alt=""
              loading="lazy"
              className="size-12 shrink-0 rounded-sm bg-verde-soft object-cover"
            />
          )}
          <div className="min-w-0">
            <Link to={`/app/imoveis/${p.id}`} className="font-medium text-ink hover:text-verde">
              {p.name}
            </Link>
            <p className="text-ink-2">
              {p.neighborhood}, {p.city}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4">
        <ChannelStatusList variant="compact" listings={p.channels} className="flex-nowrap" />
      </TableCell>
      <TableCell className="px-4 tabular-nums">{formatBRL(p.nightlyNet)}</TableCell>
      <TableCell className="px-4">
        <div className="flex items-center gap-3">
          <div
            role="meter"
            aria-label={`Ocupação de ${p.name} nos próximos 30 dias`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(occupancy * 100)}
            className="h-1.5 w-24 overflow-hidden rounded-pill bg-bg-alt"
          >
            <div className="h-full rounded-pill bg-verde" style={{ width: `${Math.round(occupancy * 100)}%` }} />
          </div>
          <span className="tabular-nums text-ink-2">{formatPct(occupancy)}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 text-ink-2">{nextArrival ? formatDateShort(nextArrival) : 'Nenhuma'}</TableCell>
      <TableCell className="pr-5 pl-2 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label={`Ações para ${p.name}`} variant="ghost" size="sm" className="max-sm:size-11">
              <Ellipsis aria-hidden="true" size={20} strokeWidth={1.5} />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => navigate(`/app/imoveis/${p.id}`)}>Abrir</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate(`/app/calendario?imovel=${p.id}`)}>
                Ver no calendário
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast('Em breve')}>Duplicar</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast(`Anúncios de ${p.name} pausados.`)}>
                Pausar anúncios
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
