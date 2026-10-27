import { useId } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SegmentedControl } from '@/components/ui';

export type StatusFilter = 'todos' | 'pendencia' | 'publicado';
export type ViewMode = 'grade' | 'lista';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'pendencia', label: 'Com pendência' },
  { value: 'publicado', label: 'Tudo publicado' },
];

const VIEW_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'grade', label: 'Grade' },
  { value: 'lista', label: 'Lista' },
];

export type PropertyFiltersProps = {
  query: string;
  status: StatusFilter;
  view: ViewMode;
  onQueryChange: (q: string) => void;
  onStatusChange: (s: StatusFilter) => void;
  onViewChange: (v: ViewMode) => void;
};

export function PropertyFilters({
  query,
  status,
  view,
  onQueryChange,
  onStatusChange,
  onViewChange,
}: PropertyFiltersProps) {
  const searchId = useId();
  const statusId = useId();
  return (
    <div role="search" className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-72">
        <label htmlFor={searchId} className="sr-only">
          Buscar por nome ou cidade
        </label>
        <Search
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-2"
        />
        <Input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por nome ou cidade"
          className="h-11 rounded-pill bg-surface pr-4 pl-11 text-[14px] md:text-[14px]"
        />
      </div>
      <label htmlFor={statusId} className="sr-only">
        Status dos anúncios
      </label>
      <Select value={status} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
        <SelectTrigger
          id={statusId}
          className="rounded-pill bg-surface px-4 text-[14px] data-[size=default]:h-11 max-sm:flex-1"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="start">
          <SelectGroup>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <SegmentedControl
        ariaLabel="Modo de exibição"
        value={view}
        onChange={onViewChange}
        options={VIEW_OPTIONS}
        className="sm:ml-auto"
      />
    </div>
  );
}
