import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { Info, X } from 'lucide-react';
import { Button, IconButton } from '@/components/ui';
import { springs, useReducedMotion } from '@/components/motion';
import { useMock } from '@/hooks/useMock';
import { getChannels } from '@/mocks/api';
import type { Channel } from '@/mocks/types';
import { PublishProgress } from './PublishProgress';
import { Stepper } from './Stepper';
import {
  MIN_PHOTOS,
  STEP_COUNT,
  TYPE_LABEL,
  channelsLabel,
  isConnected,
  toPropertyDraft,
  useWizardDraft,
  validateStep,
  type PropertyDraft,
  type StepProps,
} from './useWizardDraft';
import { StepChannels } from './steps/StepChannels';
import { StepDescription } from './steps/StepDescription';
import { StepDetails } from './steps/StepDetails';
import { StepLocation } from './steps/StepLocation';
import { StepPhotos } from './steps/StepPhotos';
import { StepPricing } from './steps/StepPricing';
import { StepReview } from './steps/StepReview';

const HEADINGS: { title: string; lead: string }[] = [
  { title: 'Onde fica o imóvel?', lead: 'O endereço exato só é mostrado ao hóspede depois da reserva.' },
  { title: 'Conte como é o espaço.', lead: 'Diga quantas pessoas cabem e o que o imóvel oferece.' },
  { title: 'Mostre o imóvel.', lead: 'Envie pelo menos 5 fotos. A primeira vira a capa.' },
  { title: 'Como você descreveria o imóvel?', lead: 'O título é ajustado ao limite de cada canal.' },
  {
    title: 'Quanto você quer receber?',
    lead: 'Informe o valor líquido. A Morada ajusta o preço de cada canal pela taxa dele.',
  },
  {
    title: 'Onde o imóvel vai aparecer?',
    lead: 'Ligue os canais em que quer publicar. Toque num canal para ver como o anúncio fica lá.',
  },
  { title: 'Tudo certo para publicar?', lead: 'Confira cada parte. Você ainda pode editar antes de publicar.' },
];

const slide: Variants = {
  enter: (dir: number) => ({ x: dir * 24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -24, opacity: 0 }),
};

function savedLabel(dirty: boolean, savedAt: number | null, now: number): string {
  if (dirty) return 'Salvando rascunho…';
  if (savedAt === null) return 'Rascunho ainda não salvo';
  const min = Math.floor(Math.max(0, now - savedAt) / 60_000);
  if (min < 1) return 'Rascunho salvo agora';
  if (min < 60) return `Rascunho salvo há ${min} min`;
  const h = Math.floor(min / 60);
  return `Rascunho salvo há ${h} h`;
}

/** Título do passo; recebe o foco ao montar quando o usuário trocou de passo. */
function StepHeading({ title, focus, children }: { title: string; focus: boolean; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focus) ref.current?.focus();
    // só ao montar
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <header className="mb-10 flex flex-col gap-3">
      <h1
        ref={ref}
        tabIndex={-1}
        className="font-display text-[32px] leading-9 font-medium tracking-[-0.025em] text-ink outline-none sm:text-[40px] sm:leading-[44px]"
      >
        {title}
      </h1>
      <p className="t-lead max-w-[60ch] text-ink-2">{children}</p>
    </header>
  );
}

