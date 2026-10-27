import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { cn } from '@/lib/cn';
import { getFaq } from '@/mocks/api';
import type { FaqItem } from '@/mocks/types';

function faqJsonLd(items: FaqItem[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  // evita que um "</script>" no texto feche a tag
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** `tone` alterna o fundo conforme a seção anterior (landing: branco; /precos: cinza). */
export function Faq({ tone = 'white' }: { tone?: 'white' | 'alt' }) {
  const { data: items, loading } = useMock(getFaq);
  const jsonLd = useMemo(() => (items ? faqJsonLd(items) : null), [items]);

  return (
    <section id="duvidas" className={cn('px-4 py-36', tone === 'alt' ? 'bg-bg-alt' : 'bg-bg')}>
      <div className="mx-auto max-w-[820px]">
        <h2 className="t-section">Perguntas frequentes.</h2>

        {loading || !items ? (
          <div className="mt-12 flex flex-col gap-4" aria-busy="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <Accordion
            type="multiple"
            className="mt-12 border-t border-line motion-reduce:[&_[data-slot=accordion-content]]:animate-none"
          >
            {items.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-b border-line">
                <AccordionTrigger className="group items-center gap-6 rounded-none border-0 py-6 text-[19px] leading-[26px] font-semibold text-ink hover:no-underline focus-visible:ring-0 [&>[data-slot=accordion-trigger-icon]]:hidden">
                  <span>{item.q}</span>
                  <Plus
                    size={24}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-ink-2 transition-transform duration-300 group-aria-expanded:rotate-45 motion-reduce:transition-none"
                  />
                </AccordionTrigger>
                <AccordionContent className="t-body max-w-[64ch] pb-6 text-ink-2">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {jsonLd && <script type="application/ld+json">{jsonLd}</script>}
      </div>
    </section>
  );
}
