import type { KeyboardEvent, Ref } from 'react';
import { Avatar } from '@/components/ui';
import { CHANNEL_NAMES, type Conversation } from '@/mocks/types';
import { formatRelative } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { UiMessage } from './MessageBubble';

export type InboxConversation = Omit<Conversation, 'messages'> & { messages: UiMessage[] };

export type ConversationItemProps = {
  conversation: InboxConversation;
  selected: boolean;
  tabIndex: number;
  onOpen: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  buttonRef?: Ref<HTMLButtonElement>;
};

export function ConversationItem({ conversation, selected, tabIndex, onOpen, onKeyDown, buttonRef }: ConversationItemProps) {
  const { guestName, channelId, unread, messages } = conversation;
  const last = messages[messages.length - 1];
  const preview = last ? (last.from === 'host' ? `Você: ${last.text}` : last.text) : '';

  return (
    <button
      ref={buttonRef}
      type="button"
      tabIndex={tabIndex}
      aria-current={selected ? 'true' : undefined}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      className={cn(
        'flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition-colors',
        selected ? 'bg-bg-alt' : 'hover:bg-bg-alt/60',
      )}
    >
      <Avatar name={guestName} size={40} tone={unread > 0 ? 'verde' : 'neutral'} aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex items-baseline gap-2">
          <span className={cn('t-body-sm truncate text-ink', unread > 0 && 'font-medium')}>{guestName}</span>
          {last && <span className="t-caption ml-auto shrink-0 text-ink-2">{formatRelative(last.sentAt)}</span>}
        </span>
        <span className="t-caption text-ink-2">via {CHANNEL_NAMES[channelId]}</span>
        <span className="mt-0.5 flex items-center gap-2">
          <span className="t-body-sm min-w-0 flex-1 truncate text-ink-2">{preview}</span>
          {unread > 0 && (
            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-pill bg-verde px-1.5 text-[12px] leading-none font-medium text-on-verde">
              {unread}
              <span className="sr-only"> {unread === 1 ? 'não lida' : 'não lidas'}</span>
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
