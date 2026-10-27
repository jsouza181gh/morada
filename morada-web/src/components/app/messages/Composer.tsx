import { useId, useLayoutEffect, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { ArrowUp } from 'lucide-react';
import { IconButton } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { QuickReplies, type QuickReply } from './QuickReplies';

/** 6 linhas de 20px + padding vertical + borda. */
const MAX_HEIGHT = 144;

export type ComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: (text: string) => void;
  placeholder: string;
  replies: QuickReply[];
  onInsertReply: (text: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function Composer({ value, onChange, onSend, placeholder, replies, onInsertReply, textareaRef }: ComposerProps) {
  const id = useId();
  const canSend = value.trim().length > 0;

  // Autoexpansão (1–6 linhas) também onde `field-sizing: content` não existe.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, MAX_HEIGHT)}px`;
  }, [value, textareaRef]);

  function submit() {
    const text = value.trim();
    if (text) onSend(text);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-line px-4 pt-3 pb-4 sm:px-6">
      <QuickReplies replies={replies} onInsert={onInsertReply} />
      <form onSubmit={onSubmit} className="mt-2 flex items-end gap-2">
        <label htmlFor={id} className="sr-only">
          Mensagem
        </label>
        <Textarea
          id={id}
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="max-h-[144px] min-h-11 resize-none rounded-[22px] border-line-strong bg-surface px-4 py-[11px] text-[16px] leading-5 text-ink placeholder:text-ink-2 focus-visible:border-verde focus-visible:ring-0 sm:text-[14px] md:text-[14px] dark:bg-surface"
        />
        <IconButton type="submit" label="Enviar" variant="solid" disabled={!canSend}>
          <ArrowUp size={20} strokeWidth={1.5} aria-hidden="true" />
        </IconButton>
      </form>
    </div>
  );
}
