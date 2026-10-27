import { Search } from 'lucide-react';
import { Button, Pill } from '@/components/ui';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CHANNEL_IDS, CHANNEL_NAMES, type ChannelId, type Property, type ReservationStatus } from '@/mocks/types';

export type Period = 'proximos-30' | 'este-mes' | 'mes-passado' | 'todos';
export type StatusFilter = 'todas' | ReservationStatus;

export type FilterState = {
  q: string;
  periodo: Period;
  imovel: string; // 'todos' ou id do imóvel
  canal: ChannelId | 'todos';
  status: StatusFilter;
};

export type PeriodOption = { value: Period; label: string };
export type StatusOption = { value: StatusFilter; label: string; slug: string };

export type ReservationFiltersProps = {
  value: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onClear: () => void;
  canClear: boolean;
  properties: Property[];
  periodOptions: PeriodOption[];
  statusOptions: StatusOption[];
};

const triggerClass =
  'h-10! w-full rounded-pill border-line-strong bg-surface pr-3 pl-4 text-[14px] text-ink sm:w-auto sm:min-w-44';

export function ReservationFilters({
  value,
  onChange,
  onClear,
  canClear,
  properties,
  periodOptions,
  statusOptions,
}: ReservationFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative sm:w-64">
          <label htmlFor="reservas-busca" className="sr-only">
            Buscar por hóspede
          </label>
          <Search
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2"
          />
          <input
            id="reservas-busca"
            type="search"
            value={value.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Buscar hóspede"
            autoComplete="off"
            className="h-10 w-full rounded-pill border border-line-strong bg-surface pr-4 pl-10 text-[14px] text-ink placeholder:text-ink-2"
          />
        </div>

        <Select value={value.periodo} onValueChange={(v) => onChange({ periodo: v as Period })}>
          <SelectTrigger aria-label="Período" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {periodOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={value.imovel} onValueChange={(v) => onChange({ imovel: v })}>
          <SelectTrigger aria-label="Imóvel" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="todos">Todos os imóveis</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={value.canal} onValueChange={(v) => onChange({ canal: v as FilterState['canal'] })}>
          <SelectTrigger aria-label="Canal" className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="todos">Todos os canais</SelectItem>
              {CHANNEL_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {CHANNEL_NAMES[id]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {canClear && (
          <Button variant="ghost" size="sm" onClick={onClear} className="self-start sm:self-auto">
            Limpar filtros
          </Button>
        )}
      </div>

      <div role="group" aria-label="Status" className="flex flex-wrap gap-2">
        {statusOptions.map((o) => (
          <Pill key={o.value} active={value.status === o.value} onClick={() => onChange({ status: o.value })}>
            {o.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
