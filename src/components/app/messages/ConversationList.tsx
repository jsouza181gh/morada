import { useRef, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { SegmentedControl } from '@/components/ui';
import { cn } from '@/lib/cn';
import { ConversationItem, type InboxConversation } from './ConversationItem';

export type InboxFilter = 'all' | 'unread';

const FILTERS: { value: InboxFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'Não lidas' },
];

export type ConversationListProps = {
  conversations: InboxConversation[];
  selectedId: string | null;
  onOpen: (id: string) => void;
  filter: InboxFilter;
  onFilterChange: (f: InboxFilter) => void;
  query: string;
  onQueryChange: (q: string) => void;
  className?: string;
};

export function ConversationList({
  conversations,
  selectedId,
  onOpen,
  filter,
  onFilterChange,
  query,
  onQueryChange,
  className,
}: ConversationListProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = conversations.findIndex((c) => c.id === selectedId);
  const tabbable = selectedIndex >= 0 ? selectedIndex : 0;

  function onKeyDown(index: number, e: KeyboardEvent<HTMLButtonElement>) {
    const n = conversations.length;
    let next: number | null = null;
    if (e.key === 'ArrowDown') next = Math.min(index + 1, n - 1);
    else if (e.key === 'ArrowUp') next = Math.max(index - 1, 0);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    refs.current[next]?.focus();
  }

  return (
    <div className={cn('flex min-h-0 min-w-0 flex-col border-line sm:border-r', className)}>
      <div className="flex flex-col gap-4 px-4 pt-5 pb-3">
        <h1 className="font-display text-[24px] leading-[1.15] font-medium tracking-[-0.02em] text-ink">Mensagens</h1>
        <SegmentedControl value={filter} onChange={onFilterChange} options={FILTERS} ariaLabel="Filtrar conversas" />
        <div className="relative">
          <label htmlFor="mensagens-busca" className="sr-only">
            Buscar hóspede
          </label>
          <Search
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2"
          />
          <input
            id="mensagens-busca"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar hóspede"
            className="t-body-sm h-11 w-full rounded-pill border border-line bg-surface pr-4 pl-10 text-ink placeholder:text-ink-2 sm:h-10"
          />
        </div>
      </div>

      {conversations.length === 0 ? (
        <p className="t-body-sm px-4 py-8 text-center text-ink-2">
          {query.trim() ? 'Nenhum hóspede com esse nome.' : 'Nenhuma conversa não lida.'}
        </p>
      ) : (
        <ul aria-label="Conversas" className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {conversations.map((c, i) => (
            <li key={c.id}>
              <ConversationItem
                conversation={c}
                selected={c.id === selectedId}
                tabIndex={i === tabbable ? 0 : -1}
                onOpen={() => onOpen(c.id)}
                onKeyDown={(e) => onKeyDown(i, e)}
                buttonRef={(el) => {
                  refs.current[i] = el;
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
