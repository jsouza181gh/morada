import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatBRL } from '@/lib/format';
import { ChartCard, Legend, TooltipCard } from './ChartCard';
import { formatBRLAxis, GROUPS, type MonthRow } from './reportData';

const TICK = { fill: 'var(--ink-2)', fontSize: 12 };

export function RevenueByChannelChart({ rows, className }: { rows: MonthRow[]; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <ChartCard title="Receita por mês e canal" className={className}>
      <div aria-hidden="true" className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
            <YAxis tick={TICK} tickLine={false} axisLine={false} width={72} tickFormatter={formatBRLAxis} />
            <Tooltip
              cursor={{ fill: 'var(--bg-alt)' }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as MonthRow | undefined;
                if (!active || !row) return null;
                return (
                  <TooltipCard
                    title={row.longLabel}
                    rows={GROUPS.map((g) => ({ label: g.label, value: formatBRL(row[g.key]), color: g.color }))}
                    footer={{ label: 'Total', value: formatBRL(row.total) }}
                  />
                );
              }}
            />
            {GROUPS.map((g, i) => (
              <Bar
                key={g.key}
                dataKey={g.key}
                name={g.label}
                stackId="receita"
                fill={g.color}
                isAnimationActive={!reduced}
                radius={i === GROUPS.length - 1 ? [6, 6, 0, 0] : 0}
                maxBarSize={36}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Legend items={GROUPS} />
      {/* Wrapper: <table> ignora width:1px do sr-only e causaria rolagem horizontal no mobile. */}
      <div className="sr-only">
        <table>
          <caption>Receita por mês e canal</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              {GROUPS.map((g) => (
                <th key={g.key} scope="col">
                  {g.label}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month}>
                <th scope="row">{r.longLabel}</th>
                {GROUPS.map((g) => (
                  <td key={g.key}>{formatBRL(r[g.key])}</td>
                ))}
                <td>{formatBRL(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
