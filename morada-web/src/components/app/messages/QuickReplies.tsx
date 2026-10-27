export type QuickReply = { id: string; label: string; text: string };

export type QuickRepliesProps = { replies: QuickReply[]; onInsert: (text: string) => void };

export function QuickReplies({ replies, onInsert }: QuickRepliesProps) {
  if (replies.length === 0) return null;
  return (
    <div
      role="group"
      aria-label="Respostas rápidas"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]"
    >
      {replies.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onInsert(r.text)}
          className="t-body-sm inline-flex h-11 shrink-0 items-center rounded-pill border border-line-strong bg-surface px-3.5 whitespace-nowrap text-ink transition-colors hover:bg-bg-alt sm:h-9"
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
