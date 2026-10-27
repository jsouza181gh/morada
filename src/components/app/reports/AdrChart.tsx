import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatBRL } from '@/lib/format';
import { ChartCard, TooltipCard } from './ChartCard';
import type { MonthRow } from './reportData';

const TICK = { fill: 'var(--ink-2)', fontSize: 12 };

export function AdrChart({ rows }: { rows: MonthRow[] }) {
  const reduced = useReducedMotion();
  const maxIndex = rows.reduce((best, r, i) => (r.adr > (rows[best]?.adr ?? -1) ? i : best), 0);
  const max = rows[maxIndex];

  return (
    <ChartCard
      title="Diária média por mês"
      subtitle={max ? `Maior diária média em ${max.longLabel}: ${formatBRL(max.adr)}.` : undefined}
    >
      <div aria-hidden="true" className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 24, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={TICK} tickLine={false} axisLine={false} />
            <YAxis
              tick={TICK}
              tickLine={false}
              axisLine={false}
              width={72}
              domain={['dataMin - 50', 'dataMax + 50']}
              tickFormatter={(v: number) => formatBRL(Math.round(v))}
            />
            <Tooltip
              cursor={{ stroke: 'var(--line-strong)', strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as MonthRow | undefined;
                if (!active || !row) return null;
                return (
                  <TooltipCard title={row.longLabel} rows={[{ label: 'Diária média', value: formatBRL(row.adr) }]} />
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="adr"
              stroke="var(--verde)"
              strokeWidth={2}
              isAnimationActive={!reduced}
              activeDot={{ r: 5, fill: 'var(--verde)', stroke: 'var(--surface)', strokeWidth: 2 }}
              dot={(props: { cx?: number; cy?: number; index?: number }) => {
                const { cx, cy, index } = props;
                if (index !== maxIndex || cx == null || cy == null) return <g key={`dot-${index}`} />;
                return (
                  <g key={`dot-${index}`}>
                    <circle cx={cx} cy={cy} r={6} fill="var(--verde)" stroke="var(--surface)" strokeWidth={2} />
                    <text x={cx} y={cy - 14} textAnchor="middle" fill="var(--ink)" fontSize={12} fontWeight={500}>
                      {formatBRL(rows[index]?.adr ?? 0)}
                    </text>
                  </g>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Wrapper: <table> ignora width:1px do sr-only e causaria rolagem horizontal no mobile. */}
      <div className="sr-only">
        <table>
          <caption>Diária média por mês</caption>
          <thead>
            <tr>
              <th scope="col">Mês</th>
              <th scope="col">Diária média</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month}>
                <th scope="row">{r.longLabel}</th>
                <td>{formatBRL(r.adr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
