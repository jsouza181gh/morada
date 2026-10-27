import { Avatar, Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { getTeam } from '@/mocks/api';

const SHOWN = 4;
const TONES = ['verde', 'dark', 'verde', 'dark'] as const;

export function TeamTile() {
  const { data: team } = useMock(getTeam);
  const shown = team?.slice(0, SHOWN) ?? [];
  const rest = team ? team.length - shown.length : 0;

  return (
    <div className="flex h-full flex-col gap-8 sm:justify-between md:flex-row md:items-center">
      <div className="flex max-w-[40ch] flex-col gap-2">
        <h3 className="font-display text-[28px] leading-[32px] font-semibold tracking-[-0.02em]">
          A equipe toda no mesmo painel.
        </h3>
        <p className="t-body text-ink-2">Limpeza, check-in e financeiro, cada um vendo só o que precisa.</p>
      </div>

      {team ? (
        <ul className="flex shrink-0 items-center" aria-label="Equipe">
          {shown.map((m, i) => (
            <li key={m.id} className={i > 0 ? '-ml-[10px]' : undefined}>
              <Avatar name={m.name} size={48} tone={TONES[i % TONES.length]} className="border-[3px] border-bg-alt" />
            </li>
          ))}
          {rest > 0 && (
            <li className="-ml-[10px]">
              <span
                role="img"
                aria-label={`e mais ${rest} ${rest === 1 ? 'pessoa' : 'pessoas'}`}
                className="inline-flex size-12 items-center justify-center rounded-pill border-[3px] border-bg-alt bg-surface text-[15px] font-medium text-ink-2"
              >
                <span aria-hidden="true">+{rest}</span>
              </span>
            </li>
          )}
        </ul>
      ) : (
        <Skeleton className="h-12 w-[220px] shrink-0 rounded-pill" />
      )}
    </div>
  );
}
