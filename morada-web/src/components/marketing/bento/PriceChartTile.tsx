import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatBRL } from '@/lib/format';
import { easeApple } from '@/components/motion';

// Novembro de 2026: dia 1 é domingo. Sexta: d % 7 === 6; sábado: d % 7 === 0.
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const HOLIDAY = 15;

function priceFor(d: number): number {
  if (d === HOLIDAY) return 690;
  if (d === HOLIDAY - 1 || d === HOLIDAY + 1) return 600;
  const weekend = d % 7 === 6 || d % 7 === 0;
  return 420 + (weekend ? 110 : 0) + Math.round(Math.sin(d / 3) * 18);
}

const PRICES = DAYS.map(priceFor);
const X0 = 16;
const X1 = 584;
const BASE_Y = 236;
const xFor = (d: number) => X0 + ((d - 1) * (X1 - X0)) / (DAYS.length - 1);
const yFor = (v: number) => 220 - (v - 380) * 0.6;

const POINTS = DAYS.map((d, i) => [xFor(d), yFor(PRICES[i] ?? 0)] as const);
const LINE = POINTS.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const AREA = `${LINE} L${X1} ${BASE_Y} L${X0} ${BASE_Y} Z`;

const HX = xFor(HOLIDAY);
const HY = yFor(690);

export function PriceChartTile() {
  const reduced = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { amount: 0.4 });
  const [active, setActive] = useState<number | null>(null);
  const liveId = useId();

  const draw = reduced || inView;

  function dayFromPointer(e: PointerEvent<SVGSVGElement>): number {
    const rect = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * 600;
    const d = Math.round(((vx - X0) / (X1 - X0)) * (DAYS.length - 1)) + 1;
    return Math.min(DAYS.length, Math.max(1, d));
  }

  function onKeyDown(e: KeyboardEvent<SVGSVGElement>) {
    const cur = active ?? HOLIDAY;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = Math.min(DAYS.length, cur + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(1, cur - 1);
    else if (e.key === 'Home') next = 1;
    else if (e.key === 'End') next = DAYS.length;
    else if (e.key === 'Escape') {
      setActive(null);
      return;
    }
    if (next !== null) {
      e.preventDefault();
      setActive(next);
    }
  }

  const activePrice = active !== null ? (PRICES[active - 1] ?? 0) : 0;
  const ax = active !== null ? xFor(active) : 0;
  const ay = active !== null ? yFor(activePrice) : 0;
  const label = active !== null ? `${active} nov, ${formatBRL(activePrice)}` : '';
  // largura aproximada do rótulo da régua; mantém dentro do viewBox
  const labelW = 112;
  const labelX = Math.min(600 - labelW - 2, Math.max(2, ax - labelW / 2));

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h3 className="font-display text-[28px] leading-[32px] font-semibold tracking-[-0.02em]">
          Preço que acompanha a demanda.
        </h3>
        <p className="t-body max-w-[46ch] text-ink-2">
          Fins de semana e feriados sobem sozinhos. Dias parados ganham desconto. Você aprova antes.
        </p>
      </div>

      <div className="mt-auto">
        <svg
          ref={svgRef}
          viewBox="0 0 600 260"
          role="img"
          aria-label="Gráfico da diária ao longo de novembro, com picos nos fins de semana e no feriado de 15 de novembro"
          aria-describedby={liveId}
          tabIndex={0}
          className="block h-auto w-full touch-pan-y overflow-visible rounded-md"
          onPointerMove={(e) => setActive(dayFromPointer(e))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((a) => a ?? HOLIDAY)}
          onBlur={() => setActive(null)}
          onKeyDown={onKeyDown}
        >
          {[80, 150, 220].map((y) => (
            <line key={y} x1={0} x2={600} y1={y} y2={y} stroke="var(--line)" strokeWidth={1} />
          ))}

          <motion.path
            d={AREA}
            fill="var(--verde-soft)"
            initial={reduced ? false : { opacity: 0 }}
            animate={draw ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: reduced ? 0 : 0.5, ease: easeApple }}
          />
          <motion.path
            d={LINE}
            fill="none"
            stroke="var(--verde)"
            strokeWidth={3}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={draw ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: reduced ? 0 : 1.2, ease: easeApple }}
          />

          <text x={X0} y={256} fontSize={13} fill="var(--ink-2)">
            1 nov
          </text>
          <text x={X1} y={256} fontSize={13} fill="var(--ink-2)" textAnchor="end">
            30 nov
          </text>

          {/* Marcador e balão do feriado: aparecem ao fim do desenho da linha */}
          <motion.g
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={draw && active === null ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : 6 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced || active !== null ? 0 : 1.2, ease: easeApple }}
            aria-hidden="true"
          >
            <circle cx={HX} cy={HY} r={7} fill="var(--surface)" stroke="var(--verde)" strokeWidth={3} />
            <rect x={HX + 16} y={HY - 6} width={128} height={44} rx={10} fill="var(--surface-dark)" />
            <text x={HX + 28} y={HY + 11} fontSize={12} fill="var(--on-dark-2)">
              Feriado, 15 nov
            </text>
            <text x={HX + 28} y={HY + 29} fontSize={15} fontWeight={600} fill="var(--on-dark)">
              {formatBRL(690)} por noite
            </text>
          </motion.g>

          {active !== null && (
            <g aria-hidden="true" pointerEvents="none">
              <line x1={ax} x2={ax} y1={28} y2={BASE_Y} stroke="var(--ink-2)" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={ax} cy={ay} r={6} fill="var(--surface)" stroke="var(--verde)" strokeWidth={3} />
              <rect x={labelX} y={0} width={labelW} height={24} rx={12} fill="var(--surface-dark)" />
              <text
                x={labelX + labelW / 2}
                y={16}
                fontSize={12}
                fontWeight={600}
                fill="var(--on-dark)"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          )}
        </svg>
        <p id={liveId} className="sr-only" aria-live="polite">
          {active !== null
            ? `${active} de novembro: ${formatBRL(activePrice)} por noite.`
            : 'Use as setas para a esquerda e para a direita para ver a diária de cada dia.'}
        </p>
      </div>
    </div>
  );
}
