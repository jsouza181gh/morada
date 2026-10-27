import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { formatBRL, formatNumber, formatPct } from '@/lib/format';
import { dashboardSummary, metrics } from '@/mocks/metrics';
import { properties } from '@/mocks/properties';
import {
  CHANNEL_IDS,
  CHANNEL_NAMES,
  type DashboardSummary,
  type ListingStatus,
  type MonthlyMetric,
} from '@/mocks/types';

/** Tamanho de desenho da tela do notebook (largura útil da LaptopFrame com 860px). */
const DESIGN_W = 832;
const DESIGN_H = 520;

const NAV = ['Visão geral', 'Imóveis', 'Calendário', 'Reservas', 'Mensagens', 'Canais'];

type Kpi = { label: string; value: string; delta: string; down?: boolean };
type ChannelRow = { name: string; status: ListingStatus };

const STATUS: Record<ListingStatus, { label: string; className: string }> = {
  published: { label: 'Publicado', className: 'text-verde' },
  pending: { label: 'Em análise', className: 'text-warning' },
  error: { label: 'Erro', className: 'text-danger' },
  off: { label: 'Desligado', className: 'text-ink-2' },
};

const LAGOA = properties.find((p) => p.id === 'lagoa');

const sign = (n: number) => (n < 0 ? '−' : '+');
const signedPct = (r: number) => `${sign(r)}${formatPct(Math.abs(r), 1)}`;

function toKpis(s: DashboardSummary): Kpi[] {
  return [
    {
      label: 'Receita de outubro',
      value: formatBRL(Math.round(s.revenueMonth)),
      delta: signedPct(s.revenueDeltaPct),
      down: s.revenueDeltaPct < 0,
    },
    {
      label: 'Ocupação',
      value: formatPct(s.occupancy),
      delta: `${sign(s.occupancyDeltaPp)}${formatNumber(Math.abs(s.occupancyDeltaPp), 1)} p.p.`,
      down: s.occupancyDeltaPp < 0,
    },
    {
      label: 'Diária média',
      value: formatBRL(Math.round(s.adr)),
      delta: signedPct(s.adrDeltaPct),
      down: s.adrDeltaPct < 0,
    },
    {
      label: 'Avaliação',
      value: formatNumber(s.rating, 2),
      delta: `${sign(s.ratingDelta)}${formatNumber(Math.abs(s.ratingDelta), 2)}`,
      down: s.ratingDelta < 0,
    },
  ];
}

/** Receita total por mês → altura em % (a maior vale 96%). */
function toBars(metrics: MonthlyMetric[]): number[] {
  const totals = metrics.map((m) => Object.values(m.revenueByChannel).reduce((a, b) => a + b, 0));
  const max = Math.max(...totals, 1);
  return totals.map((t) => Math.max(6, (t / max) * 96));
}

/**
 * Painel da Morada em miniatura, desenhado em 832×520 e escalado para caber na tela do notebook.
 * Puramente decorativo: o palco do hero já descreve a cena com role="img".
 */
export function MiniDashboard() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Valores reais calculados de forma síncrona a partir dos mocks: o hero nunca mostra números provisórios.
  const KPIS = toKpis(dashboardSummary);
  const BARS = toBars(metrics);
  const CHANNELS: ChannelRow[] = CHANNEL_IDS.map((id) => ({
    name: CHANNEL_NAMES[id],
    status: LAGOA?.channels[id].status ?? 'published',
  }));

  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / DESIGN_W);
    };
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden">
      <div
        className="app-scope flex origin-top-left bg-bg-alt font-sans text-ink select-none"
        style={{ width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})` }}
      >
        {/* Sidebar */}
        <div className="flex w-[150px] shrink-0 flex-col gap-1 bg-surface-dark px-3 py-4 text-on-dark">
          <span className="mb-3 px-2 font-display text-[14px] font-semibold tracking-[-0.01em]">Morada</span>
          {NAV.map((item, i) => (
            <span
              key={item}
              className={cn(
                'rounded-[6px] px-2 py-1.5 text-[10px]',
                i === 0 ? 'bg-white/12 text-on-dark' : 'text-on-dark-2',
              )}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex min-w-0 flex-1 flex-col gap-3.5 p-5">
          <span className="font-display text-[20px] font-medium tracking-[-0.015em] text-ink">Boa tarde, Ana.</span>

          <div className="grid grid-cols-4 gap-2.5">
            {KPIS.map((k) => (
              <div key={k.label} className="flex flex-col gap-1 rounded-[10px] bg-surface p-3">
                <span className="text-[9px] text-ink-2">{k.label}</span>
                <span className="font-display text-[18px] leading-none font-medium tracking-[-0.01em] tabular-nums">
                  {k.value}
                </span>
                <span className={cn('text-[9px] font-semibold', k.down ? 'text-danger' : 'text-verde')}>
                  <span aria-hidden="true">{k.down ? '↓ ' : '↑ '}</span>
                  {k.delta}
                </span>
              </div>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 gap-2.5">
            <div className="flex min-w-0 flex-[1.6] flex-col gap-2 rounded-[10px] bg-surface p-3">
              <span className="text-[10px] font-semibold">Receita por mês</span>
              <div className="flex flex-1 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <span
                    key={i}
                    className={cn('flex-1 rounded-t-[3px]', i === BARS.length - 1 && 'bg-verde')}
                    style={{
                      height: `${h}%`,
                      background:
                        i === BARS.length - 1 ? undefined : 'color-mix(in srgb, var(--verde) 30%, var(--bg-alt))',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[10px] bg-surface p-3 max-sm:hidden">
              <span className="mb-0.5 text-[10px] font-semibold">Canais</span>
              {CHANNELS.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between border-b border-line pb-1.5 last:border-0"
                >
                  <span className="text-[10px]">{c.name}</span>
                  <span className={cn('text-[9px] font-semibold', STATUS[c.status].className)}>
                    {STATUS[c.status].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
