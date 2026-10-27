import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatBRL, formatPct } from '@/lib/format';
import { ChartCard, TooltipCard } from './ChartCard';
import { GROUPS, type MonthRow } from './reportData';

export function ChannelShareChart({ rows, className }: { rows: MonthRow[]; className?: string }) {
  const reduced = useReducedMotion();
  const total = rows.reduce((s, r) => s + r.total, 0);
  const data = GROUPS.map((g) => {
    const value = rows.reduce((s, r) => s + r[g.key], 0);
    return { ...g, value, share: total > 0 ? value / total : 0 };
  });

  return (
    <ChartCard title="Participação dos canais" className={className}>
      <div className="flex flex-col items-center gap-6 sm:flex-row md:flex-col lg:flex-row">
        <div aria-hidden="true" className="relative size-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={1}
                stroke="var(--surface)"
                strokeWidth={2}
                isAnimationActive={!reduced}
              >
                {data.map((d) => (
                  <Cell key={d.key} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  const d = payload?.[0]?.payload as (typeof data)[number] | undefined;
                  if (!active || !d) return null;
                  return (
                    <TooltipCard
                      title={d.label}
                      rows={[
                        { label: 'Receita', value: formatBRL(d.value), color: d.color },
                        { label: 'Participação', value: formatPct(d.share) },
                      ]}
                    />
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="t-caption text-ink-2">Total</span>
            <span className="font-display text-[21px] leading-7 font-medium text-ink">{formatBRL(total)}</span>
          </div>
        </div>
        <ul className="t-body-sm w-full min-w-0 flex-1 space-y-3" aria-hidden="true">
          {data.map((d) => (
            <li key={d.key} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-ink">
                <span className="size-2.5 shrink-0 rounded-pill" style={{ background: d.color }} />
                {d.label}
              </span>
              <span className="tabular-nums text-ink-2">{formatPct(d.share)}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Wrapper: <table> ignora width:1px do sr-only e causaria rolagem horizontal no mobile. */}
      <div className="sr-only">
        <table>
          <caption>Participação dos canais na receita. Total {formatBRL(total)}.</caption>
          <thead>
            <tr>
              <th scope="col">Canal</th>
              <th scope="col">Receita</th>
              <th scope="col">Participação</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key}>
                <th scope="row">{d.label}</th>
                <td>{formatBRL(d.value)}</td>
                <td>{formatPct(d.share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
