import { CalendarOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/app/shell';
import { Button, IconButton, SegmentedControl } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TODAY } from '@/lib/date';
import { formatRange } from '@/lib/format';
import { CHANNEL_IDS, CHANNEL_NAMES } from '@/mocks/types';
import type { ChannelFilter, TimelineView } from './useTimeline';

export type CalendarToolbarProps = {
  start: string;
  end: string;
  view: TimelineView;
  channel: ChannelFilter;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (v: TimelineView) => void;
  onChannelChange: (c: ChannelFilter) => void;
  onBlockDates: () => void;
};

const VIEW_OPTIONS: { value: TimelineView; label: string }[] = [
  { value: '2s', label: '2 semanas' },
  { value: 'mes', label: 'Mês' },
];

export function CalendarToolbar({
  start,
  end,
  view,
  channel,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onChannelChange,
  onBlockDates,
}: CalendarToolbarProps) {
  return (
    <>
      <PageHeader
        title="Calendário"
        subtitle="Todos os canais num só lugar. Sincronizado há 1 min."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={onBlockDates}
            iconLeft={<CalendarOff size={18} strokeWidth={1.5} aria-hidden="true" />}
            className="max-sm:min-h-11"
          >
            Bloquear datas
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-1">
          <IconButton label="Período anterior" variant="ghost" onClick={onPrev}>
            <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
          <IconButton label="Próximo período" variant="ghost" onClick={onNext}>
            <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </IconButton>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            disabled={start === TODAY}
            className="border border-line-strong max-sm:min-h-11"
          >
            Hoje
          </Button>
          <p className="ml-3 text-[17px] font-medium text-ink" aria-live="polite">
            {formatRange(start, end)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <SegmentedControl value={view} onChange={onViewChange} options={VIEW_OPTIONS} ariaLabel="Visão do calendário" />
          <Select value={channel} onValueChange={(v) => onChannelChange(v as ChannelFilter)}>
            <SelectTrigger
              aria-label="Filtrar por canal"
              className="h-11! min-w-44 rounded-pill border-line-strong bg-surface px-4 text-[14px] text-ink"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="todos">Todos os canais</SelectItem>
              {CHANNEL_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {CHANNEL_NAMES[id]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
