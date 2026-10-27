import type { MouseEvent } from 'react';
import { AlertOctagon, AlertTriangle } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import type { Channel } from '@/mocks/types';
import { article, HEALTH_RANK } from './channelText';

/** Faixa com o problema mais grave entre os canais conectados. Não renderiza se tudo estiver ok. */
export function HealthBanner({ channels }: { channels: Channel[] }) {
  const reduced = useReducedMotion();
  const issues = channels
    .filter((c) => c.connected && c.health !== 'ok')
    .sort((a, b) => HEALTH_RANK[b.health] - HEALTH_RANK[a.health]);
  const worst = issues[0];
  if (!worst) return null;

  const isError = worst.health === 'error';
  const Icon = isError ? AlertOctagon : AlertTriangle;
  const others = issues.length - 1;

  function goTo(e: MouseEvent<HTMLAnchorElement>) {
    if (!worst) return;
    const el = document.getElementById(`canal-${worst.id}`);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  }

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg p-5',
        isError ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning',
      )}
    >
      <Icon size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      <p className="t-body-sm min-w-0 flex-1 font-medium">
        {isError ? 'Erro' : 'Atenção'} {article(worst.id).em} {worst.name}: {worst.healthNote ?? 'verifique a sincronização'}.
        {others > 0 && (
          <span className="font-normal">
            {' '}
            {others === 1 ? 'Mais 1 canal precisa de atenção.' : `Mais ${others} canais precisam de atenção.`}
          </span>
        )}
      </p>
      <a href={`#canal-${worst.id}`} onClick={goTo} className="t-body-sm font-medium underline-offset-2 hover:underline">
        Ver detalhes<span aria-hidden="true"> ›</span>
      </a>
    </div>
  );
}
