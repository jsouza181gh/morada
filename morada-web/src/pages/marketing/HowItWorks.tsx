import { useEffect } from 'react';
import { Button, Headline, Section } from '@/components/ui';
import { Chapter } from '@/components/marketing/how/Chapter';
import { ConnectMockup, NotifyMockup, PublishMockup, RegisterMockup } from '@/components/marketing/how/ChapterMockups';
import { OverbookingStory } from '@/components/marketing/story/OverbookingStory';
import { Steps } from '@/components/marketing/features/Steps';

export default function HowItWorks() {
  useEffect(() => {
    document.title = 'Como funciona — Morada';
  }, []);

  return (
    <>
      <Section tone="white">
        <Headline size="hero" eyebrow="Como funciona" title="Do cadastro à primeira reserva.">
          Veja o caminho completo, com as telas que você vai usar.
        </Headline>
      </Section>

      <Chapter
        number={1}
        tone="alt"
        title="Cadastre uma vez."
        text="Fotos, comodidades, regras, preço e políticas num único formulário em 7 passos. Salvamos o rascunho sozinhos."
      >
        <RegisterMockup />
      </Chapter>

      <Chapter
        number={2}
        tone="white"
        reverse
        title="Conecte seus canais."
        text="Entre na conta de cada plataforma e autorize a Morada. Você pode revogar quando quiser."
      >
        <ConnectMockup />
      </Chapter>

      <Chapter
        number={3}
        tone="alt"
        title="Publique e acompanhe."
        text="Cada canal recebe o anúncio no formato dele. Você vê o status de todos num só lugar."
      >
        <PublishMockup />
      </Chapter>

      <Chapter
        number={4}
        tone="white"
        reverse
        title="Receba e responda."
        text="Reservas fecham o calendário de todos os canais. Mensagens chegam na mesma caixa."
      >
        <NotifyMockup />
      </Chapter>

      <OverbookingStory />
      <Steps />

      <Section tone="white">
        <Headline size="section" title="Pronto para começar?" />
        <div className="mt-8 flex justify-center">
          <Button size="lg" href="/cadastro">
            Cadastrar meu imóvel
          </Button>
        </div>
      </Section>
    </>
  );
}
