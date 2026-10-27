import { useEffect } from 'react';
import { Headline } from '@/components/ui';
import { PricingSection } from '@/components/marketing/pricing/PricingSection';
import { ComparisonTable } from '@/components/marketing/pricing/ComparisonTable';
import { Faq } from '@/components/marketing/pricing/Faq';
import { FinalCta } from '@/components/marketing/pricing/FinalCta';

export default function Pricing() {
  useEffect(() => {
    document.title = 'Preços — Morada';
  }, []);

  return (
    <>
      <section className="bg-bg-alt px-4 pt-24 sm:pt-32">
        <Headline size="hero" title="Planos para cada tamanho." className="max-w-[980px]">
          Todos incluem os seis canais, calendário sincronizado e caixa de entrada única. Teste 14 dias grátis.
        </Headline>
      </section>
      <PricingSection hideTitle />
      <ComparisonTable />
      <Faq tone="alt" />
      <FinalCta />
    </>
  );
}
