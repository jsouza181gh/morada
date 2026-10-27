import { useLayoutEffect, useRef, type RefObject } from 'react';
import { Archive, MailOpen, MoreHorizontal } from 'lucide-react';
import { Button, IconButton } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CHANNEL_NAMES, type Property, type Reservation } from '@/mocks/types';
import { addDays, TODAY } from '@/lib/date';
import { formatDateShort, formatRange } from '@/lib/format';
import { cn } from '@/lib/cn';
import { Composer } from './Composer';
import type { InboxConversation } from './ConversationItem';
import { MessageBubble, type UiMessage } from './MessageBubble';
import type { QuickReply } from './QuickReplies';

/** Data e hora locais (America/Sao_Paulo, UTC-3) de um ISO em UTC. */
function local(iso: string): { day: string; time: string } {
  const shifted = new Date(Date.parse(iso) - 3 * 3_600_000).toISOString();
  return { day: shifted.slice(0, 10), time: shifted.slice(11, 16) };
}

function dayLabel(day: string): string {
  if (day === TODAY) return 'Hoje';
  if (day === addDays(TODAY, -1)) return 'Ontem';
  return formatDateShort(day);
}

type Group = { from: UiMessage['from']; messages: UiMessage[] };
type Day = { day: string; groups: Group[] };

/** Agrupa por dia e, dentro do dia, por remetentes consecutivos. */
function groupMessages(messages: UiMessage[]): Day[] {
  const days: Day[] = [];
  for (const m of messages) {
    const { day } = local(m.sentAt);
    let d = days[days.length - 1];
    if (!d || d.day !== day) {
      d = { day, groups: [] };
      days.push(d);
    }
    const g = d.groups[d.groups.length - 1];
    if (g && g.from === m.from) g.messages.push(m);
    else d.groups.push({ from: m.from, messages: [m] });
  }
  return days;
}

export type ThreadProps = {
  conversation: InboxConversation;
  property?: Property;
  reservation?: Reservation;
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: (text: string) => void;
  replies: QuickReply[];
  onInsertReply: (text: string) => void;
  composerRef: RefObject<HTMLTextAreaElement | null>;
  onBack: () => void;
  onShowDetails: () => void;
  onMarkUnread: () => void;
  onArchive: () => void;
};

export function Thread({
  conversation,
  property,
  reservation,
  draft,
  onDraftChange,
  onSend,
  replies,
  onInsertReply,
  composerRef,
  onBack,
  onShowDetails,
  onMarkUnread,
  onArchive,
}: ThreadProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const channel = CHANNEL_NAMES[conversation.channelId];
  const firstName = conversation.guestName.startsWith('Família')
    ? conversation.guestName
    : (conversation.guestName.split(' ')[0] ?? conversation.guestName);
  const days = groupMessages(conversation.messages);
  const lastHostId = [...conversation.messages].reverse().find((m) => m.from === 'host')?.id;

  // Rola para o fim ao abrir a conversa e a cada mensagem nova.
  useLayoutEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.id, conversation.messages.length]);

  const meta = [`via ${channel}${property ? `, ${property.name}` : ''}`];
  if (reservation) meta.push(formatRange(reservation.checkIn, reservation.checkOut));

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-line px-3 py-2.5 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="t-body-sm inline-flex min-h-11 shrink-0 items-center pr-1 text-verde sm:hidden"
        >
          <span aria-hidden="true">‹&nbsp;</span>Mensagens
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] leading-6 font-medium text-ink">{conversation.guestName}</h2>
          <p className="t-caption truncate text-ink-2">{meta.join(' · ')}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onShowDetails} className="shrink-0 max-sm:min-h-11 @min-[960px]:hidden">
          Detalhes
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label="Mais opções" variant="ghost">
              <MoreHorizontal size={20} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="app-scope w-56 bg-surface text-ink">
            <DropdownMenuItem onSelect={onMarkUnread} className="t-body-sm">
              <MailOpen size={18} strokeWidth={1.5} aria-hidden="true" />
              Marcar como não lida
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onArchive} className="t-body-sm">
              <Archive size={18} strokeWidth={1.5} aria-hidden="true" />
              Arquivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={`Conversa com ${conversation.guestName}`}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-6 sm:px-6"
      >
        {days.map((d) => (
          <div key={d.day}>
            <p className="t-caption my-4 text-center text-ink-2">{dayLabel(d.day)}</p>
            {d.groups.map((g) => {
              const last = g.messages[g.messages.length - 1]!;
              const host = g.from === 'host';
              const showChannel = host && last.id === lastHostId && !last.pending;
              return (
                <div key={g.messages[0]!.id} className={cn('mb-4 flex flex-col gap-1', host ? 'items-end' : 'items-start')}>
                  {g.messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                  <p className="t-caption px-1 text-ink-2">
                    {last.pending ? 'Enviando…' : local(last.sentAt).time}
                  </p>
                  {showChannel && <p className="t-caption px-1 text-ink-2">Enviado pelo {channel}</p>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Composer
        value={draft}
        onChange={onDraftChange}
        onSend={onSend}
        // "a" (não "ao"): o mock não tem gênero do hóspede.
        placeholder={`Responder a ${firstName} pelo ${channel}`}
        replies={replies}
        onInsertReply={onInsertReply}
        textareaRef={composerRef}
      />
    </div>
  );
}
