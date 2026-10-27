import { useCallback, useEffect, useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { useAutoplay } from '@/hooks/useAutoplay';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HighlightCard, type HighlightTone } from './HighlightCard';
import { CarouselControls } from './CarouselControls';
import { PublishSlide } from './slides/PublishSlide';
import { CalendarSlide } from './slides/CalendarSlide';
import { PriceSlide } from './slides/PriceSlide';
import { InboxSlide } from './slides/InboxSlide';
import { ReportsSlide } from './slides/ReportsSlide';

type SlideDef = {
  label: string;
  tone: HighlightTone;
  title: string;
  subtitle: string;
  Visual: ComponentType<{ active: boolean }>;
};

type EmblaCarouselType = NonNullable<UseEmblaCarouselType[1]>;

const SLIDES: SlideDef[] = [
  { label: 'Publicação', tone: 'light', title: 'Publique em seis canais.', subtitle: 'Com um botão.', Visual: PublishSlide },
  { label: 'Calendário', tone: 'dark', title: 'Um calendário.', subtitle: 'Que se atualiza sozinho.', Visual: CalendarSlide },
  { label: 'Preços', tone: 'light', title: 'Você define quanto quer receber.', subtitle: 'A Morada calcula o resto.', Visual: PriceSlide },
  { label: 'Mensagens', tone: 'light', title: 'Todos os hóspedes.', subtitle: 'Numa caixa de entrada.', Visual: InboxSlide },
  { label: 'Relatórios', tone: 'dark', title: 'Saiba de onde vem cada real.', subtitle: 'Por canal, por mês.', Visual: ReportsSlide },
];

const INTERVAL_MS = 5000;
/** Alinha o primeiro card ao texto do cabeçalho (container de 980px com px-4). */
const EDGE = 'max(16px, calc((100% - 980px) / 2 + 16px))';
/** Mesmo recuo no fim do trilho; em vw porque a margem do slide não enxerga a largura da seção. */
const EDGE_END = 'max(16px, calc((100vw - 980px) / 2 + 16px))';

/** Índice do snap do Embla que contém o slide (com trimSnaps, os últimos slides podem dividir um snap). */
function snapOf(api: EmblaCarouselType, slide: number): number {
  const registry = api.internalEngine().slideRegistry;
  const snap = registry.findIndex((group) => group.includes(slide));
  return snap < 0 ? 0 : snap;
}

export function Highlights() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.35 });
  // Pausa temporária (hover/foco no trilho): não conta como pausa manual.
  const [hold, setHold] = useState(false);

  const { index, setIndex, playing, toggle, pause } = useAutoplay({
    count: SLIDES.length,
    intervalMs: INTERVAL_MS,
    enabled: !hold && inView,
  });

  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    dragFree: false,
  });

  // Slides já vistos ficam "montados" (a animação interna roda uma vez, quando o slide fica ativo).
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  // Ajuste durante o render (padrão do React para estado derivado de props/estado).
  if (inView && !seen.has(index)) setSeen(new Set(seen).add(index));

  // index -> Embla
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
    if (!emblaApi) return;
    const target = snapOf(emblaApi, index);
    if (emblaApi.selectedScrollSnap() !== target) emblaApi.scrollTo(target, reduced);
  }, [emblaApi, index, reduced]);

  // Embla -> index (arrastar). Só reage quando o snap não corresponde ao índice atual.
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = (api: EmblaCarouselType) => {
      const snap = api.selectedScrollSnap();
      if (snapOf(api, indexRef.current) === snap) return;
      const group = api.internalEngine().slideRegistry[snap];
      setIndex(group?.[0] ?? snap);
    };
    const onPointerDown = () => pause();
    emblaApi.on('select', onSelect);
    emblaApi.on('pointerDown', onPointerDown);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('pointerDown', onPointerDown);
    };
  }, [emblaApi, setIndex, pause]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight' && index < SLIDES.length - 1) {
        e.preventDefault();
        setIndex(index + 1);
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        setIndex(index - 1);
      }
    },
    [index, setIndex],
  );

  return (
    <section ref={sectionRef} id="produto" className="overflow-hidden bg-bg-alt pt-28 pb-24">
      <div className="mx-auto mb-10 flex max-w-[980px] flex-wrap items-end justify-between gap-4 px-4">
        <h2 className="t-section">Comece pelos destaques.</h2>
        <a href="#filme" className="inline-flex items-center gap-2 text-[17px] text-verde hover:underline">
          Assistir ao filme
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7.25 5.9v6.2c0 .3.33.48.58.32l4.75-3.1a.38.38 0 0 0 0-.64L7.83 5.58a.38.38 0 0 0-.58.32Z" fill="currentColor" />
          </svg>
        </a>
      </div>

      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Destaques da Morada"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
        }}
        className="cursor-grab overflow-hidden active:cursor-grabbing"
        style={{ paddingLeft: EDGE }}
      >
        <div className="flex gap-6 touch-pan-y">
          {SLIDES.map(({ label, tone, title, subtitle, Visual }, i) => (
            <div
              key={label}
              className="min-w-0 select-none"
              style={{ flex: '0 0 min(720px, 86vw)', marginRight: i === SLIDES.length - 1 ? EDGE_END : undefined }}
            >
              <HighlightCard tone={tone} title={title} subtitle={subtitle} position={i + 1} total={SLIDES.length}>
                <Visual active={seen.has(i)} />
              </HighlightCard>
            </div>
          ))}
        </div>
      </div>

      <CarouselControls
        labels={SLIDES.map((s) => s.label)}
        index={index}
        onSelect={setIndex}
        playing={playing}
        running={playing && !hold && inView && !reduced}
        intervalMs={INTERVAL_MS}
        onToggle={toggle}
      />
    </section>
  );
}
