import { useRef } from 'react';
import { Skeleton } from '@/components/ui';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMock } from '@/hooks/useMock';
import { getMetrics } from '@/mocks/api';
import { CHANNEL_IDS, type MonthlyMetric } from '@/mocks/types';
import { formatNumber } from '@/lib/format';

const MONTH = '2026-10';
const MONTH_LABEL = 'outubro';
// r tal que a circunferência = 100: dasharray vira porcentagem direto.
const R = 100 / (2 * Math.PI);

type Segment = { key: string; name: string; pct: number; color: string; start: number };

function buildSegments(m: MonthlyMetric): { total: number; segments: Segment[] } {
  const total = CHANNEL_IDS.reduce((s, id) => s + m.revenueByChannel[id], 0);
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);
  const airbnb = pct(m.revenueByChannel.airbnb);
  const booking = pct(m.revenueByChannel.booking);
  const vrbo = pct(m.revenueByChannel.vrbo);
  const list: Omit<Segment, 'start'>[] = [
    { key: 'airbnb', name: 'Airbnb', pct: airbnb, color: 'var(--verde)' },
    { key: 'booking', name: 'Booking.com', pct: booking, color: 'var(--verde-strong)' },
    { key: 'vrbo', name: 'Vrbo', pct: vrbo, color: 'color-mix(in srgb, var(--verde) 45%, var(--bg-alt))' },
    // "Outros" fecha em 100% para o anel não ficar com sobra/falta por arredondamento.
    { key: 'outros', name: 'Outros', pct: total > 0 ? 100 - airbnb - booking - vrbo : 0, color: 'var(--line-strong)' },
  ];
  let acc = 0;
  const segments = list.map((seg) => {
    const start = acc;
    acc += seg.pct;
    return { ...seg, start };
  });
  return { total, segments };
}

const formatThousands = (v: number) => `R$ ${formatNumber(Math.round(v / 1000))} mil`;

export function RevenueDonutTile() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const { data } = useMock(getMetrics);
  const month = data?.find((m) => m.month === MONTH);
  const built = month ? buildSegments(month) : null;
  const show = built !== null && (reduced || inView);

  return (
    <div className="flex h-full flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10">
      <div ref={ref} className="relative size-[180px] shrink-0 sm:size-[200px]">
        <svg
          viewBox="0 0 42 42"
          className="size-full -rotate-90"
          role="img"
          aria-label={
            built
              ? `Receita de ${MONTH_LABEL}: ${formatThousands(built.total)}. ${built.segments
                  .map((s) => `${s.name} ${s.pct}%`)
                  .join(', ')}.`
              : `Receita de ${MONTH_LABEL} por canal, carregando.`
          }
        >
          <circle cx={21} cy={21} r={R} fill="none" stroke="var(--line)" strokeWidth={5} opacity={0.5} />
          {built?.segments.map((s, i) => (
            <circle
              key={s.key}
              cx={21}
              cy={21}
              r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={5}
              strokeDasharray={show ? `${s.pct} ${100 - s.pct}` : '0 100'}
              strokeDashoffset={-s.start}
              style={{
                transition: reduced ? undefined : `stroke-dasharray 900ms cubic-bezier(0.3, 1, 0.4, 1) ${i * 150}ms`,
              }}
            />
          ))}
        </svg>
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          {built ? (
            <>
              <span className="font-display text-[22px] leading-[26px] font-semibold tracking-[-0.02em]">
                {formatThousands(built.total)}
              </span>
              <span className="t-caption text-ink-2">{MONTH_LABEL}</span>
            </>
          ) : (
            <Skeleton className="h-6 w-24" />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="font-display text-[28px] leading-[32px] font-semibold tracking-[-0.02em]">Relatórios claros.</h3>
        {built ? (
          <ul className="flex flex-col gap-2">
            {built.segments.map((s) => (
              <li key={s.key} className="t-body-sm flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 shrink-0 rounded-pill" style={{ background: s.color }} />
                <span>{s.name}</span>
                <span className="text-ink-2 tabular-nums">{s.pct}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-32" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
