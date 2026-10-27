import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { isWeekend, TODAY } from '@/lib/date';
import { formatWeekday } from '@/lib/format';
import type { Property, Reservation } from '@/mocks/types';
import { TimelineRow } from './TimelineRow';
import { isNightTaken } from './useTimeline';

export type TimelineGridProps = {
  properties: Property[];
  days: string[];
  /** Todas as reservas ativas do período (usadas para saber quais dias estão livres). */
  reservations: Reservation[];
  /** Reservas exibidas (filtradas por canal). */
  visibleReservations: Reservation[];
  highlightId?: string;
  /** Intervalo de dias livres escolhido (from e to inclusivos). */
  onSelectRange: (propertyId: string, from: string, to: string) => void;
};

type Selection = { row: number; anchor: number; end: number };

export function TimelineGrid({
  properties,
  days,
  reservations,
  visibleReservations,
  highlightId,
  onSelectRange,
}: TimelineGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [scrolled, setScrolled] = useState(false);
  const todayIdx = days.indexOf(TODAY);
  const [focus, setFocus] = useState<{ row: number; col: number }>({ row: 0, col: Math.max(0, todayIdx) });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [dragging, setDragging] = useState(false);

  const n = days.length;
  const focusCol = Math.min(focus.col, n - 1);

  const free = useMemo(
    () => properties.map((p) => days.map((d) => d >= TODAY && !isNightTaken(reservations, p.id, d))),
    [properties, days, reservations],
  );

  const byProperty = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of visibleReservations) {
      if (r.status === 'cancelled') continue;
      const list = map.get(r.propertyId) ?? [];
      list.push(r);
      map.set(r.propertyId, list);
    }
    return map;
  }, [visibleReservations]);

  // Rola até o imóvel em destaque (?imovel=).
  useEffect(() => {
    if (!highlightId) return;
    rowRefs.current.get(highlightId)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightId, properties.length]);

  /** Estende a seleção a partir da âncora sem atravessar dias ocupados. */
  function clampTo(row: number, anchor: number, target: number): number {
    const rowFree = free[row] ?? [];
    const step = target >= anchor ? 1 : -1;
    let i = anchor;
    while (i !== target && rowFree[i + step]) i += step;
    return i;
  }

  function range(sel: Selection): [number, number] {
    return [Math.min(sel.anchor, sel.end), Math.max(sel.anchor, sel.end)];
  }

  function commit(sel: Selection | null) {
    if (!sel) return;
    const property = properties[sel.row];
    const [a, b] = range(sel);
    if (!property || !free[sel.row]?.[a]) return;
    onSelectRange(property.id, days[a]!, days[b]!);
    setSelection(null);
  }

  // Termina o arrasto ao soltar o mouse em qualquer lugar.
  useEffect(() => {
    if (!dragging) return;
    function onUp() {
      setDragging(false);
      commit(selection);
    }
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  });

  function focusCell(row: number, col: number) {
    const r = Math.max(0, Math.min(properties.length - 1, row));
    const c = Math.max(0, Math.min(n - 1, col));
    setFocus({ row: r, col: c });
    scrollRef.current?.querySelector<HTMLButtonElement>(`[data-cell="${r}-${c}"]`)?.focus();
  }

  function onCellPointerDown(row: number, col: number) {
    setFocus({ row, col });
    if (!free[row]?.[col]) {
      setSelection(null);
      return;
    }
    setSelection({ row, anchor: col, end: col });
    setDragging(true);
  }

  function onCellPointerEnter(row: number, col: number) {
    if (!dragging || !selection || row !== selection.row) return;
    setSelection({ ...selection, end: clampTo(row, selection.anchor, col) });
  }

  function onCellKeyDown(e: KeyboardEvent<HTMLButtonElement>, row: number, col: number) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    };
    const move = moves[e.key];
    if (move) {
      e.preventDefault();
      const [dr, dc] = move;
      if (e.shiftKey && dr === 0) {
        if (!free[row]?.[col] && !selection) return;
        const sel = selection && selection.row === row ? selection : { row, anchor: col, end: col };
        const end = clampTo(row, sel.anchor, Math.max(0, Math.min(n - 1, sel.end + dc)));
        setSelection({ ...sel, end });
        focusCell(row, end);
        return;
      }
      if (!e.shiftKey) setSelection(null);
      focusCell(row + dr, col + dc);
      return;
    }
    switch (e.key) {
      case 'Home':
        e.preventDefault();
        focusCell(row, 0);
        break;
      case 'End':
        e.preventDefault();
        focusCell(row, n - 1);
        break;
      case 'Escape':
        if (selection) {
          e.preventDefault();
          setSelection(null);
        }
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (selection && selection.row === row) commit(selection);
        else if (free[row]?.[col]) commit({ row, anchor: col, end: col });
        break;
      }
    }
  }

  return (
    <div
      ref={scrollRef}
      onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 0)}
      className="max-h-[calc(100dvh-280px)] min-h-[320px] overflow-auto rounded-lg bg-surface overscroll-x-contain"
    >
      <div className={cn('select-none', n > 14 ? 'min-w-[1600px]' : 'min-w-[980px]')}>
        <div className="sticky top-0 z-20 flex h-14 border-b border-line bg-surface">
          <div
            className={cn(
              'sticky left-0 z-10 flex w-[180px] shrink-0 items-end bg-surface px-4 pb-2 transition-shadow',
              scrolled && 'shadow-[6px_0_10px_-6px_rgba(0,0,0,0.18)]',
            )}
          >
            <span className="t-caption text-ink-2">Imóveis</span>
          </div>
          <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {days.map((day) => {
              const isToday = day === TODAY;
              return (
                <div
                  key={day}
                  className={cn(
                    'flex flex-col items-center justify-center border-l border-line leading-tight',
                    isWeekend(day) && 'bg-bg-alt',
                    isToday ? 'bg-verde-soft text-verde' : 'text-ink-2',
                  )}
                >
                  <span className="text-[11px] font-medium">{formatWeekday(day)}</span>
                  <span className={cn('text-[15px] font-medium', !isToday && 'text-ink')}>
                    {Number(day.slice(8, 10))}
                  </span>
                  {isToday && <span className="sr-only">hoje</span>}
                </div>
              );
            })}
          </div>
        </div>

        {properties.map((p, row) => (
          <TimelineRow
            key={p.id}
            ref={(el) => {
              if (el) rowRefs.current.set(p.id, el);
              else rowRefs.current.delete(p.id);
            }}
            property={p}
            rowIndex={row}
            days={days}
            reservations={byProperty.get(p.id) ?? []}
            free={free[row] ?? []}
            highlighted={p.id === highlightId}
            scrolled={scrolled}
            selection={selection && selection.row === row ? range(selection) : null}
            focusCol={focus.row === row ? focusCol : null}
            onCellPointerDown={onCellPointerDown}
            onCellPointerEnter={onCellPointerEnter}
            onCellTap={(r, c) => {
              setFocus({ row: r, col: c });
              if (free[r]?.[c]) commit({ row: r, anchor: c, end: c });
            }}
            onCellKeyDown={onCellKeyDown}
            onCellFocus={(r, c) => setFocus({ row: r, col: c })}
          />
        ))}
      </div>
    </div>
  );
}
