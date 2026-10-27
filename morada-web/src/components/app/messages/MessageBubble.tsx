import { useState } from 'react';
import type { Message } from '@/mocks/types';
import { cn } from '@/lib/cn';

/** Mensagem na UI: `pending` enquanto o envio otimista não volta da API. */
export type UiMessage = Message & { pending?: boolean };

/** Tradução mock (pt-BR) das mensagens em inglês do mock. */
const TRANSLATIONS: Record<string, string> = {
  'Hello, we just booked the loft for next week.': 'Olá, acabamos de reservar o loft para a semana que vem.',
  'Hi Thomas, welcome. Check-in starts at 3 pm and the building has a 24-hour doorman.':
    'Oi, Thomas, seja bem-vindo. O check-in começa às 15h e o prédio tem portaria 24 horas.',
  'We arrive at 10 pm, is that ok?': 'Chegamos às 22h, tudo bem?',
};

export type MessageBubbleProps = { message: UiMessage };

export function MessageBubble({ message }: MessageBubbleProps) {
  const [translated, setTranslated] = useState(false);
  const host = message.from === 'host';
  const translation = TRANSLATIONS[message.text];
  const showTranslated = translated && translation !== undefined;

  return (
    <div className={cn('flex max-w-[85%] flex-col sm:max-w-[75%]', host ? 'items-end' : 'items-start')}>
      <p
        lang={translation && !showTranslated ? 'en' : undefined}
        className={cn(
          't-body-sm px-4 py-2.5 break-words whitespace-pre-wrap',
          host ? 'rounded-[18px_18px_6px_18px] bg-verde text-on-verde' : 'rounded-[18px_18px_18px_6px] bg-bg-alt text-ink',
          message.pending && 'opacity-70',
        )}
      >
        {showTranslated ? translation : message.text}
      </p>
      {translation && (
        <button
          type="button"
          onClick={() => setTranslated((v) => !v)}
          className="t-caption px-1 pt-1 text-verde hover:underline"
        >
          {showTranslated ? 'Ver original' : 'Traduzir'}
        </button>
      )}
    </div>
  );
}
