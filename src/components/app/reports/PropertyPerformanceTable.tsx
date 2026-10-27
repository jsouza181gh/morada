import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatBRL, formatNumber, formatPct } from '@/lib/format';
import { totalsOf, type PropertyRow } from './reportData';

type SortKey = 'name' | 'revenue' | 'nights' | 'occupancy' | 'adr' | 'rating';
type Dir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: 'name', label: 'Imóvel', numeric: false },
  { key: 'revenue', label: 'Receita', numeric: true },
  { key: 'nights', label: 'Noites', numeric: true },
  { key: 'occupancy', label: 'Ocupação', numeric: true },
  { key: 'adr', label: 'Diária média', numeric: true },
  { key: 'rating', label: 'Nota', numeric: true },
];

const rating = (n: number) => (n > 0 ? formatNumber(n, 2) : 'Sem notas');

export function PropertyPerformanceTable({ rows }: { rows: PropertyRow[] }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Dir }>({ key: 'revenue', dir: 'desc' });
  const totals = totalsOf(rows);

  const sorted = [...rows].sort((a, b) => {
    const cmp = sort.key === 'name' ? a.name.localeCompare(b.name, 'pt-BR') : a[sort.key] - b[sort.key];
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  function toggle(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' },
    );
  }

  return (
    <section className="rounded-lg bg-surface p-6" aria-labelledby="desempenho-imovel">
      <h2 id="desempenho-imovel" className="text-[19px] leading-6 font-medium text-ink">
        Desempenho por imóvel
      </h2>
      <div className="mt-5 overflow-x-auto">
        <table className="t-body-sm w-full min-w-[640px] text-ink">
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((c) => {
                const active = sort.key === c.key;
                const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                    className={cn('py-2 font-medium text-ink-2', c.numeric ? 'text-right' : 'text-left')}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      className={cn(
                        'inline-flex min-h-11 items-center gap-1 rounded-sm px-1 hover:text-ink',
                        active && 'text-ink',
                        c.numeric && 'flex-row-reverse',
                      )}
                    >
                      {c.label}
                      <Icon size={14} strokeWidth={1.5} aria-hidden="true" className={active ? '' : 'opacity-50'} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b border-line">
                <th scope="row" className="py-3 pr-4 pl-1 text-left font-normal">
                  {r.name}
                </th>
                <td className="py-3 pr-1 text-right tabular-nums">{formatBRL(r.revenue)}</td>
                <td className="py-3 pr-1 text-right tabular-nums">{formatNumber(r.nights)}</td>
                <td className="py-3 pr-1 text-right tabular-nums">{formatPct(r.occupancy)}</td>
                <td className="py-3 pr-1 text-right tabular-nums">{formatBRL(r.adr)}</td>
                <td className="py-3 pr-1 text-right tabular-nums">{rating(r.rating)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium">
              <th scope="row" className="py-3 pr-4 pl-1 text-left font-medium">
                Total
              </th>
              <td className="py-3 pr-1 text-right tabular-nums">{formatBRL(totals.revenue)}</td>
              <td className="py-3 pr-1 text-right tabular-nums">{formatNumber(totals.nights)}</td>
              <td className="py-3 pr-1 text-right tabular-nums">{formatPct(totals.occupancy)}</td>
              <td className="py-3 pr-1 text-right tabular-nums">{formatBRL(totals.adr)}</td>
              <td className="py-3 pr-1 text-right tabular-nums">{rating(totals.rating)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