export function WizardShell() {
  const wizard = useWizardDraft();
  const { draft, update, step, setStep, maxStep } = wizard;
  const reduced = useReducedMotion();
  const { data: channels } = useMock(getChannels);
  const [attempted, setAttempted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [now, setNow] = useState(() => Date.now());
  const [payload, setPayload] = useState<PropertyDraft | null>(null);
  const [publishChannels, setPublishChannels] = useState<Channel[]>([]);
  const [focusHeading, setFocusHeading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  // Atualiza o "há N min" logo depois de cada salvamento.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- sincroniza o relógio com o salvamento
    setNow(Date.now());
  }, [wizard.savedAt]);

  const errors = useMemo(() => (attempted ? validateStep(step, draft) : {}), [attempted, step, draft]);

  const chosen = useMemo(
    () => (channels ?? []).filter((c) => draft.selectedChannels.includes(c.id) && isConnected(c, draft)),
    [channels, draft],
  );
  const selectedCount = channels ? chosen.length : draft.selectedChannels.length;

  const goTo = (target: number) => {
    if (target === step) return;
    if (target > step) {
      // valida o passo atual e os intermediários antes de avançar
      for (let s = step; s < target; s++) {
        const errs = validateStep(s, draft);
        const first = Object.keys(errs)[0];
        if (first) {
          if (s !== step) {
            setDirection(1);
            setFocusHeading(false);
            setStep(s);
          }
          setAttempted(true);
          requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`f-${first}`)?.focus()));
          return;
        }
      }
    }
    setAttempted(false);
    setDirection(target > step ? 1 : -1);
    setFocusHeading(true);
    setStep(target);
  };

  const publish = () => {
    if (!channels || chosen.length === 0) return;
    setPublishChannels(chosen);
    setPayload(toPropertyDraft({ ...draft, selectedChannels: chosen.map((c) => c.id) }, channels));
  };

  const onContinue = () => (step === STEP_COUNT - 1 ? publish() : goTo(step + 1));

  const continueLabel =
    step === 5 ? 'Revisar e publicar' : step === 6 ? `Publicar em ${channelsLabel(selectedCount)}` : 'Continuar';

  const summary = (() => {
    switch (step) {
      case 0:
        return draft.city ? `${TYPE_LABEL[draft.type]} em ${draft.city}` : `Passo 1 de ${STEP_COUNT}`;
      case 2:
        return `${draft.photos.length} de ${MIN_PHOTOS} fotos`;
      case 5:
      case 6:
        return selectedCount === 0
          ? 'Ligue ao menos um canal'
          : `${channelsLabel(selectedCount)} ${selectedCount === 1 ? 'selecionado' : 'selecionados'}`;
      default:
        return `Passo ${step + 1} de ${STEP_COUNT}`;
    }
  })();

  const stepProps: StepProps = { draft, update, errors, channels };
  const content = [
    <StepLocation key="0" {...stepProps} />,
    <StepDetails key="1" {...stepProps} />,
    <StepPhotos key="2" {...stepProps} />,
    <StepDescription key="3" {...stepProps} />,
    <StepPricing key="4" {...stepProps} />,
    <StepChannels key="5" {...stepProps} />,
    <StepReview key="6" {...stepProps} onEdit={goTo} />,
  ][step];
  const heading = HEADINGS[step] ?? HEADINGS[0]!;

  const body = (
    <>
      <StepHeading title={heading.title} focus={focusHeading}>
        {heading.lead}
      </StepHeading>
      {content}
    </>
  );

  return (
    <div className="app-scope flex min-h-svh flex-col bg-bg-alt text-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-4">
          <span className="font-display text-[21px] font-medium tracking-[-0.01em] text-ink">Morada</span>
          <div className="flex min-w-0 items-center gap-4">
            <span className="t-caption hidden truncate font-normal text-ink-2 sm:inline" role="status">
              {savedLabel(wizard.dirty, wizard.savedAt, now)}
            </span>
            <Link
              to="/app/imoveis"
              onClick={wizard.flush}
              className="t-body-sm inline-flex min-h-11 items-center rounded-sm px-1 text-verde hover:underline"
            >
              Sair do cadastro
            </Link>
          </div>
        </div>
      </header>

      <Stepper current={step} maxStep={maxStep} onSelect={goTo} />

      {wizard.restored && (
        <div className="border-b border-line bg-verde-soft">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
            <Info size={20} strokeWidth={1.5} aria-hidden="true" className="text-verde" />
            <p className="t-body-sm flex-1 text-ink" role="status">
              Continuamos de onde você parou.
            </p>
            <Button variant="secondary" size="sm" onClick={wizard.reset}>
              Começar do zero
            </Button>
            <IconButton variant="ghost" label="Fechar aviso" onClick={wizard.dismissRestored}>
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-[1180px] flex-1 overflow-x-clip px-4 py-10">
        {reduced ? (
          <div key={step}>{body}</div>
        ) : (
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springs.gentle}
            >
              {body}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <footer className="sticky bottom-0 z-20 border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-3">
          <Button variant="secondary" disabled={step === 0} onClick={() => goTo(step - 1)}>
            Voltar
          </Button>
          <div className="flex min-w-0 items-center gap-4">
            <span className="t-body-sm hidden truncate text-ink-2 sm:inline" aria-live="polite">
              {summary}
            </span>
            <Button
              onClick={onContinue}
              disabled={(step >= 5 && selectedCount === 0) || (step === 6 && !channels)}
            >
              {continueLabel}
            </Button>
          </div>
        </div>
      </footer>

      <PublishProgress
        payload={payload}
        channels={publishChannels}
        onPublished={wizard.discard}
        onClose={() => setPayload(null)}
        onAnother={() => {
          setPayload(null);
          wizard.reset();
          wizard.resume();
          setAttempted(false);
          setFocusHeading(true);
        }}
      />
    </div>
  );
}
