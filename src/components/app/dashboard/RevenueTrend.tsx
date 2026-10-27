import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Skeleton } from '@/components/ui';
import { useReducedMotion } from '@/components/motion';
import { formatBRL, formatDateShort, formatNumber } from '@/lib/format';
import type { MonthlyMetric } from '@/mocks/types';

type RevenueTrendProps = { metrics: MonthlyMetric[] | undefined };

type Row = { month: string; label: string; airbnb: number; booking: number; outros: number; total: number };

const SERIES = [
  { key: 'airbnb', name: 'Airbnb', color: 'var(--verde)' },
  { key: 'booking', name: 'Booking.com', color: 'var(--verde-strong)' },
  { key: 'outros', name: 'Outros', color: 'var(--line-strong)' },
] as const;

const monthLabel = (month: string) => formatDateShort(`${month}-01`).split(' ')[1] ?? month;

function monthLong(month: string): string {
  const [y, m] = month.split('-').map(Number) as [number, number];
  const name = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
  return `${name} de ${y}`;
}

function toRows(metrics: MonthlyMetric[]): Row[] {
  return metrics.map((m) => {
    const r = m.revenueByChannel;
    const outros = r.vrbo + r.trivago + r.decolar + r.expedia;
    return {
      month: m.month,
      label: monthLabel(m.month),
      airbnb: r.airbnb,
      booking: r.booking,
      outros,
      total: r.airbnb + r.booking + outros,
    };
  });
}

const yTick = (v: number) => (v === 0 ? 'R$ 0' : `R$ ${formatNumber(v / 1000)} mil`);

function TrendTooltip({ active, row }: { active?: boolean; row: Row | undefined }) {
  if (!active || !row) return null;
  return (
    <div className="t-body-sm rounded-md bg-surface p-3 text-ink shadow-float">
      <p className="font-medium capitalize">{monthLong(row.month)}</p>
      <p className="mt-1">
        Total <span className="font-medium">{formatBRL(row.total)}</span>
      </p>
      <ul className="mt-2 flex flex-col gap-1">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-ink-2">
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: s.color }} />
            <span>{s.name}</span>
            <span className="ml-auto pl-4 text-ink tabular-nums">{formatBRL(row[s.key])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RevenueTrend({ metrics }: RevenueTrendProps) {
  const reduced = useReducedMotion();
  const rows = metrics ? toRows(metrics) : [];

  return (
    <section aria-labelledby="dash-revenue-trend" className="rounded-lg bg-surface p-6 text-ink">
      <h2 id="dash-revenue-trend" className="mb-6 text-[21px] leading-7 font-medium">
        Receita nos últimos 12 meses
      </h2>

      {!metrics ? (
        <>
          <Skeleton className="h-[240px] w-full" />
          <Skeleton className="mt-4 h-5 w-64" />
        </>
      ) : (
        <>
          <div className="h-[240px] w-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="4 4" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--ink-2)', fontSize: 12 }}
                  interval="preserveStartEnd"
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={yTick}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'var(--ink-2)', fontSize: 12 }}
                  width={84}
                />
                <Tooltip
                  cursor={{ stroke: 'var(--line-strong)', strokeDasharray: '4 4' }}
                  isAnimationActive={!reduced}
                  content={({ active, label }) => (
                    <TrendTooltip active={active} row={rows.find((r) => r.label === label)} />
                  )}
                />
                {SERIES.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.name}
                    stackId="receita"
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.85}
                    strokeWidth={1.5}
                    isAnimationActive={!reduced}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
            {SERIES.map((s) => (
              <li key={s.key} className="t-caption flex items-center gap-2 text-ink-2">
                <span className="size-2.5 rounded-full" style={{ background: s.color, opacity: 0.85 }} />
                {s.name}
              </li>
            ))}
          </ul>

          {/* Wrapper: <table> ignora width:1px do sr-only e causaria rolagem horizontal no mobile. */}
          <div className="sr-only">
            <table>
              <caption>
                Receita mensal por canal, de {monthLong(rows[0]?.month ?? '')} a {monthLong(rows.at(-1)?.month ?? '')}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Mês</th>
                  {SERIES.map((s) => (
                    <th key={s.key} scope="col">
                      {s.name}
                    </th>
                  ))}
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.month}>
                    <th scope="row">{monthLong(r.month)}</th>
                    {SERIES.map((s) => (
                      <td key={s.key}>{formatBRL(r[s.key])}</td>
                    ))}
                    <td>{formatBRL(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
