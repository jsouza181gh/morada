import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { STEP_LABELS } from './useWizardDraft';

type StepperProps = {
  current: number;
  /** Passo mais distante já alcançado. Passos antes dele (e diferentes do atual) contam como concluídos. */
  maxStep: number;
  onSelect: (index: number) => void;
};

export function Stepper({ current, maxStep, onSelect }: StepperProps) {
  return (
    <div className="border-b border-line bg-surface">
      <ol
        aria-label="Etapas do cadastro"
        className="relative mx-auto flex max-w-[1180px] gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]"
      >
        {STEP_LABELS.map((label, i) => {
          const isCurrent = i === current;
          const done = !isCurrent && i <= maxStep;
          const pillBase = 't-body-sm inline-flex h-10 shrink-0 items-center gap-2 rounded-pill px-4 whitespace-nowrap';
          return (
            <li key={label} className="shrink-0">
              {isCurrent ? (
                <span aria-current="step" className={cn(pillBase, 'bg-verde font-medium text-on-verde')}>
                  <span aria-hidden="true" className="tabular-nums">
                    {i + 1}
                  </span>
                  {label}
                </span>
              ) : done ? (
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  className={cn(pillBase, 'bg-surface pl-1.5 text-ink transition-colors hover:bg-bg-alt')}
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex size-7 items-center justify-center rounded-pill bg-verde-soft text-verde"
                  >
                    <Check size={16} strokeWidth={2} />
                  </span>
                  {label}
                  <span className="sr-only"> (concluído, voltar a este passo)</span>
                </button>
              ) : (
                <span className={cn(pillBase, 'bg-surface text-ink-2')}>
                  <span aria-hidden="true" className="tabular-nums">
                    {i + 1}
                  </span>
                  {label}
                  <span className="sr-only"> (próximo)</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
